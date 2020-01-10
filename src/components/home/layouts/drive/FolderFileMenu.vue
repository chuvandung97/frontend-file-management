<template>
    <v-menu
        v-model="showMenu.active"
        :position-x="showMenu.x"
        :position-y="showMenu.y"
        absolute
        offset-y
        transition="scale-transition"
        >
        <v-list width="300">
            <v-list-item @click="$store.commit('setViewDetail', true)">
                <v-list-item-action>
                    <v-icon>mdi-eye</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item @click="$store.commit('setRename', true)">
                <v-list-item-action>
                    <v-icon>mdi-pencil</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Đổi tên</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item @click="updateStar()">
                <v-list-item-action>
                    <v-icon>{{detailItem.is_star ? 'mdi-star' : 'mdi-star-outline'}}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title v-if="detailItem.is_star">Xóa khỏi thư mục Có gắn dấu sao</v-list-item-title>
                    <v-list-item-title v-else>Thêm vào thư mục Có gắn dấu sao</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item @click="$store.commit('setMove', true)">
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
            <v-list-item v-if="detailItem.filehistories && detailItem.filehistories.length != 0" @click="$store.commit('setVersionManagement', true)">
                <v-list-item-action>
                    <v-icon>mdi-history</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Quản lý phiên bản</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="file-upload" @click="showUploadFile()"> 
                <v-list-item-action>
                    <v-icon>mdi-upload</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Tải lên bản thay thế</v-list-item-title>
                </v-list-item-content>
                <input style="display: none" type="file" id="file" class="file" name="file" ref="file" :accept="typeList" v-on:change="replaceFileUpload()"/>
            </v-list-item>
            <v-list-item @click.prevent="downloadFile()">
                <v-list-item-action>
                    <v-icon>mdi-download</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Tải xuống</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
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
</template>

<script>
import Axios from 'axios'
export default {
    props: {
        'showMenu': {type: Object},
        'detailItem': {type: Object},
        'userId': {type: String},
        'showDownload': {default: false, type: Boolean},
        'showDelete': {default: false, type: Boolean},
        'showUpload': {default: false, type: Boolean},
        'showUpdateStar': {default: false, type: Boolean},
    },

    data: () => ({
        typeList: []
    }),

    mounted() {
        this.getDetailFileType()
    },
    
    watch: {
        showDownload: function(val) {
            if(val) {
                this.downloadFile()
            }
        },
        showDelete: function(val) {
            if(val) {
                this.removeToTrash()
            }
        },
        showUpload: function(val) {
            if(val) {
                this.showUploadFile()
            }
        },
        showUpdateStar: function(val) {
            if(val) {
                this.updateStar()
            }
        }
    },

    methods: {
        async getDetailFileType() {
            try {
                let res = await Axios.get('http://localhost:3000/files/lists/detailtype')
                this.typeList = res.data.body.detail_type_list
                this.typeList = this.typeList.map(el => el.filetype.extension)
            } catch (error) {
                console.log(error)
            }
        },

        showUploadFile() {
            const btn_upload = document.getElementsByClassName('file')
            btn_upload[0].click()
            this.$emit('closeUpload', false)
            this.$store.commit('setUpload', false)
        },

        async updateStar() {
            let detailItem = this.$props.detailItem
            try {
                var url = ''
                if(detailItem.filetypedetail === undefined) {
                    url = 'http://localhost:3000/folders/update/star/'
                } else {
                    url = 'http://localhost:3000/files/update/star/'
                }
                let res = await Axios.post(url + detailItem.id, {
                    is_star: detailItem.is_star ? 0 : 1,
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
                    textNoti: 'Thất bại',
                    showNoti: true
                })
            } finally {
                this.$emit('closeUpdateStar', false)
                this.$store.commit('setReloadIndexDrive', true)
                this.$store.commit('setUpdateStar', false)
            }
        },

        async replaceFileUpload() {
            this.file = this.$refs.file.files[0];
            let formData = new FormData();
            formData.append('file', this.file); // coi như là name="file"
            try {
                let res = await Axios.post('http://localhost:3000/files/upload/replace/' + this.$props.detailItem.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }, 
                    params: {
                        bucket_name: localStorage.getItem('bucket'),
                        created_by: localStorage.getItem('userid'),
                        updated_by: localStorage.getItem('userid')
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
                this.$emit('closeUpload', false)
                this.$store.commit('setUpload', false)
                this.$store.commit('setReloadIndexDrive', true)
            }
        },

        async downloadFile() {
            try {
                let detailItem = this.$props.detailItem
                let res = await Axios.get('http://localhost:3000/files/download', {
                    params: {
                        bucket_name: localStorage.getItem('bucket'),
                        name: detailItem.origin_name
                    }, 
                    responseType: 'blob'
                })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(new Blob([res.data]))
                link.setAttribute('download', detailItem.name) 
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
            } finally {
                this.$emit('closeDownload', false)
                this.$store.commit('setDownload', false)
            }
        },

        async removeToTrash() {
            try {
                var url = ''
                let detailItem = this.$props.detailItem
                if(detailItem.filetypedetail === undefined) {
                    url = 'http://localhost:3000/folders/remove/trash/'
                } else {
                    url = 'http://localhost:3000/files/remove/trash/'
                }
                await Axios.post(url + detailItem.id, {
                    user_id: localStorage.getItem('userid')
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
                this.$store.commit('setReloadIndexDrive', true)
                this.$emit('closeDelete', false)
                this.$store.commit('setDelete', false)
            }
        },
    } 
}
</script>