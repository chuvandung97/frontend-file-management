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