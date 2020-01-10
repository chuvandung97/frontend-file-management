<template>
    <v-card flat>
        <v-data-table
            :headers="headers"
            :items="folderFileLists"
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
import Axios from 'axios';
import moment from 'moment'
import Vue from 'vue'
import { mapState } from 'vuex'
import numeral from 'numeral'
import vClickOutside from 'v-click-outside'
import Loading from '../layouts/Loading'
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
        this.$store.commit('setSelectedTrash', {
            selectedCount: null
        })
        this.$store.commit('setBreadcrumbs', null)
        this.$store.commit('setTextOptionBarForSearch', false)
    },

    computed: {
        ...mapState ([
            'viewFile', 'reloadDrive', 'rolegroup', 'optionBar', 'searchIndexDrive'
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
                console.log(val)
                this.selectId = val.selectId
                this.selectType = val.selectType
            }
        },
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

        async getFolderFileList() {
            try {
                this.isLoading = true
                let res = await Axios.get('http://localhost:3000/folderfiles/lists', {
                    params: {
                        storage_id: localStorage.getItem('bucket'),
                        active: 1,
                    }
                })
                this.folderFileLists = res.data.body.folder_file_list
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },
    }
  }
</script>