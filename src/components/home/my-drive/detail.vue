<template>
    <v-card flat>
        <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :items-per-page="999"
            sort-by="name"
            v-if="viewFile"
            :class="'view_list unselectable'"
            
        >
            <template v-slot:body=" { items } ">
                <tbody>
                    <tr v-for="item in items" :key="item.name" @dblclick="showDetailFolder(item)" @contextmenu="showSelectMenu($event, item)">
                        <td :title="item.name" style="width: 40%">
                            <v-icon class="mr-2" v-if="item.type == 'image/png'" color="primary">mdi-file-image</v-icon>
                            <v-icon class="mr-2" v-else-if="item.type == 'application/docx'" color="blue">mdi-file-word-box</v-icon> 
                            <v-icon class="mr-2" v-else-if="item.type == 'application/pdf'" color="red">mdi-file-pdf-box</v-icon>
                            <v-icon class="mr-2" v-else-if="item.type == 'application/xlsx'" color="green">mdi-file-excel-box</v-icon>
                            <v-icon class="mr-2" v-else-if="item.type == 'application/pptx'" color="orange">mdi-file-powerpoint-box</v-icon>
                            <v-icon class="mr-2" v-else-if="item.type == 'video/mp4'" color="red">mdi-file-video</v-icon>
                            <v-icon class="mr-2" v-else>mdi-folder</v-icon> 
                            {{ item.name.length >=40 ? item.name.substring(0,40) + '...' : item.name }}
                        </td>
                        <td>{{ item.User ? item.User.name : '' }}</td>
                        <td>{{ item.updatedAt | formatDate }}</td>
                        <td>{{ item.size | formatSize }}</td>
                    </tr>
                </tbody>
            </template>
            <!-- <template v-slot:item.name="{ item }">
                <v-icon class="mr-2">mdi-folder</v-icon> {{ item.name }}
            </template>
            <template v-slot:item.created_by="{ item }">
                {{ item.User.name }}
            </template>
            <template v-slot:item.updatedAt="{ item }">
                {{ item.updatedAt | formatDate }}
            </template> -->
        </v-data-table>
        <template v-if="!viewFile">
            <v-card flat v-if="folderLists.length > 0">
                <v-subheader>Thư mục</v-subheader>
                <v-card-text class="mt-n5 unselectable">
                    <v-row>
                        <v-col v-for="folder in folderLists" cols="6" sm="4" md="3" xl="1" :key="folder.name">
                            <v-card outlined class="pa-3" @dblclick="showDetailFolder(folder)" @contextmenu="showSelectMenu($event, folder)">
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
                            <v-card outlined class="pa-3 test" :title="file.name">
                                <v-icon color="primary" v-if="file.type == 'image/png'" size="100" class="d-flex justify-center py-8">mdi-file-image</v-icon>
                                <v-icon color="blue" v-if="file.type == 'application/docx'" size="100" class="d-flex justify-center py-8">mdi-file-word-box</v-icon>
                                <v-icon color="red" v-if="file.type == 'application/pdf'" size="100" class="d-flex justify-center py-8">mdi-file-pdf-box</v-icon>
                                <v-icon color="green" v-if="file.type == 'application/xlsx'" size="100" class="d-flex justify-center py-8">mdi-file-excel-box</v-icon>
                                <v-icon color="orange" v-if="file.type == 'application/pptx'" size="100" class="d-flex justify-center py-8">mdi-file-powerpoint-box</v-icon>
                                <v-icon color="red" v-if="file.type == 'video/mp4'" size="100" class="d-flex justify-center py-8">mdi-file-video</v-icon>

                                <v-icon class="mr-2" v-if="file.type == 'image/png'" color="primary">mdi-file-image</v-icon>
                                <v-icon class="mr-2" v-else-if="file.type == 'application/docx'" color="blue">mdi-file-word-box</v-icon> 
                                <v-icon class="mr-2" v-else-if="file.type == 'application/pdf'" color="red">mdi-file-pdf-box</v-icon>
                                <v-icon class="mr-2" v-else-if="file.type == 'application/xlsx'" color="green">mdi-file-excel-box</v-icon>
                                <v-icon class="mr-2" v-else-if="file.type == 'application/pptx'" color="orange">mdi-file-powerpoint-box</v-icon>
                                <v-icon class="mr-2" v-else-if="file.type == 'video/mp4'" color="red">mdi-file-video</v-icon>
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
            <v-list width="200">
                <v-list-item @click="dialog2 = true">
                    <v-list-item-action>
                        <v-icon>mdi-eye</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Xem chi tiết</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="dialog = true, overlay = true">
                    <v-list-item-action>
                        <v-icon>mdi-pencil</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Đổi tên</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="dialog1 = true">
                    <v-list-item-action>
                        <v-icon>mdi-folder-move</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Di chuyển</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-action>
                        <v-icon>mdi-share</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Chia sẻ</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click.prevent="downloadFile()
                ">
                    <v-list-item-action>
                        <v-icon>mdi-download</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Tải xuống</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="removeToTrash()">
                    <v-list-item-action>
                        <v-icon>mdi-delete</v-icon>
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
        <v-dialog v-model="dialog1" width="400" max-height="200" persistent>
            <v-card>
                <v-card-title
                    class="primary white--text"
                    primary-title
                >
                <v-btn text icon dark depressed>
                    <v-icon>mdi-keyboard-backspace</v-icon> 
                </v-btn>{{folderLists[0] ? folderLists[0].parent.name : ''}}
                </v-card-title>

                <v-card-text class="unselectable">
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
    </v-card>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import Axios from 'axios'
