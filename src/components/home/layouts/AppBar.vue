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
                        v-model="showMenuSearch"
                        min-width="525"
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
                            <v-btn text icon depressed small v-on="on" @click="showMenuSearch = true">
                                <v-icon>mdi-menu-down</v-icon> 
                            </v-btn>   
                        </template>
                        <v-card>
                            <v-card-text class="pa-0 search-card">
                                <v-form ref="form" lazy-validation>
                                    <v-row class="mb-n3 px-5">
                                        <v-col cols="4" class="py-0 d-flex align-center">
                                            Loại:
                                        </v-col>
                                        <v-col cols="5" class="pa-0">
                                            <v-select v-model="typeSearch" :items="typeSearchItems" return-object>
                                                <template v-slot:item="{ item }">
                                                    <v-icon class="mr-2" :color="item.color">{{item.icon}}</v-icon>
                                                    <span v-if="item.icon == 'mdi-file-word-box'">Tài liệu</span>
                                                    <span v-if="item.icon == 'mdi-file-excel-box'">Trang tính</span>
                                                    <span v-if="item.icon == 'mdi-file-powerpoint-box'">Trình chiếu</span>
                                                    <span v-if="item.icon == 'mdi-file-pdf-box'">PDF</span>
                                                    <span v-if="item.icon == 'mdi-file-image'">Hình ảnh</span>
                                                    <span v-if="item.icon == 'mdi-file-video'">Video</span>
                                                    <span v-if="item.icon == 'mdi-file-music'">Âm thanh</span>
                                                </template>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5">
                                        <v-col cols="4" class="py-0 d-flex align-center">
                                            Chủ sở hữu:
                                        </v-col>
                                        <v-col cols="5" class="pa-0">
                                            <v-select v-model="ownerSearch" :items="ownerSearchItems" return-object>
                                                <template v-slot:item="{ item }">
                                                    <span class="body-2">{{item.text}}</span>
                                                </template>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5" v-if="ownerSearch == ownerSearchItems[3]">
                                        <v-col cols="4" class="py-0"></v-col>
                                        <v-col cols="7" class="pa-0">
                                            <v-text-field
                                                v-model="emailSearch"
                                                placeholder="Nhập email người dùng cần tìm kiếm"
                                                class="body-2"
                                                :rules="emailRules"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5">
                                        <v-col cols="4" class="py-0 d-flex align-center">
                                            Địa điểm:
                                        </v-col>
                                        <v-col cols="3" class="pa-0">
                                            <v-checkbox v-model="isTrash" label="Thùng rác"></v-checkbox>
                                        </v-col>
                                    </v-row>
                                    <v-divider></v-divider>
                                    <v-row class="mb-n3 px-5">
                                        <v-col cols="4" class="py-0 d-flex align-center">
                                            Tên:
                                        </v-col>
                                        <v-col cols="5" class="pa-0">
                                            <v-text-field
                                                v-model="nameSearch"
                                                placeholder="Nhập cụm từ cần tìm kiếm"
                                                class="body-2"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5">
                                        <v-col cols="4" class="py-0 d-flex align-center">
                                            Kích cỡ:
                                        </v-col>
                                        <v-col cols="5" class="pa-0">
                                            <v-select v-model="sizeSearch" :items="sizeSearchItems" return-object>
                                                <template v-slot:item="{ item }">
                                                    <span class="body-2">{{item.text}}</span>
                                                </template>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5" v-if="sizeSearch == sizeSearchItems[5]">
                                        <v-col cols="4" class="py-0"></v-col>
                                        <v-col cols="2" class="pa-0">
                                            <v-text-field 
                                                v-model="fromSize" 
                                                suffix="MB" 
                                                placeholder="Từ" 
                                                class="body-2"
                                                :rules="[v => !!v || 'Mời bạn nhập kích cỡ']"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="1" class="py-0 d-flex justify-center align-center"><v-icon dense class="body-2">mdi-minus</v-icon></v-col>
                                        <v-col cols="2" class="pa-0">
                                            <v-text-field 
                                                v-model="toSize" 
                                                suffix="MB" 
                                                placeholder="Đến" 
                                                class="body-2"
                                                :rules="[v => !!v || 'Mời bạn nhập kích cỡ']"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5">
                                        <v-col cols="4" class="py-0 d-flex align-center">
                                            Cập nhật lần cuối:
                                        </v-col>
                                        <v-col cols="5" class="pa-0">
                                            <v-select v-model="timeSearch" :items="timeSearchItems" return-object>
                                                <template v-slot:item="{ item }">
                                                    <span class="body-2">{{item.text}}</span>
                                                </template>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-n3 px-5" v-if="timeSearch == timeSearchItems[5]">
                                        <v-col cols="4" class="py-0"></v-col>
                                        <v-col cols="3" class="pa-0">
                                            <v-menu
                                                v-model="selectFromDate"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                transition="scale-transition"
                                                offset-y
                                                min-width="290px"
                                            >
                                                <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="fromDate"
                                                    label="Từ ngày"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                                ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="fromDate" @input="selectFromDate = false"></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                        <v-col cols="1" class="py-0 d-flex justify-center align-center"><v-icon dense class="body-2">mdi-minus</v-icon></v-col>
                                        <v-col cols="3" class="pa-0">
                                            <v-menu
                                                v-model="selectToDate"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                transition="scale-transition"
                                                offset-y
                                                min-width="290px"
                                            >
                                                <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="toDate"
                                                    label="Đến ngày"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                                ></v-text-field>
                                                </template>
                                                <v-date-picker v-model="toDate" @input="selectToDate = false"></v-date-picker>
                                            </v-menu>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>                            
                            <v-card-actions>
                                <v-btn
                                    @click="resetSearch()"
                                    depressed
                                    text
                                    color="primary"
                                    outlined
                                    class="caption font-weight-bold"
                                >Đặt lại</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    @click="searchFolderFile()"
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
            te: false,
            expandDrawer: true,
            roleDescription: null, 
            search: null,
            itemSearches: [],
            desserts: [],
            textSearch: null,
            loading: false,
            typeSearchItems: [],
            ownerSearchItems: [
                {
                    text: 'Bất kì ai',
                    owner: null
                }, 
                {
                    text: 'Tôi',
                    owner: 'me'
                }, 
                {
                    text: 'Không phải tôi',
                    owner: 'notme'
                },
                {
                    text: 'Tùy chọn',
                    owner: null
                }
            ],
            sizeSearchItems: [
                {
                    text: 'Bất kì',
                    size: null
                },
                {
                    text: 'Nhỏ hơn 1MB',
                    size: 'less:1048576'
                },
                {
                    text: 'Từ 1MB đến 50MB',
                    size: 'more_:1048576:less_:52428800'
                },
                {
                    text: 'Từ 50MB đến 100MB',
                    size: 'more_:52428800:less_:104857600'
                },
                {
                    text: 'Lớn hơn 100MB',
                    size: 'more:104857600'
                },
                {
                    text: 'Tùy chọn',
                    size: null,
                }
            ],
            timeSearchItems: [
                {
                    text: 'Bất kì',
                    time: null
                },
                {
                    text: 'Hôm nay',
                    time: 'after:' + new Date().toISOString().substr(0, 10)
                },
                {
                    text: 'Hôm qua',
                    time: 'before:' + new Date().toISOString().substr(0, 10) + ':after:' + new Date(new Date().setDate(new Date().getDate()-1)).toISOString().substr(0, 10)
                },
                {
                    text: '1 tuần trước',
                    time: 'after:' + new Date(new Date().setDate(new Date().getDate()-7)).toISOString().substr(0, 10)
                },
                {
                    text: '1 tháng trước',
                    time: 'after:' + new Date(new Date().setDate(new Date().getDate()-30)).toISOString().substr(0, 10)
                },
                {
                    text: 'Tùy chọn',
                    time: null
                }
            ],
            typeSearch: null,
            nameSearch: null,
            sizeSearch: null,
            timeSearch: null,
            ownerSearch: null,
            emailSearch: null,
            fromSize: 0,
            toSize: 0,
            selectFromDate: false,
            selectToDate: false,
            fromDate: new Date(new Date().setDate(new Date().getDate()-30)).toISOString().substr(0, 10),
            toDate: new Date().toISOString().substr(0, 10),
            showMenuSearch: false,
            isTrash: false,
            emailRules: [
                v => !!v || 'Mời bạn nhập email',
                v => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ',
            ],
        }
    },

    async mounted() {
        this.getDetailFileType()
        this.resetSearch()
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
        },
        fromSize (val) {
            this.sizeSearch.size = 'more_:' + val*1048576 + ':less_:' + this.toSize*1048576
        },
        toSize (val) {
            this.sizeSearch.size = 'more_:' + this.fromSize*1048576 + ':less_:' + val*1048576
        },
        fromDate(val) {
            this.timeSearch.time = 'before:' + this.toDate + ':after:' + val
        },
        toDate(val) {
            this.timeSearch.time = 'before:' + val + ':after:' + this.fromDate
        },
        emailSearch(val) {
            this.ownerSearch.owner = val
        }
    },

    methods: {
        async getDetailFileType() {
            try {
                let res = await Axios.get('http://localhost:3000/files/lists/detailtype')
                this.typeSearchItems = res.data.body.detail_type_list
                let tempObj = {}
                this.typeSearchItems.forEach(el => {
                    var icon = el.icon
                    var color = el.color
                    if(!tempObj[icon]) {
                        tempObj[icon] = []
                        tempObj[icon].push(color)
                    }
                    tempObj[icon].push(el.id)
                })    
                this.typeSearchItems = []
                for(var i in tempObj) {
                    let color = tempObj[i].shift()
                    this.typeSearchItems.push({icon: i, color: color, id: tempObj[i]})
                }
            } catch (error) {
                console.log(error)
            }
        },

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

        searchFolderFile() {
            if(this.$refs.form.validate()) {
                this.showMenuSearch = false
                let query = {}
                if(this.nameSearch) {
                    query.name = this.nameSearch
                }
                if(this.sizeSearch.size) {
                    query.size = this.sizeSearch.size
                }
                if(this.timeSearch.time) {
                    query.time = this.timeSearch.time
                }
                if(this.isTrash) {
                    query.active= false
                }
                if(this.ownerSearch.owner) {
                    query.owner = this.ownerSearch.owner
                }
                this.$router.push({
                    path: '/user/search',
                    query
                })
            }
        },

        resetSearch() {
            this.ownerSearch = this.ownerSearchItems[0]
            this.isTrash = false
            this.nameSearch = null
            this.sizeSearch = this.sizeSearchItems[0]
            this.timeSearch = this.timeSearchItems[0]
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
        font-size: 14px;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 350px
    }
</style>
