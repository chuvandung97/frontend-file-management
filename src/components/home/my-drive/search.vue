<template>
    <Layout
        :folderFileLists="folderFileLists"
        :isLoading="isLoading"
        :textOptionBarForSearch="true"
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
                        userid: localStorage.getItem('userid'),
                        storage_id: localStorage.getItem('bucket'),
                        active: this.$route.query ? this.$route.query.active : true,
                        search: true,
                        name: this.$route.query ? this.$route.query.name : '',
                        size: this.$route.query ? this.$route.query.size : '',
                        time: this.$route.query ? this.$route.query.time : '',
                        owner: this.$route.query ? this.$route.query.owner : '',
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