import { mapState } from 'vuex'
import numeral from 'numeral'

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
})

Vue.filter('formatSize', function(value) {
    if(value) {
        return numeral(value).format('0.0 ib')
    }
})
export default {
    data: () => ({
        selection: [],
        overlay: false,
        new_name: null,
        dialog: false,
        dialog1: false,
        dialog2: false,
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
        detailItem: {}
    }),

    mounted() {
        this.getFolderFileList()
        this.$store.commit('setSelectedTrash', {
            selectedCount: null
        })
    },

    computed: {
        ...mapState ([
            'viewFile', 'reloadDrive'
        ]),
        folderLists: function() {
            return this.desserts.filter((el) => {
                return !el.type
            })
        },
        fileLists: function() {
            return this.desserts.filter((el) => {
                return el.type
            })
        }
    },

    watch: {
        reloadDrive: function() {
            this.getFolderFileList()
            this.$store.commit('setReloadIndexDrive', false)
        }
    },

    methods: {
        showDetailFolder(item) {
            if(!item.type) {
                this.$router.push('/user/folder/' + item.id)
                this.getFolderFileList()
            }
        },

        showSelectMenu(e, item) {
            e.preventDefault();
            this.show = false;
            this.x = e.clientX;
            this.y = e.clientY;
            this.detailItem = Object.assign({}, item)
            this.new_name = item.name
            this.$nextTick(() => {
                this.show = true;
            });
        },

        async getFolderFileList() {
            try {
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
                this.desserts = res[0].data.body.folder_list
                let arr = res[1].data.body.file_list
                arr.forEach(element => {
                    this.desserts.push(element)
                })
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
                    if(this.detailItem.type === undefined) {
                        url = 'http://localhost:3000/folders/update/'
                    } else {
                        url = 'http://localhost:3000/files/update/'
                    }
                    let res = await Axios.post(url + this.detailItem.id, {
                        name: this.new_name,
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
                if(this.detailItem.type === undefined) {
                    url = 'http://localhost:3000/folders/remove/trash/'
                } else {
                    url = 'http://localhost:3000/files/remove/trash/'
                }
                await Axios.post(url + this.detailItem.id)
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
                    if(this.detailItem.type === undefined) {
                        let res = await Axios.post('http://localhost:3000/folders/move/' + this.detailItem.id, {
                            folderId: this.selection[0].id
                        })
                        this.$store.commit('setNoti', {
                            typeNoti: 1,
                            textNoti: res.data.message,
                            showNoti: true
                        })
                    } else {
                        let res = await Axios.post('http://localhost:3000/files/move/' + this.detailItem.id, {
                            oldFolderId: this.$route.params ? this.$route.params.folderId : null,
                            newFolderId: this.selection[0].id
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

        async downloadFile() {
            try {
                let res = await Axios.get('http://localhost:3000/files/download', {
                    params: {
                        bucket_name: localStorage.getItem('bucket'),
                        name: this.detailItem.name
                    }, 
                    responseType: 'blob'
                })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(new Blob([res.data]))
                link.setAttribute('download', this.detailItem.name) 
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

        formSubmit() {
            this.updateName()
        }
    }
  }
</script>