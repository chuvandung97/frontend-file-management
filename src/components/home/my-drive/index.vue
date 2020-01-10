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
        Layout,
    },

    data: () => ({
        folderFileLists: [],
        isLoading: false,
    }),

    mounted() {
        this.getFolderFileList()
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