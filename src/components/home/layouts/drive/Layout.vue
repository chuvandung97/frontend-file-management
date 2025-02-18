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
                            {{ item.name.length >=40 ? item.name.substring(0,40) + '...' : item.name }}<v-icon v-if="item.is_star" x-small class="ml-1" :class="item.id === selectId && item.filetypedetail === selectType ? 'blue lighten-5 primary--text' : ''">mdi-star</v-icon>
                        </td>
                        <td>{{ item.User ? (item.User.id == userId ? 'tôi' : item.User.name) : '' }}</td>
                        <td>{{ item.updatedAt | formatDate }}</td>
                        <td>{{ item.size | formatSize }}</td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        <template v-if="!viewFile">
            <v-card flat v-if="folderLists.length > 0" v-click-outside="clickOutSide">
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
                                <v-icon class="mr-2">mdi-folder</v-icon> {{ folder.name }}<v-icon v-if="folder.is_star" x-small class="ml-1" :class="folder.id === selectId && folder.filetypedetail === selectType ? 'blue lighten-5 primary--text' : ''">mdi-star</v-icon>  
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card flat v-if="fileLists.length > 0" v-click-outside="clickOutSide">
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
                                {{ file.name.length >=25 ? file.name.substring(0,25) + '...' : file.name }} <v-icon v-if="file.is_star" x-small class="ml-1" :class="file.id === selectId && file.filetypedetail === selectType ? 'blue lighten-5 primary--text' : ''">mdi-star</v-icon>
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
            :showUpdateStar="showUpdateStar"
            @closeUpdateStar="showUpdateStar = $event"
        ></FolderFileMenu>
        <Rename
            :showRename="showRename"
            @closeRename="showRename = $event"
            :detailItem="detailItem"
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
import { mapState } from 'vuex'
import numeral from 'numeral'
import vClickOutside from 'v-click-outside'
import Loading from '../Loading'
import ViewDetail from './ViewDetail'
import Rename from './Rename'
import VersionManagement from './VersionManagement'
import Move from './Move'
import FolderFileMenu from './FolderFileMenu'

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

    props: {
        'folderFileLists': {type: Array},
        'isLoading': {default: false, type: Boolean},
        'textOptionBarForSearch': {type: Boolean}
    },

    data: () => ({
        showDetailView: false,
        showRename: false,
        showMove: false,
        showVersionManagement: false,
        showDownload: false,
        showDelete: false,
        showUpload: false,
        showUpdateStar: false,
        showMenu: {
            active: false,
            x: 0,
            y: 0
        },
        detailItem: {},
        selectId: -1,
        selectType: null,
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
        this.$store.commit('setSelectedTrash', {
            selectedCount: null
        })
        this.$store.commit('setShowDetail', false)
        this.$store.commit('setBreadcrumbs', null)
        this.$store.commit('setTextOptionBarForSearch', this.$props.textOptionBarForSearch)
    },

    computed: {
        ...mapState ([
            'viewFile', 'rolegroup', 'optionBar', 'searchIndexDrive'
        ]),
        folderLists: function() {
            return this.$props.folderFileLists.filter((el) => {
                return !el.filetypedetail
            })
        },
        fileLists: function() {
            return this.$props.folderFileLists.filter((el) => {
                return el.filetypedetail
            })
        },
        userId: function() {
            return localStorage.getItem('userid')
        }
    },

    watch: {
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
                } else if(val.activeUpdateStar) {
                    this.showUpdateStar = true
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
            }
        },

        showSelectMenu(e, item) {
            e.preventDefault();
            this.showMenu.active = false;
            this.showMenu.x = e.clientX;
            this.showMenu.y = e.clientY;
            this.selectId = item.id
            this.selectType = item.filetypedetail
            this.detailItem = Object.assign({}, item)
            this.$nextTick(() => {
                this.showMenu.active = true;
            });
            this.setStateStar(item)
            this.setStateShowVersionManagement(item)
        },

        clickRow(item) {
            this.detailItem = Object.assign({}, item)
            this.selectId = item.id
            this.selectType = item.filetypedetail
            this.setStateStar(item)
            this.setStateShowVersionManagement(item)
        },

        setStateStar(item) {
            if(item.is_star) {
                this.$store.commit('setChangeStar', true)
            } else {
                this.$store.commit('setChangeStar', false)
            }
        },

        setStateShowVersionManagement(item) {
            if(item.filehistories && item.filehistories.length > 0) {
                this.$store.commit('setShowVersionManagement', true)
            } else {
                this.$store.commit('setShowVersionManagement', false)
            }
        }
    }
}
</script>