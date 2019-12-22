<template>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
        >
            <v-card flat class="mb-1">
                <v-card-title class="d-flex justify-center">
                <v-avatar >
                    <img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    class="mx-auto d-block"
                    >
                </v-avatar>
                </v-card-title>
                <v-card-text class="text-center">
                    <h5 class="category text-gray font-weight-bold">{{ roleDescription }}</h5>
                    <h4 class="card-title font-weight-light">{{ name }}</h4>
                </v-card-text>
                <v-card-actions class="d-flex justify-center" v-if="roleDescription != 'Admin' && roleDescription != 'Sysadmin'">
                    <v-menu
                        bottom
                        origin="center center"
                        transition="scale-transition"
                        close-on-content-click
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn
                                color="primary"
                                dark
                                rounded
                                class="text-none px-12"
                                v-on="on"
                            >
                                Tạo mới
                            </v-btn>
                        </template>

                        <v-list min-width="250">
                            <v-list-item @click="dialog = true" :disabled="rolegroup == 'READ' ? true : false">
                                <v-list-item-icon><v-icon :disabled="rolegroup == 'READ' ? true : false">create_new_folder</v-icon></v-list-item-icon>
                                <v-list-item-title class="body-2 font-weight-medium ml-n3">Thư mục</v-list-item-title>
                            </v-list-item>
                            <v-list-item class="file-upload" @click="showUploadFile()" :disabled="rolegroup == 'READ' ? true : false">
                                <v-list-item-icon><v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-upload</v-icon></v-list-item-icon>
                                <v-list-item-title class="body-2 font-weight-medium ml-n3">Tải tệp lên</v-list-item-title>
                                <input style="display: none" type="file" id="file" name="file" ref="file" :accept="typeList" v-on:change="handleFileUpload()"/>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-dialog v-model="dialog" width="400" persistent>
                        <v-card>
                            <v-card-title
                                class="headline primary white--text"
                                primary-title
                            >
                                Tạo mới thư mục
                            </v-card-title>

                            <v-card-text>
                                <v-text-field
                                v-model="name_folder"
                                label="Tên"
                                required
                                class="mt-3"
                                :rules="[v => !!v || 'Mời bạn nhập tên']"
                                >
                                </v-text-field>
                            </v-card-text>
                            <v-card-actions class="mt-n6 mr-4">
                                <v-spacer></v-spacer>
                                <v-btn
                                    @click="cancelCreateFolder()"
                                    class="text-none"
                                    depressed
                                    text
                                    color="primary"
                                    outlined
                                >Hủy</v-btn>
                                <v-btn
                                    color="primary"
                                    @click="createFolder()"
                                    class="text-none"
                                    depressed
                                    :disabled="name_folder == '' ? true : false"
                                >Tạo</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-actions>
            </v-card>
            <v-list dense>
                <template v-for="item in items">
                    <v-layout
                        v-if="item.heading"
                        :key="item.heading"
                        row
                        align-center
                    >
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>
                        <v-flex
                            xs6
                            class="text-xs-center"
                        >
                            <a
                                href="#!"
                                class="body-2 black--text"
                            >EDIT</a>
                        </v-flex>
                    </v-layout>
                    <v-list-group
                        v-else-if="item.children"
                        :key="item.name"
                        v-model="item.model"
                        :prepend-icon="item.model ? item.icon : item['icon-alt']"
                        append-icon=""
                    >
                        <template v-slot:activator>
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title>
                                    {{ item.name }}
                                </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                        <v-list-item
                            v-for="(child, i) in item.children"
                            :key="i"
                        >
                            <v-list-item-action v-if="child.icon">
                                <v-icon>{{ child.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ child.name }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                    <v-list-item
                        v-else-if="item.active"
                        :key="item.name"
                        :to="item.router_link"
                        color="primary"
                    >
                        <v-list-item-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.name }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <v-divider></v-divider>
                <v-list-item @click="logout()">
                    <v-list-item-action>
                        <v-icon>mdi-logout</v-icon>
                    </v-list-item-action>
                    <v-list-item-content >
                        <v-list-item-title>Đăng xuất</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="blue darken-3"
            dark
        >
        
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
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
                    <!-- <template v-slot:no-data>
                        <v-list-item>
                            <v-list-item-title>
                                Không tìm thấy kết quả cho
                                <strong>{{search}}</strong>
                            </v-list-item-title>
                        </v-list-item>
                    </template> -->

                    <template v-slot:item="{ item }">
                        <v-icon class="mr-3" v-if="item.type == 'image/png'" color="primary">mdi-file-image</v-icon>
                        <v-icon class="mr-3" v-else-if="item.type == 'application/docx'" color="blue">mdi-file-word-box</v-icon> 
                        <v-icon class="mr-3" v-else-if="item.type == 'application/pdf'" color="red">mdi-file-pdf-box</v-icon>
                        <v-icon class="mr-3" v-else-if="item.type == 'application/xlsx'" color="green">mdi-file-excel-box</v-icon>
                        <v-icon class="mr-3" v-else-if="item.type == 'application/pptx'" color="orange">mdi-file-powerpoint-box</v-icon>
                        <v-icon class="mr-3" v-else-if="item.type == 'video/mp4'" color="red">mdi-file-video</v-icon>
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
    </div>
