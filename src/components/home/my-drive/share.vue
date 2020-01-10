<template>
    <Layout
        :folderFileLists="folderFileLists"
        :isLoading="isLoading"
        :textOptionBarForSearch="false"
    ></Layout>
</template>

<script>
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
}
</script>