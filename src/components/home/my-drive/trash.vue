<template>
    <v-card flat>
        <v-row>
            <v-col cols="5" md="6" class="pa-0">
                <v-breadcrumbs :items="items" large>
                    <template v-slot:divider>
                        <v-icon>mdi-chevron-right</v-icon>
                    </template>
                </v-breadcrumbs>
            </v-col>
            <v-col cols="5" md="5">
                <v-tooltip bottom v-if="selected.length > 0">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            class="float-right mr-n4"
                            v-on="on"
                            @click="dialog1 = true"
                            
                        >
                            <v-badge
                                color="primary"
                                overlap
                                class="align-self-center"
                            >
                                <template v-slot:badge>
                                <span>{{ selected.length }}</span>
                                </template>
                                <v-icon>
                                delete
                                </v-icon>
                            </v-badge>
                        </v-btn>
                    </template>
                    <span>Xóa</span>
                </v-tooltip>
                <v-tooltip bottom v-if="selected.length > 0">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            class="float-right"
                            v-on="on"
                            @click="restore()"                            
                        >
                            <v-icon>mdi-backup-restore</v-icon>
                        </v-btn>
                    </template>
                    <span>Khôi phục</span>
                </v-tooltip>
            </v-col>
            <v-col cols="2" md="1">
                <v-btn 
                    depressed 
                    text 
                    icon
                    @click="viewFile = !viewFile"
                ><v-icon>view_list</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :items-per-page="999"
            sort-by="name"
            v-if="viewFile"
            :class="'view_list'"
            item-key="name"
            show-select
        >
            <template v-slot:item.name="{ item }">
                <v-icon class="mr-2">mdi-folder</v-icon> {{ item.name }}
            </template> 
            <template v-slot:item.created_by="{ item }">
                {{ item.User.name }}
            </template>
            <template v-slot:item.updatedAt="{ item }">
                {{ item.updatedAt | formatDate }}
            </template>
        </v-data-table>
        <template v-if="!viewFile">
            <v-card-title>Thư mục</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col v-for="folder in folders" cols="3" :key="folder.name">
                        <v-card outlined class="pa-3" :to="'/user/drive'"  @contextmenu="abc">
                            <v-icon class="mr-2">mdi-folder</v-icon> {{ folder.name }}    
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-title>File</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col v-for="dessert in desserts" cols="3" :key="dessert.name">
                        <v-card outlined class="pa-3" :to="'/user/drive'">
                            {{ dessert.name }}
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </template>
        <v-dialog v-model="dialog1" width="400" persistent>
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
                <v-card-actions class="mt-n3">
                    <v-btn
                        @click="dialog1 = false"
                        class="text-none"
                    >Hủy</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        @click="deletePermanently()"
                        class="text-none"
                    >Xóa</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import Axios from 'axios'
    import moment from 'moment'
    import Vue from 'vue'

    Vue.filter('formatDate', function(value) {
        if (value) {
            return moment(String(value)).format('DD/MM/YYYY')
        }
    })
    export default {
        data: () => ({
            showSelectTable: false,
            show: false,
            dialog1: false,
            x: 0,
            y: 0,
            viewFile: true,
            selected: [],
            folders: [],
            items: [
                {
                    text: 'Thùng rác',
                    disabled: false,
                    href: 'breadcrumbs_dashboard',
                },
            ],

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
            this.getFolderList()
        },

        methods: {
            abc(e) {
                e.preventDefault();
                this.show = false;
                this.x = e.clientX;
                this.y = e.clientY;
                this.$nextTick(() => {
                    this.show = true;
                });
            },

            aa() {
                console.log(123)
            },

            async getFolderList() {
                try {
                    let res = await Axios.get('http://localhost:3000/folders/lists', {
                        params: {
                            storage_id: localStorage.getItem('bucket'),
                            active: 0
                        }
                    })
                    this.desserts = res.data.body.folder_list
                } catch (error) {
                    console.log(error)
                }
            },

            async restore() {
                let folderIds = this.selected.map((currentElArray) => {
                    return currentElArray.id
                })
                try {
                    let res = await Axios.post('http://localhost:3000/folders/restore', {
                        folderIds: folderIds
                    })
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message + res.data.count + ' mục !',
                        showNoti: true
                    })
                } catch (e) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Khôi phục thất bại !',
                        showNoti: true
                    })
                } finally {
                    this.getFolderList()
                    this.selected = []
                }
            },

            async deletePermanently() {
                let folderId = this.selected.map((currentElArray) => {
                    return currentElArray.id
                })
                try {
                    let res = await Axios.delete('http://localhost:3000/folders/delete', {
                        params: {
                            folderId: folderId
                        }
                    })
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message + res.data.count + ' mục !',
                        showNoti: true
                    })
                } catch (e) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Xóa thất bại !',
                        showNoti: true
                    })
                } finally {
                    this.dialog1 = false
                    this.getFolderList()
                    this.selected = []
                }
            }
        }
    }
</script>