<template>
    <v-card flat>
        <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :items-per-page="999"
            v-if="viewFile"
            :class="'view_list'"
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
                        <td>{{ item.size }}</td>
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
            <v-card-title>Thư mục</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col v-for="folder in folders" cols="6" sm="4" md="3" xl="1" :key="folder.name">
                        <v-card outlined class="pa-3" :to="'/user/drive'"  @dblclick="showDetailFolder(folder)" @contextmenu="showSelectMenu($event, folder)">
                            <v-icon class="mr-2">mdi-folder</v-icon> {{ folder.name }}    
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-title>File</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col v-for="file in files" cols="6" sm="4" md="3" xl="1" :key="file.name" @contextmenu="showSelectMenu($event, file)">
                        <v-card outlined class="pa-3" :to="'/user/drive'">
                            {{ file.name }}
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
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
                    <v-list-item-title><v-icon>mdi-eye</v-icon> Xem chi tiết</v-list-item-title>
                </v-list-item>
                <v-list-item @click="dialog = true, overlay = true">
                    <v-list-item-title><v-icon>mdi-pencil</v-icon> Đổi tên</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title><v-icon>mdi-folder-move</v-icon> Di chuyển</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title><v-icon>mdi-share</v-icon> Chia sẻ</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title><v-icon>mdi-download</v-icon> Tải xuống</v-list-item-title>
                </v-list-item>
                <v-list-item @click="removeFolderToTrash()">
                    <v-list-item-title><v-icon>mdi-delete</v-icon> Xóa</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-dialog v-model="dialog2" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialog2 = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Chi tiết</v-toolbar-title>
                </v-toolbar>
                <v-row>
                    <v-col cols="7">
                        <v-timeline dense clipped>
                        
                        <v-timeline-item
                            class="mb-6"
                            hide-dot
                        >
                            <span>TODAY</span>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            color="grey"
                            icon-color="grey lighten-2"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">This order was archived.</v-col>
                            <v-col cols="5">15:26</v-col>
                            </v-row>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">
                                Digital Downloads fulfilled 1 item.
                            </v-col>
                            <v-col cols="5">15:25</v-col>
                            </v-row>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            color="grey"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">
                                Order confirmation email was sent to John Leider (john@vuetifyjs.com).
                            </v-col>
                            <v-col cols="5">15:25</v-col>
                            </v-row>
                        </v-timeline-item>

                        <v-timeline-item
                            class="mb-4"
                            color="grey"
                            small
                        >
                            <v-row justify="space-between">
                            <v-col cols="7">
                                A $15.00 USD payment was processed on PayPal Express Checkout
                            </v-col>
                            <v-col cols="5">15:25</v-col>
                            </v-row>
                        </v-timeline-item>
                        </v-timeline>
                    </v-col>
                    <v-divider vertical inset></v-divider>
                    <v-col class="text-center" cols="5"></v-col>
                </v-row>
            </v-card>
        </v-dialog>    
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
                        v-model="new_name_folder"
                        label="Tên"
                        required
                        class="mt-3"
                        :rules="[v => !!v || 'Mời bạn nhập tên']"
                        @keypress.enter="formSubmit()"
                        autofocus
                    >
                    </v-text-field>
                </v-card-text>
                <v-card-actions class="mt-n6">
                    <v-btn
                        @click="dialog = false, overlay = false"
                        class="text-none"
                    >Hủy</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        @click="updateName()"
                        class="text-none"
                        :disabled="new_name_folder == '' ? true : false"
                    >Lưu</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import Axios from 'axios';
import moment from 'moment'
import Vue from 'vue'
import { mapState } from 'vuex'

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
})
export default {
    data: () => ({
        overlay: false,
        old_name_folder: null,
        new_name_folder: null,
        folder_id: null,
        dialog: false,
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
        folders: [],
        files: []
    }),

    mounted() {
        this.getFolderFileList()
        this.$store.commit('setSelectedTrash', {
            selectedCount: null
        })
        //this.getFileList()
    },

    computed: {
        ...mapState ([
            'viewFile', 'reloadDrive'
        ])
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
            this.new_name_folder = item.name
            this.old_name_folder = this.new_name_folder
            this.folder_id = item.id
            this.$nextTick(() => {
                this.show = true;
            });
        },

        async getFolderFileList() {
            try {
                let res = await Axios.all([
                    Axios.get('http://localhost:3000/folders/lists', {
                        params: {
                            storage_id: localStorage.getItem('bucket'),
                            active: 1
                        }
                    }),
                    Axios.get('http://localhost:3000/files/lists', {
                        params: {
                            storage_id: localStorage.getItem('bucket'),
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

        async getFileList() {
            try {
                let res = await Axios.get('http://localhost:3000/files/lists', {
                    params: {
                        storage_id: localStorage.getItem('bucket'),
                        active: 1
                    }
                })
                this.desserts = (res.data.body.file_list)
            } catch (error) {
                console.log(error)
            }
        },

        async updateName() {
            if(this.new_name_folder == this.old_name_folder) {
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: 'Đổi tên thư mục thành công',
                    showNoti: true
                })
                this.dialog = false
            } else { 
                try {
                    let res = await Axios.post('http://localhost:3000/folders/update/' + this.folder_id, {
                        name: this.new_name_folder,
                    })
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message,
                        showNoti: true
                    })
                } catch (error) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Đổi tên thư mục thất bại',
                        showNoti: true
                    })
                } finally {
                    this.dialog = false
                    this.overlay = false
                    this.getFolderFileList()
                }
            }
        },

        async removeFolderToTrash() {
            try {
                await Axios.post('http://localhost:3000/folders/remove/trash/' + this.folder_id)
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: 'Thư mục đã được chuyển đến thùng rác',
                    showNoti: true
                })
            } catch (error) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Xóa thư mục thất bại',
                    showNoti: true
                })
            } finally {
                this.getFolderFileList()
            }
        },

        formSubmit() {
            this.updateName()
        }
    }
  }
</script>