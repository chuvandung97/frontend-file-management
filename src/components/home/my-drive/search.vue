<template>
    <v-card flat>
        <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :items-per-page="999"
            :loading="isLoading"
            v-if="viewFile"
            :class="'view_list unselectable'"
        > 
            <template v-slot:progress>
                <Loading /> 
            </template>
            <template v-slot:body=" { items } ">
                <tbody v-click-outside="clickOutSide">
                    <tr v-if="items.length == 0" class="text-center v-data-table__empty-wrapper">
                        <td colspan="4">Không có dữ liệu</td>
                    </tr>
                    <tr v-else v-for="item in items" :key="item.name" :class="item.id === selectId && item.filetypedetail === selectType ? 'blue lighten-5 primary--text' : ''" @click="clickRow(item)" @dblclick="showDetailFolder(item)" @contextmenu="showSelectMenu($event, item)">
                        <td :title="item.name" style="width: 40%">
                            <v-icon class="mr-2" v-if="!item.filetypedetail">mdi-folder</v-icon> 
                            <v-icon class="mr-2" v-else :color="item.filetypedetail.color">{{item.filetypedetail.icon}}</v-icon>
                            {{ item.name.length >=40 ? item.name.substring(0,40) + '...' : item.name }}
                        </td>
                        <td>{{ item.User ? (item.User.id == userId ? 'tôi' : item.User.name) : '' }}</td>
                        <td>{{ item.updatedAt | formatDate }}</td>
                        <td>{{ item.size | formatSize }}</td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        <template v-if="!viewFile">
            <v-card flat v-if="folderLists.length > 0">
                <v-subheader>Thư mục</v-subheader>
                <v-card-text class="mt-n5 unselectable">
                    <v-row>
                        <v-col v-for="folder in folderLists" cols="6" sm="4" md="3" xl="1" :key="folder.name">
                            <v-card outlined class="pa-3" 
                                :ripple="false" 
                                :class="folder.id == selectId && folder.filetypedetail == selectType ? 'blue lighten-5 primary--text' : ''"   
                                :style="folder.id == selectId ? 'border-color: rgba(0, 0, 0, 0.12) !important' : ''"
                                @click="clickRow(folder)" 
                                @dblclick="showDetailFolder(folder)" 
                                @contextmenu="showSelectMenu($event, folder)"
                            >
                                <v-icon class="mr-2">mdi-folder</v-icon> {{ folder.name }}    
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card flat v-if="fileLists.length > 0">
                <v-subheader>File</v-subheader>
                <v-card-text class="mt-n5 unselectable">
                    <v-row>
                        <v-col v-for="file in fileLists" cols="6" sm="4" md="3" xl="1" :key="file.name" @contextmenu="showSelectMenu($event, file)">
                            <v-card outlined class="pa-3"
                                :ripple="false"
                                :class="file.id == selectId && file.filetypedetail == selectType ? 'blue lighten-5 primary--text' : ''"   
                                :style="file.id == selectId ? 'border-color: rgba(0, 0, 0, 0.12) !important' : ''"
                                @click="clickRow(file)" 
                                :title="file.name"
                            >
                                <v-icon :color="file.filetypedetail.color" size="100" class="d-flex justify-center py-8">{{file.filetypedetail.icon}}</v-icon>
                                <v-icon class="mr-2" :color="file.filetypedetail.color">{{file.filetypedetail.icon}}</v-icon>
                                {{ file.name.length >=25 ? file.name.substring(0,25) + '...' : file.name }}
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </template>
        <v-menu
            v-model="show"
            :position-x="x"
            :position-y="y"
            absolute
            offset-y
            transition="scale-transition"
        >
            <v-list width="300">
                <v-list-item @click="showDetailView = true">
                    <v-list-item-action>
                        <v-icon>mdi-eye</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Xem chi tiết</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="dialog = true, overlay = true" :disabled="rolegroup == 'READ' ? true : false">
                    <v-list-item-action>
                        <v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-pencil</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Đổi tên</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="dialog1 = true" :disabled="rolegroup == 'READ' ? true : false">
                    <v-list-item-action>
                        <v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-folder-move</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Di chuyển</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :disabled="rolegroup == 'READ' ? true : false">
                    <v-list-item-action>
                        <v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-share</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Chia sẻ</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="detailItem.filehistories && detailItem.filehistories.length != 0" @click="dialog3 = true">
                    <v-list-item-action>
                        <v-icon>mdi-history</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Quản lý phiên bản</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item class="file-upload" @click="showUploadFile()" :disabled="detailItem.filetypedetail && rolegroup != 'READ' ? false : true"> 
                    <v-list-item-action>
                        <v-icon :disabled="detailItem.filetypedetail && rolegroup != 'READ' ? false : true">mdi-upload</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Tải lên bản thay thế</v-list-item-title>
                    </v-list-item-content>
                    <input style="display: none" type="file" id="file" name="file" ref="file" :accept="typeList" v-on:change="replaceFileUpload()"/>
                </v-list-item>
                <v-list-item @click.prevent="downloadFile()">
                    <v-list-item-action>
                        <v-icon>mdi-download</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Tải xuống</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="removeToTrash()" :disabled="rolegroup == 'READ' ? true : false">
                    <v-list-item-action>
                        <v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-delete</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Xóa</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-dialog v-model="dialog" width="400" persistent>
            <v-card>
                <v-card-title
                    class="headline primary white--text"
                    primary-title
                >
                    Đổi tên thư mục
                </v-card-title>

                <v-card-text>
                    <v-text-field
                        v-model="new_name"
                        label="Tên"
                        required
                        class="mt-3"
                        :rules="[v => !!v || 'Mời bạn nhập tên']"
                        @keypress.enter="formSubmit()"
                        autofocus
                    >
                    </v-text-field>
                </v-card-text>
                <v-card-actions class="mt-n6 mr-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="dialog = false, overlay = false"
                        class="text-none"
                        depressed
                        text
                        color="primary"
                        outlined
                    >Hủy</v-btn>
                    <v-btn
                        color="primary"
                        @click="updateName()"
                        class="text-none"
                        depressed
                        :disabled="new_name == '' ? true : false"
                    >Lưu</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog1" max-width="400" scrollable persistent>
            <v-card>
                <v-card-title
                    class="headline primary white--text"
                    primary-title
                >
                    Di chuyển thư mục
                </v-card-title>

                <v-card-text class="red--text mt-3" v-if="folderLists.length == 0" style="height: 150px;">
                    Không có thư mục nào để di chuyển !
                </v-card-text>
                <v-card-text class="unselectable" v-else>
                    <v-treeview
                        :active.sync="selection"
                        :items="folderLists"
                        transition
                        activatable
                        item-disabled="locked"
                        return-object
                        dense
                    >
                        <template v-slot:prepend=" { items, active } ">
                            <v-icon style="margin-left: -90px">mdi_folder</v-icon>
                        </template>
                    </v-treeview>
                </v-card-text>
                <v-card-actions class="mt-n6 mr-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="dialog1 = false, selection = []"
                        class="text-none"
                        depressed
                        text
                        color="primary"
                        outlined
                    >Hủy</v-btn>
                    <v-btn
                        color="primary"
                        @click="moveFolderOrFile()"
                        class="text-none"
                        depressed
                        :disabled="selection.length == 0 ? true : false"
                    >Di chuyển</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog3" width="600" scrollable>
            <v-card>
                <v-card-title
                    class="headline primary white--text"
                    primary-title
                >
                    Quản lý phiên bản
                    <v-spacer></v-spacer>
                    <v-btn depressed text icon>
                        <v-icon color="white" @click="dialog3 = false">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text style="height: 600px;">
                    <v-expansion-panels
                        multiple
                        focusable
                        class="mt-3" 
                    >
                        <v-expansion-panel
                            v-for="(item,i) in fileHistories"
                            :key="i"
                        >
                            <v-expansion-panel-header class="pa-1" disable-icon-rotate>
                                <v-icon class="mr-2" style="flex: 0" :color="item.filetypedetail.color">{{item.filetypedetail.icon}}</v-icon>
                                {{ item.name }}<v-subheader>Phiên bản {{fileHistories.length - i}}</v-subheader>
                                <template v-slot:actions>
                                    <v-btn text icon depressed @click.stop="downloadFile(item.name)"><v-icon color="teal">mdi-download</v-icon></v-btn>
                                </template>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-subheader>Kích cỡ: {{item.size | formatSize}}</v-subheader>
                                <v-subheader class="mt-n3">Được tải lên bởi: {{item.updated_by == userId ? 'tôi' : item.User.name}} vào lúc {{item.updatedAt | formatTime}} ngày {{item.updatedAt | formatDate}}</v-subheader>
                                <v-divider></v-divider>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
                <v-card-actions class="mr-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="dialog3 = false"
                        class="text-none"
                        depressed
                        color="primary"
                    >Đóng</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ViewDetail
            :showDetailView="showDetailView"
            @closeDetailView="showDetailView = $event"
            :detailItem="detailItem"
            :userId="userId"
        ></ViewDetail>
    </v-card>
