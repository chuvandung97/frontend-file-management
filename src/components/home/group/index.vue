<template>
    <v-card flat>
        <v-card-title>
            Danh sách nhóm
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Tìm kiếm"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="desserts"
            :search="search"
            :loading="isLoading"
            item-key="name"
            :show-select=true
            :footer-props="{
                itemsPerPageText: 'Hiển thị',
            }"
        >
            <template v-slot:progress>
                <Loading /> 
            </template>
            <template v-slot:no-data>
                Không có dữ liệu
            </template>
            <template v-slot:no-results>
                Không tìm thấy kết quả
            </template>
            <template v-slot:item.member_count="{ item }">
                <span class="ml-n4">{{item.storage != null ? item.storage.Users.length : 0}}</span>
            </template>
            <template v-slot:item.user_created="{ item }">
                {{ item.User ? (item.User.id == userId ? 'tôi' : item.User.name) : '' }}
            </template>
            <template v-slot:item.created_at="{ item }">
                {{ item.updatedAt | formatDate }}
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Thêm mới</v-btn>
                    </template>
                    <v-card>
                    <v-card-title class="headline primary white--text" primary-title>
                        <span class="headline">Thêm mới nhóm</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                        <v-form ref="form" lazy-validation v-model="valid">
                            <v-row>
                            <v-text-field 
                                v-model="name" 
                                label="Tên" 
                                required 
                                :counter="30" 
                                :rules="nameRules"
                                ></v-text-field>
                            </v-row>
                        </v-form>
                        </v-container>
                    </v-card-text>

                    <v-card-actions class="mt-n6 mr-4">
                        <v-spacer></v-spacer>
                        <v-btn 
                            color="primary" 
                            text 
                            @click="close"
                            class="text-none"
                            depressed
                            outlined
                        >Hủy</v-btn>
                        <v-btn color="primary" depressed class="text-none" @click="save">Lưu</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-spacer></v-spacer>
                <v-btn 
                    depressed 
                    text 
                    icon
                    v-if="selected.length > 0"
                    @click="deleteGroup()"
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
                </v-toolbar>
            </template>
            <template v-slot:item.edit="{ item }">
                <v-btn text icon :to="{ name: 'group.update', params: {groupId: item.id}, query: {name: item.name, description: item.description}}">
                    <v-icon small>edit</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </v-card>   
</template>

<script>
import Axios from 'axios'
import moment from 'moment'
import Vue from 'vue'
import Loading from '../layouts/Loading'

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
})
export default {
    components: {
        Loading
    },
    data () {
        return {
            name: null,
            valid: true,
            dialog: false,
            search: '',
            selected: [],
            headers: [
            {
                text: 'Tên',
                align: 'left',
                value: 'name',
            },
            { text: 'Số thành viên', align: 'center', value: 'member_count' },
            { text: 'Người tạo', align: 'center', value: 'user_created' },
            { text: 'Ngày tạo', align: 'center', value: 'created_at' },
            { text: 'Chỉnh sửa', align: 'center', value: 'edit', sortable: false },
            ],
            desserts: [],
            nameRules: [
                v => !!v || 'Mời bạn nhập tên',
                v => (v && v.length <= 30) || 'Tên phải nhỏ hơn 30 kí tự',
            ],
            isLoading: false
        }
    },

    mounted() {
        this.getGroup()
    },

    methods: {
        async getGroup() {
            this.isLoading = true
            this.useremail = localStorage.getItem('useremail')
            try {
                let res = await Axios.get('http://localhost:3000/groups/lists', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                })  
                this.desserts = res.data.body.group_list
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },

        close () {
            this.$refs.form.resetValidation()
            this.dialog = false
        },

        async save () {
            if(this.$refs.form.validate()) {
            try {
                let res = await Axios.post('http://localhost:3000/groups/add', {
                name: this.name
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
                this.getGroup()
                this.$refs.form.resetValidation()
                this.close()
            }
            }
        },

        async deleteGroup() {
            let groupIds = this.selected.map((currentElArray) => {
                return currentElArray.id
            })
            try {
                let res = await Axios.delete('http://localhost:3000/groups/delete', {
                    params: {
                    groupIds: groupIds
                    }
                })
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: res.data.message + res.data.count + ' nhóm !',
                    showNoti: true
                })
            } catch (e) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Xóa thất bại !',
                    showNoti: true
                })
            } finally {
                this.getGroup()
                this.selected = []
            }
        }
    }
}
</script>
