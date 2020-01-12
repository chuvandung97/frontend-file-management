<template>
    <Layout
        :folderFileLists="folderFileLists"
        :isLoading="isLoading"
        :textOptionBarForSearch="false"
    ></Layout>
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
    }
  }
</script>