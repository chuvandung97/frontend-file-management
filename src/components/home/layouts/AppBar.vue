<template>
    <v-app-bar
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        color="blue darken-3"
        dark
    >
        <v-app-bar-nav-icon @click.stop="clickExpandDrawer()"></v-app-bar-nav-icon>
        <v-col cols="3" md="3" class="hidden-sm-and-down">
            <v-toolbar-title
                class="ml-0 pl-3"
            >
                <span>Hệ thống quản lý file</span>
            </v-toolbar-title>
        </v-col>
        <v-col cols="9" md="5" xl="3">
            <v-autocomplete
                v-model="textSearch"
                flat
                :items="itemSearches"
                :loading="loading"
                :search-input.sync="search"
                hide-no-data
                solo-inverted
                return-object
                item-text="name"
                clearable
                hide-details
                prepend-inner-icon="search"
                label="Tìm kiếm"
                color="primary"
                v-if="roleDescription != 'Sysadmin' && roleDescription != 'Admin'"
            >
                <template v-slot:item="{ item }">
                    <v-icon class="mr-3" v-if="item.filetypedetail" :color="item.filetypedetail.color">{{item.filetypedetail.icon}}</v-icon>
                    <v-icon class="mr-3" v-else>mdi-folder</v-icon> 
                    <v-list-item-content>
                        <v-list-item-title v-text="item.name"></v-list-item-title>
                        <v-list-item-subtitle>{{item.User.name}}</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
                <template v-slot:append>
                    <v-menu 
                        min-width="525"
                        max-height="525"
                        open-delay="500"
                        nudge-right="12"
                        nudge-bottom="5"
                        bottom
                        left
                        content-class="dropdown-menu"
                        offset-y
                        transition="slide-y-transition"
                        :close-on-content-click='false'
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn text icon depressed small v-on="on">
                                <v-icon>mdi-menu-down</v-icon> 
                            </v-btn>   
                        </template>
                        <v-card>
                            <v-card-text class="pa-0 search-card">
                                <v-form>
                                    <v-row class="mb-n3 px-5">
                                        <v-col md="4" class="py-0 d-flex align-center">
                                            Loại:
                                        </v-col>
                                        <v-col md="5" class="pa-0">
                                            <v-select :items="typeSearchItems" return-object>
                                                <template v-slot:item="{ item }">
                                                    <v-icon class="mr-2" :color="item.color">{{item.icon}}</v-icon>
                                                    {{item.name}}
                                                </template>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5">
                                        <v-col md="4" class="py-0 d-flex align-center">
                                            Chủ sở hữu:
                                        </v-col>
                                        <v-col md="5" class="pa-0">
                                            <v-select :items="ownerSearchItems"></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5">
                                        <v-col md="4" class="py-0 d-flex align-center">
                                            Địa điểm:
                                        </v-col>
                                        <v-col md="3" class="pa-0">
                                            <v-checkbox label="Kho của tôi"></v-checkbox>
                                        </v-col>
                                        <v-col md="3" class="pa-0">
                                            <v-checkbox label="Thùng rác"></v-checkbox>
                                        </v-col>
                                    </v-row>
                                    <v-divider></v-divider>
                                    <v-row class="mb-n3 px-5">
                                        <v-col md="4" class="py-0 d-flex align-center">
                                            Tên:
                                        </v-col>
                                        <v-col md="5" class="pa-0">
                                            <v-text-field
                                                placeholder="Nhập cụm từ cần tìm kiếm"
                                                style="font-size: 14px"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5">
                                        <v-col md="4" class="py-0 d-flex align-center">
                                            Kích cỡ:
                                        </v-col>
                                        <v-col md="5" class="pa-0">
                                            <v-select></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5">
                                        <v-col md="4" class="py-0 d-flex align-center">
                                            Cập nhật lần cuối:
                                        </v-col>
                                        <v-col md="5" class="pa-0">
                                            <v-select></v-select>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>                            
                            <v-card-actions>
                                <v-btn
                                    @click="''"
                                    depressed
                                    text
                                    color="primary"
                                    outlined
                                    class="caption font-weight-bold"
                                >Đặt lại</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    @click="''"
                                    depressed
                                    class="caption font-weight-bold"
                                >Tìm kiếm</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-menu>
                </template>
            </v-autocomplete>
        </v-col>
        <v-col cols="2" md="2" class="hidden-sm-and-down">
            <v-spacer></v-spacer>
        </v-col>
        <v-col cols="2" md="2">
            <div class="float-right">
            <v-btn icon>
                <v-icon>notifications</v-icon>
            </v-btn>
            <v-menu
                min-width="150"
                bottom
                left
                content-class="dropdown-menu"
                offset-y
                transition="slide-y-transition"
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        large
                        v-on="on"
                        class="hidden-sm-and-down"
                    >
                        <v-avatar>
                        <v-icon dark>mdi-account-circle</v-icon>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-card>
                    <v-list dense>
                        <v-list-item to="/user/profile">
                            <v-list-item-title><v-icon class="mr-4">person_outline</v-icon> Hồ sơ</v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title><v-icon class="mr-4">mdi-settings</v-icon> Cài đặt</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item @click="logout()">
                            <v-list-item-title ><v-icon class="mr-4">mdi-logout</v-icon> Đăng xuất</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
            </div>
        </v-col>
    </v-app-bar>
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            expandDrawer: true,
            roleDescription: null, 
            search: null,
            itemSearches: [],
            desserts: [],
            textSearch: null,
            loading: false,
            typeSearchItems: [
                {
                    name: 'Hình ảnh',
                    icon: 'mdi-file-image',
                    color: 'primary'
                },
                {
                    name: 'Tài liệu',
                    icon: 'mdi-file-word-box',
                    color: 'primary'
                }
            ],
            ownerSearchItems: ['Bất kì ai', 'Tôi', 'Không phải tôi'],
        }
    },

    async mounted() {
        this.roleDescription = localStorage.getItem('userrole')
        let res = await Axios.get('http://localhost:3000/folderfiles/lists', {
            params: {
                storage_id: localStorage.getItem('bucket'),
                active: 1,
                search: true
            }
        })
        this.desserts = res.data.body.folder_file_list
    },

    watch: {
        search (val) {
            if(val === "" || val === null || val === undefined) {
                this.itemSearches = []
            }
            val && val !== this.textSearch && this.querySelections(val) 
        },
        textSearch (val) {
            if(val) {
                if (val.filetypedetail) {
                    if(val.folders.length > 0) {
                        this.$router.push('/user/folder/' + val.folders[0].id)
                    } else {
                        this.$router.push('/user/drive')
                    }
                    this.$store.commit('setSearchIndexDrive', {
                        selectId: val.id,
                        selectType: val.filetypedetail
                    })
                } else {
                    this.$router.push('/user/folder/' + val.id)
                }
                this.search = null
            }
        }
    },

    methods: {
        clickExpandDrawer() {
            this.expandDrawer = !this.expandDrawer
            this.$store.commit('setExpandDrawer', this.expandDrawer)
        },

        querySelections (v) {
            this.loading = true
            setTimeout(() => {
                this.itemSearches = this.desserts.filter(e => {
                    return (e.name || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
                })
                this.loading = false
            }, 500)
        },

        async logout() {
            try {
                await Axios.post('http://localhost:3000/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                })
                let storage = ['jwt_token', 'userid', 'username', 'useremail', 'userrole', 'bucket', 'rolegroup']
                storage.map((elCurrent) => {
                    return localStorage.removeItem(elCurrent)
                })
                this.$router.go('/')
            } catch (error) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Đăng xuất thất bại !',
                    showNoti: true
                })
            }
        },
    }
}
</script>

<style scoped>
    .search-card[data-v-17d61de8] {
        color: black;
        font-size: 14px
    }
</style>
