<template>
    <v-card flat v-if="userrole == 'User' || userrole == 'Group'">
        <v-row v-if="$route.fullPath != '/user/profile'" class="mr-0">
            <v-col cols="5" md="9" sm="8" class="pa-0">
                <v-breadcrumbs :items="items" large v-if="!breadcrumbs">
                    <template v-slot:divider>
                        <v-icon>mdi-chevron-right</v-icon>
                    </template>
                </v-breadcrumbs>
                <v-breadcrumbs :items="breadcrumbs" v-else large>
                    <template v-slot:divider>
                        <v-icon>mdi-chevron-right</v-icon>
                    </template>
                </v-breadcrumbs>
            </v-col>
            <v-col cols="7" md="3" sm="4" class="d-flex align-center justify-end">
                <v-tooltip bottom v-if="selectedCount > 0">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            v-on="on"
                            @click="restoreTrash()"                            
                        >
                            <v-icon>mdi-backup-restore</v-icon>
                        </v-btn>
                    </template>
                    <span>Khôi phục</span>
                </v-tooltip>
                <v-tooltip bottom v-if="selectedCount > 0">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            v-on="on"
                            @click="openDialogDeleteTrash()"
                            
                        >
                            <v-badge
                                color="primary"
                                overlap
                                class="align-self-center"
                            >
                                <template v-slot:badge>
                                    <span>{{ selectedCount }}</span>
                                </template>
                                <v-icon>delete</v-icon>
                            </v-badge>
                        </v-btn>
                    </template>
                    <span>Xóa</span>
                </v-tooltip>
                
                <v-tooltip bottom v-if="showDetail">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            v-on="on"
                            @click="activeViewDetail()"
                        >
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </template>
                    <span>Xem chi tiết</span>
                </v-tooltip>
                <v-tooltip bottom v-if="showDetail">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            v-on="on"
                            @click="activeRename()"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>Đổi tên</span>
                </v-tooltip>
                <v-tooltip bottom v-if="showDetail">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            v-on="on"
                            @click="activeDownload()"
                        >
                            <v-icon>mdi-download</v-icon>
                        </v-btn>
                    </template>
                    <span>Tải xuống</span>
                </v-tooltip>
                <v-tooltip bottom v-if="showDetail">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            v-on="on"
                            @click="activeDelete()"
                        >
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </template>
                    <span>Xóa</span>
                </v-tooltip>
                <v-divider vertical class="mx-2" v-if="showDetail || selectedCount > 0"></v-divider>
                <v-btn 
                    depressed 
                    text 
                    icon
                    @click="viewFile = !viewFile"
                ><v-icon>view_list</v-icon></v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data: () => ({
        items: [
            {
                text: 'Kho của tôi',
                disabled: false,
                to: '/user/drive'
            },
        ],
        userrole: null,
        viewFile: true,
    }),

    mounted() {
        this.userrole = localStorage.getItem('userrole')
    },

    watch: {
        viewFile: function() {
            this.$store.commit('setViewFile', {
                viewFile: this.viewFile
            })
        },
        $route(from) {
            let path = from.fullPath
            switch (path) {
                case '/user/drive':
                    this.items[0].text = 'Kho của tôi'
                    this.items[0].to = path
                    break;
                case '/user/share':
                    this.items[0].text = 'Được chia sẻ với tôi'
                    this.items[0].to = path
                    break;
                case '/user/trash':
                    this.items[0].text = 'Thùng rác'
                    this.items[0].to = path
                    break;
                default:
                    break;
            }
        }, 
        textOptionBarForSearch (val) {
            if(val) {
                this.items[0].text = 'Kết quả tìm kiếm'
            } else {
                this.items[0].text = 'Kho của tôi'
                this.items[0].to = '/user/drive'
            }
        }
    },

    computed: {
        ...mapState ([
            'selectedCount', 'showDetail', 'textOptionBarForSearch'
        ]),

        breadcrumbs: {
            get() {
                let breadcrumbs = this.$store.state.breadcrumbs
                if(breadcrumbs !==null) {
                    return [...this.items, ...breadcrumbs]
                } else return null
            }
        }
    },

    methods: {
        openDialogDeleteTrash() {
            this.$store.commit('setDialogDeleteTrash', true)
        },
        restoreTrash() {
            this.$store.commit('setRestoreTrash', true)
        },
        activeViewDetail() {
            this.$store.commit('setViewDetail', true)
        },
        activeRename() {
            this.$store.commit('setRename', true)
        },
        activeDownload() {
            this.$store.commit('setDownload', true)
        },
        activeDelete() {
            this.$store.commit('setDelete', true)
        },
    }
}
</script>