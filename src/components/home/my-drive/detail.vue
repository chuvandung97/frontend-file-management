<template>
    <v-card flat>
        <v-data-table
            :headers="headers"
            :items="folderFileLists"
            hide-default-footer
            :items-per-page="999"
            v-if="viewFile"
            :loading="isLoading"
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
                    <tr v-else v-for="item in items" :key="item.origin_name" :class="item.id === selectId && item.filetypedetail === selectType ? 'blue lighten-5 primary--text' : ''" @click="clickRow(item)" @dblclick="showDetailFolder(item)" @contextmenu="showSelectMenu($event, item)">
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
        <!-- <v-dialog v-model="dialog1" width="400" max-height="200" persistent>
            <v-card>
                <v-card-title
                    class="primary white--text"
                    primary-title
                >
                <v-btn text icon dark depressed>
                    <v-icon>mdi-keyboard-backspace</v-icon> 
                </v-btn>{{folderLists[0] ? folderLists[0].parent.name : ''}}
                </v-card-title>

                <v-card-text class="unselectable" style="height: 200px">
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
        </v-dialog> -->
        <FolderFileMenu
            :showMenu="showMenu"
            :detailItem="detailItem"
            :showDownload="showDownload"
            @closeDownload="showDownload = $event"
            :showDelete="showDelete"
            @closeDelete="showDelete = $event"
            :showUpload="showUpload"
            @closeUpload="showUpload = $event"
        ></FolderFileMenu>
        <Rename
            :detailItem="detailItem"
            :showRename="showRename"
            @closeRename="showRename = $event"
            :userId="userId"
        ></Rename>
        <VersionManagement
            :detailItem="detailItem"
            :showVersionManagement="showVersionManagement"
            @closeVersionManagement="showVersionManagement = $event"
            :userId="userId"
        ></VersionManagement>
        <Move
            :detailItem="detailItem"
            :showMove="showMove"
            @closeMove="showMove = $event"
            :userId="userId"
            :folderLists="folderLists"
        ></Move>
        <ViewDetail
            :showDetailView="showDetailView"
            @closeDetailView="showDetailView = $event"
            :detailItem="detailItem"
            :userId="userId"
        ></ViewDetail>
    </v-card>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import Axios from 'axios'
import { mapState } from 'vuex'
import numeral from 'numeral'
import Loading from '../layouts/Loading'
import vClickOutside from 'v-click-outside'
import ViewDetail from '../layouts/drive/ViewDetail'
import Rename from '../layouts/drive/Rename'
import VersionManagement from '../layouts/drive/VersionManagement'
import Move from '../layouts/drive/Move'
import FolderFileMenu from '../layouts/drive/FolderFileMenu'

Vue.use(vClickOutside)
Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
})

Vue.filter('formatSize', function(value) {
    if(value) {
        return numeral(value).format('0.0 b')
    }
})
export default {
    components: {
        Loading, ViewDetail, Rename, VersionManagement, Move, FolderFileMenu
    },
    data: () => ({
        showDetailView: false,
        showRename: false,
        showMove: false,
        showVersionManagement: false,
        showDownload: false,
        showDelete: false,
        showUpload: false,
        showMenu: {
            active: false,
            x: 0,
            y: 0
        },
        
        folderFileLists: [],
        detailItem: {},
        selectId: -1,
        selectType: null,
        isLoading: false,
        folder_info: {},
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
    }),

    mounted() {
        this.getFolderFileList()
        this.getFolderInfo()
        this.$store.commit('setSelectedTrash', {
            selectedCount: null
        }),
        this.$store.commit('setShowDetail', false)
    },

    computed: {
        ...mapState ([
            'viewFile', 'reloadDrive', 'rolegroup', 'searchIndexDrive', 'optionBar'
        ]),
        folderLists: function() {
            return this.folderFileLists.filter((el) => {
                return !el.filetypedetail
            })
        },
        fileLists: function() {
            return this.folderFileLists.filter((el) => {
                return el.filetypedetail
            })
        },
        userId: function() {
            return localStorage.getItem('userid')
        }
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
                } else if(val.activeRename) {
                    this.showRename = true
                } else if(val.activeDownload) {
                    this.showDownload = true
                } else if(val.activeDelete){
                    this.showDelete = true
                } else if(val.activeMove) {
                    this.showMove = true
                } else if(val.activeVersionManagement) {
                    this.showVersionManagement = true
                } else if(val.activeUpload) {
                    this.showUpload = true
                }
            }
        },
        searchIndexDrive: {
            deep: true,
            handler: function(val) {
                this.selectId = val.selectId
                this.selectType = val.filetypedetail
            }
        }
    },

    methods: {
        clickOutSide() {
            //this.selectId = -1
            //this.selectType = null
            //this.detailItem = {}
        },
        showDetailFolder(item) {
            if(!item.filetypedetail) {
                this.$router.push('/user/folder/' + item.id)
            }
        },

        showSelectMenu(e, item) {
            e.preventDefault();
            this.showMenu.active = false;
            this.showMenu.x = e.clientX;
            this.showMenu.y = e.clientY;
            this.selectId = item.id
            this.detailItem = Object.assign({}, item)
            this.$nextTick(() => {
                this.showMenu.active = true;
            });
        },

        clickRow(item) {
            this.detailItem = Object.assign({}, item)
            this.selectId = item.id
            this.selectType = item.filetypedetail
        },

        async getFolderInfo() {
            try {
                let res = await Axios.get('http://localhost:3000/folders/info/' + this.$route.params.folderId)
                this.folder_info = res.data.body.folder_info
            } catch (error) {
                console.log(error)
            } finally {
                var breadcrumbs = [{
                    text: this.folder_info.name,
                    disable: false,
                    to: '/user/folder/' + this.folder_info.id
                }]
                var temp = this.folder_info.parent
                for(let i = 0 ; i < 100 ; i++) {
                    if(temp) {
                        breadcrumbs.push({
                            text: temp.name,
                            disable: false,
                            to: '/user/folder/' + temp.id
                        })
                        temp = temp.parent
                    } else {
                        break;
                    }
                }
                this.$store.commit('setTextOptionBarForSearch', false)
                this.$store.commit('setBreadcrumbs', breadcrumbs.reverse())
            }
        },

        async getFolderFileList() {
            try {
                this.isLoading = true
                let res = await Axios.all([
                    Axios.get('http://localhost:3000/folders/lists/subfolder', {
                        params: {
                            folder_id: this.$route.params.folderId, 
                            active: 1
                        }
                    }),
                    Axios.get('http://localhost:3000/files/lists/parentfolder', {
                        params: {
                            folder_id: this.$route.params.folderId, 
                            active: 1
                        }
                    })
                ])
                let folder_list = res[0].data.body.folder_list
                this.folderFileLists = folder_list.concat(res[1].data.body.file_list)
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
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
                            user_id: localStorage.getItem('userid')
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
                            user_id: localStorage.getItem('userid')
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
    }
  }
</script>