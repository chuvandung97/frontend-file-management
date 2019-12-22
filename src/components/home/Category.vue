<template>
    <v-card flat>
        <v-card-title>Danh mục</v-card-title>
        <v-tabs vertical >
            <v-tab class="justify-start">
                <v-icon left>mdi-file</v-icon>
                Loại file
            </v-tab>
            <v-tab class="justify-start">
                <v-icon left>mdi-folder</v-icon>
                Loại thư mục
            </v-tab>

            <v-tab-item>
                <v-card-text class="mt-n9">
                    <v-row>
                        <v-col cols="12" md="3" sm="6">
                            <v-combobox
                                v-model="select"
                                return-object
                                :items="type_list"
                                item-text="extension"
                                label="Loại"
                            ></v-combobox>
                        </v-col>
                        <v-col cols="12" md="2" sm="5">
                            <v-text-field
                                v-model="icon"
                                label="Biểu tượng"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="1" sm="1" class="d-flex justify-center">
                            <v-icon :color="color">{{ icon }}</v-icon>
                        </v-col>
                        <v-col cols="12" md="3" sm="6">
                            <v-text-field
                                v-model="color"
                                label="Màu sắc"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-btn color="primary" depressed class="text-none mt-3" @click="addFileType()">Thêm mới</v-btn>
                        </v-col>
                    </v-row>
                    <span class="caption red--text font-italic font-weight-medium">( * Loại file được thêm mới sẽ cho phép người dùng tải loại file đó lên hệ thống )</span>
                    <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :items-per-page="5"
                    >
                        <template v-slot:item.type="{ item }">
                            {{item.filetype.extension}}
                        </template>
                        <template v-slot:item.icon="{ item }">
                            <v-icon class="ml-n5" :color="item.color">{{item.icon}}</v-icon>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-tab-item>
            <v-tab-item>
                <v-card-text>
                </v-card-text>
            </v-tab-item>
        </v-tabs>
    </v-card>
</template>
<script>
import Axios from 'axios'
export default {
    data () {
        return {
            icon: null,
            color: null, 
            headers: [
            {
                text: 'Loại',
                align: 'left',
                sortable: false,
                value: 'type',
                width: '12%'
            },
            { text: 'Biểu tượng', align: 'center', value: 'icon', width: '12%' },
            { text: 'Chỉnh sửa', align: 'center', value: 'edit', width: '12%' },
            ],
            desserts: [],
            type_list: [],
            select: []
        }
    },

    mounted() {
        this.getFileType()
        this.getDetailFileType()
    },

    watch: {
        icon (val) {
            this.icon = val
        },
        color (val) {
            this.color = val
        }
    },

    methods: {
        async getFileType() {
            try {
                let res = await Axios.get('http://localhost:3000/files/lists/type')
                this.type_list = res.data.body.type_list
            } catch (error) {
                console.log(error)
            }
        },

        async getDetailFileType() {
            try {
                let res = await Axios.get('http://localhost:3000/files/lists/detailtype')
                this.desserts = res.data.body.detail_type_list
            } catch (error) {
                console.log(error)
            }
        },

        async addFileType() {
            try {
                await Axios.post('http://localhost:3000/files/add/detailtype', {
                    type_id: this.select.id,
                    icon: this.icon,
                    color: this.color
                })
            } catch (error) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Thêm mới thất bại !',
                    showNoti: true
                })
            } finally {
                this.getDetailFileType()
                this.select = []
                this.icon = null,
                this.color = null
            }
        }
    }
  }
</script>
<style scoped>
    .v-data-table[data-v-d614f524] {
        width: 90%
    }
</style>