</template>

<script>
import Axios from 'axios'
import { mapState } from 'vuex'
export default {
    data () {
        return {
            drawer: null,
            items: [],
            roleDescription: null, 
            name: null,
            dialog: false,
            name_folder: 'Thư mục mới',
            search: null,
            itemSearches: [],
            desserts: [],
            textSearch: null,
            loading: false,
            itemss: ['Foo', 'Bar', 'Fizz', 'Buzz'],
            typeList: []
        }
    },

    async mounted() {
        this.getMenu()
        this.getDetailFileType()
        this.name = localStorage.getItem('username')
        this.roleDescription = localStorage.getItem('userrole')
        this.$store.commit('setRoleGroup', localStorage.getItem('rolegroup'))
        let res = await Axios.get('http://localhost:3000/folderfiles/lists', {
            params: {
                storage_id: localStorage.getItem('bucket'),
                active: 1,
                search: true
            }
        })
        this.desserts = res.data.body.folder_file_list
    },

    computed: {
        ...mapState ([
            'rolegroup'
        ])
    },

    watch: {
        search (val) {
            if(val === "" || val === null || val === undefined) {
                this.itemSearches = []
            }
            val && val !== this.textSearch && this.querySelections(val) 
        },
        textSearch (val) {
            if (val.parent_id) {
                this.$router.push('/user/folder/' + val.parent_id)
            } else if (val.folders.length > 0) {
                this.$router.push('/user/folder/' + val.folders[0].id)
            } else {
                this.$router.push('/user/drive')
            }
            this.itemSearches = []
        }
    },

    methods: {
        async getMenu() {
            try {
                let res = await Axios.get('http://localhost:3000/menus/lists/role', {
                    params: {
                        role: localStorage.getItem('userrole')
                    }
                })  
                this.items = res.data.body.menu_list
            } catch (error) {
                console.log(error)
            }
        },

        async getDetailFileType() {
            try {
                let res = await Axios.get('http://localhost:3000/files/lists/detailtype')
                this.typeList = res.data.body.detail_type_list
                this.typeList = this.typeList.map(el => el.filetype.extension)
            } catch (error) {
                console.log(error)
            }
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
                this.$router.push('/')
            } catch (error) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Đăng xuất thất bại !',
                    showNoti: true
                })
            }
        },

        async handleFileUpload(){
            this.file = this.$refs.file.files[0];
            let formData = new FormData();
            formData.append('file', this.file); // coi như là name="file"
            try {
                let res = await Axios.post('http://localhost:3000/files/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }, 
                    params: {
                        bucket_name: localStorage.getItem('bucket'),
                        created_by: localStorage.getItem('userid'),
                        folder_id: this.$route.params ? this.$route.params.folderId : null,
                        updated_by: localStorage.getItem('userid')
                    },
                    onUploadProgress: function( progressEvent ) {
                        console.log( progressEvent.loaded);
                    }
                })
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: res.data.message,
                    showNoti: true
                })
            } catch (error) {
                console.log(error)
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Tải file thất bại !',
                    showNoti: true
                })
            } finally {
                this.$store.commit('setReloadIndexDrive', true)
            }
        },

        showUploadFile() {
            const btn_upload = document.getElementById('file')
            btn_upload.click()
        },

        cancelCreateFolder() {
            this.dialog = false,
            this.name_folder ="Thư mục mới"
        },

        async createFolder() {
            try {
                let res = await Axios.post('http://localhost:3000/folders/add', {
                    parent_id: this.$route.params ? this.$route.params.folderId : null,
                    name: this.name_folder,
                    storage_id: localStorage.getItem('bucket'),
                    created_by: localStorage.getItem('userid'),
                    updated_by: localStorage.getItem('userid')
                })
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: res.data.message,
                    showNoti: true
                })
            } catch (error) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Tạo mới thư mục thất bại',
                    showNoti: true
                })
            } finally {
                this.$store.commit('setReloadIndexDrive', true)
                this.dialog = false
                this.name_folder = "Thư mục mới"
            }
        }
    }
}
</script>