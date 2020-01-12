<template>
    <v-card flat v-if="userrole == 'User' || userrole == 'Group'">
        <v-row v-if="$route.fullPath != '/user/profile' && $route.fullPath != '/user/membergroup'" class="mr-0">
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
                            @click.stop="activeViewDetail()"
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
                            @click.stop="activeRename()"
                            :disabled="isDisabled"
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
                            @click="activeDelete()"
                            :disabled="isDisabled"
                        >
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </template>
                    <span>Xóa</span>
                </v-tooltip>
                <span v-show="showDetail">
                    <v-menu 
                        offset-y
                        bottom
                        left
                        content-class="dropdown-menu"
                        transition="slide-y-transition"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn
                                depressed 
                                text 
                                icon
                                v-on="on"
                                @click.native.stop
                            >
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list width="300" dense>
                            <v-list-item @click="activeMove()" :disabled="isDisabled">
                                <v-list-item-action>
                                    <v-icon :disabled="isDisabled">mdi-folder-move</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Di chuyển</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="!optionChangeStar" @click="activeUpdateStar()" :disabled="isDisabled">
                                <v-list-item-action>
                                    <v-icon :disabled="isDisabled">mdi-star-outline</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Thêm vào thư mục Có gắn dấu sao</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-else @click="activeUpdateStar()" :disabled="isDisabled">
                                <v-list-item-action>
                                    <v-icon :disabled="isDisabled">mdi-star</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Xóa khỏi thư mục Có gắn dấu sao</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="activeShare()">
                                <v-list-item-action>
                                    <v-icon>mdi-share</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Chia sẻ</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-if="optionShowVersionManagement" @click="activeVersionManagement()">
                                <v-list-item-action>
                                    <v-icon>mdi-history</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Quản lý phiên bản</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="activeUpload()" :disabled="isDisabled">
                                <v-list-item-action>
                                    <v-icon :disabled="isDisabled">mdi-upload</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Tải lên bản thay thế</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item @click="activeDownload()">
                                <v-list-item-action>
                                    <v-icon>mdi-download</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Tải xuống</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </span>
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
                text: null,
                disabled: false,
                to: null
            },
        ],
        userrole: null,
        viewFile: true,
        isDisabled: false
    }),

    mounted() {
        this.getBreadcrumbs()
        this.userrole = localStorage.getItem('userrole')
        if(localStorage.getItem('rolegroup') == 'READ') {
            this.isDisabled = true
        }
    },

    watch: {
        viewFile: function() {
            this.$store.commit('setViewFile', {
                viewFile: this.viewFile
            })
        },
        $route() {
            this.getBreadcrumbs()
        }, 
        textOptionBarForSearch (val) {
            if(val) {
                this.items[0].text = 'Kết quả tìm kiếm'
                this.items[0].to = this.$route.fullPath
            } else {
                this.items[0].text = 'Kho của tôi'
                this.items[0].to = '/user/drive'
            }
        }
    },

    computed: {
        ...mapState ([
            'selectedCount', 'showDetail', 'textOptionBarForSearch', 'optionShowVersionManagement', 'optionChangeStar'
        ]),

        breadcrumbs: {
            get() {
                let breadcrumbs = this.$store.state.breadcrumbs
                if(breadcrumbs !==null) {
                    breadcrumbs.map(el => {
                        el.text = el.text.slice(14)
                        return el
                    })
                    return [...this.items, ...breadcrumbs]
                } else return null
            }
        }
    },

    methods: {
        getBreadcrumbs() {
            let path = this.$route.path
            switch (path) {
                case '/user/membergroup':
                    this.items[0].text = 'Thành viên trong nhóm'
                    this.items[0].to = path
                    break;
                case '/user/drive':
                    this.items[0].text = 'Kho của tôi'
                    this.items[0].to = path
                    break;
                case '/user/share':
                    this.items[0].text = 'Được chia sẻ với tôi'
                    this.items[0].to = path
                    break;
                case '/user/star':
                    this.items[0].text = 'Có gắn dấu sao'
                    this.items[0].to = path
                    break;
                case '/user/trash':
                    this.items[0].text = 'Thùng rác'
                    this.items[0].to = path
                    break;
                case '/user/search':
                    this.items[0].text = 'Kết quả tìm kiếm'
                    this.items[0].to = this.$route.fullPath
                    break;
                default:
                    this.items[0].text = 'Kho của tôi'
                    this.items[0].to = '/user/drive'
                    break;
            }
        },
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
        activeMove() {
            this.$store.commit('setMove', true)
        },
        activeShare() {
            this.$store.commit('setShare', true)
        },
        activeUpload() {
            this.$store.commit('setUpload', true)
        },
        activeVersionManagement() {
            this.$store.commit('setVersionManagement', true)
        },
        activeUpdateStar() {
            this.$store.commit('setUpdateStar', true)
        }
    }
}
</script>