</template>

<script>
import Axios from 'axios';
import moment from 'moment'
import Vue from 'vue'
import { mapState } from 'vuex'
import numeral from 'numeral'
import vClickOutside from 'v-click-outside'
import Loading from '../layouts/Loading'
import ViewDetail from '../layouts/drive/ViewDetail'

Vue.use(vClickOutside)
Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
})

Vue.filter('formatTime', function(value) {
    if (value) {
        return moment(String(value)).format('HH:mm')
    }
})

Vue.filter('formatSize', function(value) {
    if(value) {
        return numeral(value).format('0.0 b')
    }
})

export default {
    components: {
        Loading, ViewDetail
    },
    data: () => ({
        selection: [],
        overlay: false,
        new_name: null,
        dialog: false,
        dialog1: false,
        dialog3: false,
        show: false,
        x: 0,
        y: 0,
        headers: [
            {
                text: 'Tên',
                align: 'left',
                value: 'name',
            },
            { text: 'Người tải lên', value: 'created_by' },
            { text: 'Cập nhật lần cuối', value: 'updatedAt' },
            { text: 'Kích cỡ', value: 'size' },
        ],
        desserts: [],
        detailItem: {},
        typeList: [],
        selectId: -1,
        selectType: null,
        isLoading: false,
        showDetailView: false,
        userId: null
    }),

    mounted() {
        this.userId = localStorage.getItem('userid')
        this.$store.commit('setTextOptionBarForSearch', true)
        this.getFolderFileList()
        this.getDetailFileType()
        this.$store.commit('setSelectedTrash', {
            selectedCount: null
        })
        this.$store.commit('setBreadcrumbs', null)
        this.$store.commit('setFolderName', null)
    },

    computed: {
        ...mapState ([
            'viewFile', 'reloadDrive', 'rolegroup', 'optionBar', 'searchIndexDrive'
        ]),
        folderLists: function() {
            return this.desserts.filter((el) => {
                return !el.filetypedetail
            })
        },
        fileLists: function() {
            return this.desserts.filter((el) => {
                return el.filetypedetail
            })
        },
        fileHistories: function() {
            return this.detailItem.filehistories
        },
    },

    watch: {
        reloadDrive: function() {
            this.getFolderFileList()
            this.$store.commit('setReloadIndexDrive', false)
        },
        selectId: function() {
            if(this.selectId > 0) {
                this.$store.commit('setShowDetail', true)
            } else {
                this.$store.commit('setShowDetail', false)
            }
        },
        optionBar: {
            deep: true,
            handler: function(val) {
                if(val.activeViewDetail) {
                    this.showDetailView = true
                }
            }
        },
        searchIndexDrive: {
            deep: true,
            handler: function(val) {
                console.log(val)
                this.selectId = val.selectId
                this.selectType = val.selectType
            }
        },
    },

    methods: {
        clickOutSide() {
            this.selectId = -1
            this.selectType = null
            //this.detailItem = {}
        },
        showDetailFolder(item) {
            if(!item.filetypedetail) {
                this.$router.push('/user/folder/' + item.id)
                //this.getFolderFileList()
            }
        },

        showSelectMenu(e, item) {
            e.preventDefault();
            this.show = false;
            this.x = e.clientX;
            this.y = e.clientY;
            this.selectId = item.id
            //this.$set(item, 'selected', true)
            this.detailItem = Object.assign({}, item)
            this.new_name = item.name
            this.$nextTick(() => {
                this.show = true;
            });
        },

        clickRow(item) {
            this.detailItem = Object.assign({}, item)
            this.selectId = item.id
            this.selectType = item.filetypedetail
        },

        async getFolderFileList() {
            try {
                this.isLoading = true
                let res = await Axios.get('http://localhost:3000/folderfiles/lists', {
                    params: {
                        userid: this.userId,
                        storage_id: localStorage.getItem('bucket'),
                        active: this.$route.query ? this.$route.query.active : true,
                        search: true,
                        name: this.$route.query ? this.$route.query.name : '',
                        size: this.$route.query ? this.$route.query.size : '',
                        time: this.$route.query ? this.$route.query.time : '',
                        owner: this.$route.query ? this.$route.query.owner : '',
                    }
                })
                this.desserts = res.data.body.folder_file_list
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
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

        async updateName() {
            if(this.new_name == this.detailItem.name) {
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: 'Đổi tên thành công',
                    showNoti: true
                })
                this.dialog = false
            } else { 
                try {
                    var url = ''
                    if(this.detailItem.filetypedetail === undefined) {
                        url = 'http://localhost:3000/folders/update/'
                    } else {
                        url = 'http://localhost:3000/files/update/'
                    }
                    let res = await Axios.post(url + this.detailItem.id, {
                        name: this.new_name,
                        user_id: this.userId
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
                        textNoti: 'Đổi tên thất bại',
                        showNoti: true
                    })
                } finally {
                    this.dialog = false
                    this.overlay = false
                    this.getFolderFileList()
                }
            }
        },

        async removeToTrash() {
            try {
                var url = ''
                if(this.detailItem.filetypedetail === undefined) {
                    url = 'http://localhost:3000/folders/remove/trash/'
                } else {
                    url = 'http://localhost:3000/files/remove/trash/'
                }
                await Axios.post(url + this.detailItem.id, {
                    user_id: this.userId
                })
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: 'Chuyển đến thùng rác thành công',
                    showNoti: true
                })
            } catch (error) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Xóa thất bại',
                    showNoti: true
                })
            } finally {
                this.getFolderFileList()
            }
        },
        
        async moveFolderOrFile() {
            if(this.detailItem.id == this.selection[0].id) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Không thể di chuyển đến chính mình',
                    showNoti: true
                })
            } else {
                try {
                    if(this.detailItem.filetypedetail === undefined) {
                        let res = await Axios.post('http://localhost:3000/folders/move/' + this.detailItem.id, {
                            folderId: this.selection[0].id,
                            user_id: this.userId
                        })
                        this.$store.commit('setNoti', {
                            typeNoti: 1,
                            textNoti: res.data.message,
                            showNoti: true
                        })
                    } else {
                        let res = await Axios.post('http://localhost:3000/files/move/' + this.detailItem.id, {
                            oldFolderId: this.$route.params ? this.$route.params.folderId : null,
                            newFolderId: this.selection[0].id,
                            user_id: this.userId
                        })
                        this.$store.commit('setNoti', {
                            typeNoti: 1,
                            textNoti: res.data.message,
                            showNoti: true
                        }) 
                    }
                } catch (error) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Di chuyển thất bại',
                        showNoti: true
                    })
                } finally {
                    this.dialog1 = false,
                    this.getFolderFileList()
                }
            }
        },

        async downloadFile(name = null) {
            try {
                let res = await Axios.get('http://localhost:3000/files/download', {
                    params: {
                        bucket_name: localStorage.getItem('bucket'),
                        name: name ? name : this.detailItem.origin_name
                    }, 
                    responseType: 'blob'
                })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(new Blob([res.data]))
                link.setAttribute('download', name ? name : this.detailItem.name) 
                document.body.appendChild(link);
                link.click()
                document.body.removeChild(link);
            } catch (error) {
                console.log(error)
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Tải xuống thất bại !',
                    showNoti: true
                })
            }
        },

        showUploadFile() {
            const btn_upload = document.getElementById('file')
            btn_upload.click()
        },

        async replaceFileUpload() {
            this.file = this.$refs.file.files[0];
            let formData = new FormData();
            formData.append('file', this.file); // coi như là name="file"
            try {
                let res = await Axios.post('http://localhost:3000/files/upload/replace/' + this.detailItem.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }, 
                    params: {
                        bucket_name: localStorage.getItem('bucket'),
                        created_by: this.userId,
                        updated_by: this.userId
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

        formSubmit() {
            this.updateName()
        }
    }
  }
</script>