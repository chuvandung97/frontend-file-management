<template>
    <Layout
        :folderFileLists="folderFileLists"
        :isLoading="isLoading"
        :textOptionBarForSearch="false"
    ></Layout>
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
</template>

<script>
import Axios from 'axios';
import { mapState } from 'vuex'
import Layout from '../layouts/drive/Layout'

export default {
    components: {
        Layout
    },
    data: () => ({
        folderFileLists: [],
        isLoading: false,
        folder_info: {},
    }),

    mounted() {
        this.getFolderFileList()
        this.getFolderInfo()
    },

    computed: {
        ...mapState ([
            'reloadDrive'
        ]),
    },

    watch: {
        reloadDrive: function() {
            this.getFolderFileList()
            this.$store.commit('setReloadIndexDrive', false)
        },
    },

    methods: {
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
        /* async moveFolderOrFile() {
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
        }, */
    }
  }
</script>