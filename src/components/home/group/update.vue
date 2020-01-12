<template>
<div>
    <v-card flat>
    <v-row>
        <v-col md="4" cols="12">
            <v-card-title>
                Cập nhật thông tin nhóm
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" md="12">
                            <v-text-field 
                                v-model="name"
                                label="Tên" 
                                required 
                                :counter="20" 
                                :rules="[v => !!v || 'Mời bạn nhập tên']"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                            <v-textarea
                                v-model="description" 
                                label="Mô tả"
                                counter
                                auto-grow
                                clearable
                                dense
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn class="mb-2 ml-3" color="primary" exact depressed text outlined :to="{ name: 'group' }"><v-icon>mdi-arrow-left</v-icon>Quay lại</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" depressed class="mb-2" @click="updateGroup()">Cập nhật</v-btn>
            </v-card-actions>
        </v-col>
        <v-col md="8" cols="12">
            <v-card-text class="mt-10">
                <v-row>
                    <v-col cols="6" sm="6" md="6">
                        <v-autocomplete
                            v-model="model"
                            :items="items"
                            :hide-selected="true"
                            label="Thêm thành viên"
                            multiple
                            persistent-hint
                            :small-chips="true"
                            :clearable="true"
                            deletable-chips
                            item-text="name"
                            :error-messages="errorMessage"
                            return-object
                        >
                        <template v-if="noData" v-slot:no-data>
                            <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                Không có dữ liệu.
                                </v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                        </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col class="d-flex align-center" cols="3" sm="4" md="4">
                        <v-btn class="mx-2" dark color="indigo" @click="addMemberToGroup()">
                            <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col class="d-flex align-center justify-end">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            v-if="selected.length > 0"
                            @click="removeUserfromGroup()"
                        >
                            <v-badge
                                color="primary"
                                overlap
                                class="align-self-center"
                            >
                                <template v-slot:badge>
                                <span>{{ selected.length }}</span>
                                </template>
                                <v-icon large>
                                delete
                                </v-icon>
                            </v-badge>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-data-table 
                v-model="selected"
                :headers="headers"
                :items="desserts"
                :search="search"
                item-key="name"
                :loading="isLoading"
                :show-select=true
                :items-per-page="5"
                :footer-props="{
                    itemsPerPageText: 'Hiển thị',
                }"
            >
            <template v-slot:progress>
                <Loading /> 
            </template>
            <template v-slot:item.role_group="{ item }">
                <v-btn-toggle color="primary" dense mandatory borderless v-model="item.rolegroup.code" @change="updateRoleCode(item.rolegroup.code, item.id)">
                    <v-btn class="text-none caption" :value="'READWRITE'">Đọc ghi</v-btn>
                    <v-btn class="text-none caption" :value="'READ'">Chỉ Đọc</v-btn>
                </v-btn-toggle>
            </template>
            <template v-slot:item.active="{ item }">
                <v-chip :color="getColor(item.active)" dark>{{ item.active == true ? 'Hoạt động' : 'Không hoạt động' }}</v-chip>
            </template>
            </v-data-table>
        </v-col>
    </v-row>
    </v-card>
</div>
</template>

<script>
import Axios from 'axios'
import Loading from '../layouts/Loading'
export default {
    components: {
        Loading
    },
    data () {
        return {
            name: null,
            description: null,
            items: [],
            model: [],
            searchAddMember: null,
            memberList: false,
            noData: true,
            dialog: false,
            search: '',
            selected: [],
            headers: [
            {
                text: 'Họ tên',
                align: 'left',
                sortable: false,
                value: 'name',
            },
            { text: 'Email', value: 'email' },
            { text: 'Vai trò trong nhóm', sortable: false, align: 'center', value: 'role_group'},
            { text: 'Trạng thái', align: 'center', value: 'active' },
            ],
            desserts: [],
            errorMessage: null,
            isLoading: false
        }
    },

    mounted() {
        this.name = this.$route.query.name
        this.description = this.$route.query.description
        this.getUserCodeIsGroup()
        this.getMemberGroup()
    },

    watch: {
        model: function() {
            if(this.model.length > 0) {
                this.errorMessage = null
            }
        }
    },

    methods: {
        getColor(active) {
            if(active) return 'green'
            else return 'gray'
        },

        async updateGroup() {
            if(this.$refs.form.validate()) {
                try {
                    let res = await Axios.post('http://localhost:3000/groups/update/' + this.$route.params.groupId, {
                        name: this.name,
                        description: this.description
                    }) 
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message,
                        showNoti: true
                    })
                    this.$router.push('/user/group')
                } catch(e) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Cập nhật thất bại !',
                        showNoti: true
                    })
                }
            }
        },

        async getUserCodeIsGroup() {
            try {
                let res = await Axios.get('http://localhost:3000/users/lists/rolegroup')  
                this.items = res.data.body.user_list
            } catch (error) {
                console.log(error)
            }
        },

        async getMemberGroup() {
            try {
                this.isLoading = true
                let res = await Axios.get('http://localhost:3000/groups/list/id', {
                    params: {
                    groupId: this.$route.params.groupId
                    }
                })  
                this.desserts = res.data.body.group.storage.Users
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },

        async addMemberToGroup() {
            if(this.model.length == 0) {
                this.errorMessage = 'Mời bạn chọn thành viên'
                setTimeout(() => {
                    this.errorMessage = null
                }, 3000)
            } else {
                this.isLoading = true
                let userIds = this.model.map((currentElArray) => {
                    return currentElArray.id
                })
                try {
                    let res = await Axios.post('http://localhost:3000/users/add/togroup', {
                        userIds: userIds,
                        groupId: this.$route.params.groupId
                    })  
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message,
                        showNoti: true
                    })
                } catch (error) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Thêm mới thất bại',
                        showNoti: true
                    })
                } finally {
                    this.isLoading = false
                    this.model = []
                    this.getMemberGroup()
                    this.getUserCodeIsGroup()
                }
            }                
        },

        async removeUserfromGroup() {
            let userIds = this.selected.map((currentElArray) => {
                return currentElArray.id
            })
            try {
                this.isLoading = true
                let res = await Axios.post('http://localhost:3000/users/remove/fromgroup', {
                    userIds: userIds
                })
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: res.data.message + res.data.count + ' người dùng khỏi nhóm !',
                    showNoti: true
                })
            } catch (e) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Xóa thất bại !',
                    showNoti: true
                })
            } finally {
                this.isLoading = false
                this.getMemberGroup()
                this.getUserCodeIsGroup()
                this.selected = []
            }
        },

        async updateRoleCode(codeId, id) {
            try {
                await Axios.post('http://localhost:3000/users/update/rolegroup/' + id, {
                    code: codeId
                }) 
            } catch (error) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Thất bại !',
                    showNoti: true
                })
            }
        },
    }
  }
</script>
