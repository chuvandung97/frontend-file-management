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
        <v-col cols="9" md="5">
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
                        open-delay="500"
                        nudge-right="12"
                        bottom
                        left
                        content-class="dropdown-menu"
                        offset-y
                        transition="slide-y-transition"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn text icon depressed small v-on="on">
                                <v-icon>mdi-menu-down</v-icon> 
                            </v-btn>   
                        </template>
                        <v-card>
                            <v-card-text>
                                <v-list dense>
                                <v-list-item>
                                    <v-list-item-action>
                                        Loại
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-select :items="itemss"></v-select>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-action>
                                        Loại
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-select></v-select>
                                    </v-list-item-content>
                                </v-list-item>
                                </v-list>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn
                                    @click="''"
                                    class="text-none"
                                    depressed
                                    text
                                    color="primary"
                                    outlined
                                >Đặt lại</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    @click="''"
                                    class="text-none"
                                    depressed
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
import { mapState } from 'vuex'
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
            itemss: ['Foo', 'Bar', 'Fizz', 'Buzz'],
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
