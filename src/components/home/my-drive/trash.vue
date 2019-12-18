<template>
    <v-card flat>
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :items-per-page="999"
            sort-by="name"
            v-if="viewFile"
            :class="'view_list unselectable'"
            item-key="name"
            show-select
        >
            <template v-slot:item.name="{ item }">
                <v-icon class="mr-2" v-if="item.type == 'image/png'" color="primary">mdi-file-image</v-icon>
                <v-icon class="mr-2" v-else-if="item.type == 'application/docx'" color="blue">mdi-file-word-box</v-icon> 
                <v-icon class="mr-2" v-else-if="item.type == 'application/pdf'" color="red">mdi-file-pdf-box</v-icon>
                <v-icon class="mr-2" v-else-if="item.type == 'application/xlsx'" color="green">mdi-file-excel-box</v-icon>
                <v-icon class="mr-2" v-else-if="item.type == 'application/pptx'" color="orange">mdi-file-powerpoint-box</v-icon>
                <v-icon class="mr-2" v-else-if="item.type == 'video/mp4'" color="red">mdi-file-video</v-icon>
                <v-icon class="mr-2" v-else>mdi-folder</v-icon>
                {{ item.name }}
            </template> 
            <template v-slot:item.created_by="{ item }">
                {{ item.User.name }}
            </template>
            <template v-slot:item.updatedAt="{ item }">
                {{ item.updatedAt | formatDate }}
            </template>
            <template v-slot:item.size="{ item }">
                {{ item.size | formatSize }}
            </template>
        </v-data-table>
        <template v-if="!viewFile">
            <v-card flat v-if="folderLists.length > 0">
                <v-subheader>Thư mục</v-subheader>
                <v-card-text class="mt-n5 unselectable">
                    <v-row>
                        <v-col v-for="folder in folderLists" cols="6" sm="4" md="3" xl="1" :key="folder.name">
                            <v-card outlined class="pa-3"  @dblclick="showDetailFolder(folder)" @contextmenu="showSelectMenu($event, folder)">
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
        <v-dialog v-model="dialogDeleteTrash" width="400" persistent>
            <v-card>
                <v-card-title
                    class="headline primary white--text"
                    primary-title
                >
                    Xóa thư mục
                </v-card-title>

                <v-card-text class="red--text mt-3">
                    Chú ý: Điều này sẽ xóa toàn bộ file và thư mục bên trong thư mục này
                </v-card-text>
                <v-card-actions class="mt-n3 mr-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="dialogDeleteTrash = false"
                        class="text-none"
                        depressed
                        text
                        color="primary"
                        outlined
                    >Hủy</v-btn>
                    <v-btn
                        color="primary"
                        @click="deletePermanently()"
                        class="text-none"
                        depressed
                    >Xóa</v-btn>
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
            showSelectTable: false,
            show: false,
            x: 0,
            y: 0,
            selected: [],
            folders: [],
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
        }),

        mounted() {
            this.getFolderFileList()
        },

        computed: {
            dialogDeleteTrash: {
                get() {
                    return this.$store.state.dialogDeleteTrash
                },
                set() {
                    this.$store.commit('setDialogDeleteTrash', false)
                }
            },

            restoreTrash: {
                get() {
                    return this.$store.state.restoreTrash
                },
                set() {
                    this.$store.commit('setRestoreTrash', false)
                }
            },

            ...mapState ([
                'viewFile'
            ]),
        },

        watch: {
            selected: function() {
                this.$store.commit('setSelectedTrash', {
                    selectedCount: this.selected.length
                })
            },
            restoreTrash: function() {
                this.restore()
            }
        },

        methods: {
            async getFolderFileList() {
                try {
                    let res = await Axios.all([
                        Axios.get('http://localhost:3000/folders/lists/trash', {
                            params: {
                                storage_id: localStorage.getItem('bucket'),
                                active: 0
                            }
                        }),
                        Axios.get('http://localhost:3000/files/lists', {
                            params: {
                                storage_id: localStorage.getItem('bucket'),
                                active: 0
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

            async restore() {
                let folderIds = this.selected.filter(el => !el.type).map(currentElArray => currentElArray.id)
                let fileIds = this.selected.filter(el => el.type).map(currentElArray => currentElArray.id)
                try {
                    if(folderIds.length == 0) {
                        await Axios.post('http://localhost:3000/files/restore', {
                            fileIds: fileIds,
                            user_id: localStorage.getItem('userid')
                        })
                    } else if(fileIds.length == 0) {
                        await Axios.post('http://localhost:3000/folders/restore', {
                            folderIds: folderIds,
                            user_id: localStorage.getItem('userid')
                        })
                    } else {
                        await Axios.all([
                            Axios.post('http://localhost:3000/folders/restore', {
                                folderIds: folderIds,
                                user_id: localStorage.getItem('userid')
                            }),
                            Axios.post('http://localhost:3000/files/restore', {
                                fileIds: fileIds,
                                user_id: localStorage.getItem('userid')
                            })
                        ])
                    }
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: 'Khôi phục thành công !',
                        showNoti: true
                    })
                } catch (e) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Khôi phục thất bại !',
                        showNoti: true
                    })
                } finally {
                    this.$store.commit('setRestoreTrash', false)
                    this.getFolderFileList()
                    this.selected = []
                }
            },

            async deletePermanently() {
                let folderIds = this.selected.filter(el => !el.type).map(currentElArray => currentElArray.id)
                let fileIds = this.selected.filter(el => el.type).map(currentElArray => currentElArray.id)
                let fileNames = this.selected.filter(el => el.type).map(currentElArray => currentElArray.name)
                try {
                    if(folderIds.length == 0) {
                        await Axios.delete('http://localhost:3000/files/delete', {
                            params: {
                                fileIds: fileIds,
                                fileNames: fileNames,
                                storage: localStorage.getItem('bucket')
                            }
                        })
                    } else if(fileIds.length == 0) {
                        await Axios.delete('http://localhost:3000/folders/delete', {
                            params: {
                                folderIds: folderIds
                            }
                        })
                    } else {
                        await Axios.all([
                            Axios.delete('http://localhost:3000/folders/delete', {
                                params: {
                                    folderIds: folderIds
                                }
                            }),
                            Axios.delete('http://localhost:3000/files/delete', {
                                params: {
                                    fileIds: fileIds
                                }
                            })
                        ])
                    }
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: 'Xóa thành công !',
                        showNoti: true
                    })
                } catch (e) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Xóa thất bại !',
                        showNoti: true
                    })
                } finally {
                    this.$store.commit('setDialogDeleteTrash', false)
                    this.getFolderFileList()
                    this.selected = []
                }
            }
        }
    }
</script>