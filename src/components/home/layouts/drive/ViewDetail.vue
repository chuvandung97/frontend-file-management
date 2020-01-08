<template>
    <v-slide-x-reverse-transition>
        <v-card v-show="showDetailView" class="detailview-card" elevation="5">
            <v-card-title
                class="primary white--text py-2 body-1"
            >
                Chi tiết
                <v-spacer></v-spacer>
                <v-btn depressed text icon>
                    <v-icon color="white" @click="closeDetailView">mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="pa-0 color-detail">
                <v-tabs
                    v-model="tab"
                    background-color="transparent"
                    color="primary"
                    grow
                    height="40"
                    centered
                >
                    <v-tab class="text-none">Thông tin</v-tab>
                    <v-tab class="text-none">Hoạt động</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab" class="tabs-items">
                    <v-tab-item class="pa-2" v-if="Object.values(detailItem).length == 0">
                        <div class="text-center">
                            <v-icon size="110">folder_open</v-icon>
                        </div>
                        <div class="pl-3 text-center headline">
                            Kho của tôi
                        </div>
                    </v-tab-item>
                    <v-tab-item class="pa-2" v-else>
                        <div class="text-center">
                            <v-icon size="110" :color="detailItem.filetypedetail ? detailItem.filetypedetail.color : ''">{{detailItem.filetypedetail ? detailItem.filetypedetail.icon : 'mdi-folder'}}</v-icon>
                        </div>
                        <div class="pl-2">
                            <div class="row-detail">
                                <div class="child-row-detail">Tên:</div>
                                <div>{{detailItem.name}}</div>
                            </div>
                            <div class="row-detail">
                                <div class="child-row-detail">Chủ sở hữu:</div>
                                <div>{{detailItem.User.name}}</div>
                            </div>
                            <div class="row-detail">
                                <div class="child-row-detail">Kích cỡ:</div>
                                <div v-if="detailItem.size">{{detailItem.size | formatSize}}</div>
                                <div v-else>--</div>
                            </div>
                            <div class="row-detail">
                                <div class="child-row-detail">Ngày tải lên:</div>
                                <div>{{detailItem.createdAt | formatDate}}</div>
                            </div>
                            <div class="row-detail">
                                <div class="child-row-detail">Cập nhật lần cuối:</div>
                                <div>{{detailItem.updatedAt | formatDate}}</div>
                            </div>
                        </div>
                    </v-tab-item>
                    <v-tabs-items v-if="logLists.length == 0">
                        <Loading />
                    </v-tabs-items>
                    <v-tab-item class="pa-2">
                        <v-timeline dense clipped class="pa-0">
                            <v-timeline-item
                                v-for="logList in logLists"
                                :key="logList.id"
                                color="primary"
                                icon-color="grey lighten-2"
                                small
                                class="pa-0 ml-n9"
                            >
                                <v-row justify="space-between">
                                    <v-col cols="7" class="pa-1 ml-n4">
                                        {{logList.User.id == userId ? 'Bạn' : logList.User.name}} đã 
                                        <span v-if="logList.action == 'created' && logList.folder_id">tạo</span>
                                        <span v-if="logList.action == 'created' && logList.file_id">tải lên</span>
                                        <span v-if="logList.action == 'renamed'">đổi tên</span> 
                                        <span v-if="logList.action == 'replaced'">thay thế</span>
                                        <span v-if="logList.action == 'deleted' || logList.action == 'moved'">di chuyển</span>
                                        <span v-if="logList.action == 'restored'">khôi phục</span>
                                        1 mục {{logList.log}}                                            
                                    </v-col>
                                    <v-col class="text-right pa-1 mr-1" cols="5">{{logList.createdAt | formatDate}}</v-col>
                                </v-row>
                            </v-timeline-item>
                        </v-timeline>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
        </v-card>
    </v-slide-x-reverse-transition>
</template>

<script>
import Axios from 'axios'
import Loading from '../Loading'
export default {
    props: {
        'showDetailView': {default: false, type: Boolean},
        'detailItem': {type: Object},
        'userId': {type: String}
    },
    components: {
        Loading
    },
    data: () => ({
        tab: 0,
        logLists: [],
        loading: false
    }),

    watch: {
        tab: function(val) {
            if(val == 1) {
                let detailItem = this.$props.detailItem
                if(detailItem.filetypedetail) {
                    this.getFileLog(detailItem.id)
                } else {
                    this.getFolderLog(detailItem.id)
                }
            }
        },
        detailItem: function(val) {
            if(val.filetypedetail) {
                this.getFileLog(val.id)
            } else {
                this.getFolderLog(val.id)
            }
        },
    },
    computed: {},
    methods: {
        async getFileLog(id) {
            try {
                this.loading = true
                let res = await Axios.get('http://localhost:3000/files/lists/log/' + id)
                this.logLists = res.data.body.log_list
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        async getFolderLog(id) {
            try {
                this.loading = true
                let res = await Axios.get('http://localhost:3000/folders/lists/log/' + id)
                this.logLists = res.data.body.log_list
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },
        closeDetailView() {
            this.tab = 0
            this.$emit('closeDetailView', false)
            this.$store.commit('setViewDetail', false)
        },
    }
}
</script>

<style scoped>
    .color-detail[data-v-4aa1feb1] {
        color: black   
    }

    .row-detail {
        display: flex;
        padding-bottom: 12px
    }

    .child-row-detail {
        flex: 0 0 90px
    }
    .tabs-items {
        max-height: 300px;
        overflow-x: hidden;
        overflow-y: auto
    }  
    .detailview-card {
        position: fixed;
        z-index: 1;
        width: 19%;
        right: 0;
        top: 8pc;
        bottom: 8pc;        
    }
    @media only screen and (max-width: 450px) {
        .detailview-card {
            width: 50%;
            top: 15pc;
            bottom: 15pc;
        }
    }
    @media only screen and (min-width: 768px) and (max-width: 1023px) {
        .detailview-card {
            width: 30%;
            top: 20pc;
            bottom: 20pc;
        }
    }
    @media only screen and (min-width: 1024px) and (max-width: 1025px) {
        .detailview-card {
            width: 30%;
            top: 28pc;
            bottom: 28pc;
        }
    }
    @media only screen and (min-width: 2400px) {
        .detailview-card {
            width: 15%;
            top: 20pc;
            bottom: 20pc;
        }
    }

    .v-timeline--dense:not(.v-timeline--reverse):before {
        left: calc(12px - 1px);
        right: initial;
    }

    .v-timeline-item__divider[data-v-4aa1feb1] {
        min-width: 35px;
    }
</style>