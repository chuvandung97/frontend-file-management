<template>
    <v-card flat v-if="userrole == 'User' || userrole == 'Group'">
        <v-row v-if="$route.fullPath != '/user/profile'" class="mr-0">
            <v-col cols="5" md="6" class="pa-0">
                <v-breadcrumbs :items="items" large>
                    <template v-slot:divider>
                        <v-icon>mdi-chevron-right</v-icon>
                    </template>
                </v-breadcrumbs>
            </v-col>
            <v-col cols="7" md="6" class="d-flex align-center justify-end">
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
                            @click="''"
                            
                        >
                            <v-icon>mdi-share</v-icon>
                        </v-btn>
                    </template>
                    <span>Chia sẻ</span>
                </v-tooltip>
                <v-tooltip bottom v-if="showDetail">
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            depressed 
                            text 
                            icon
                            v-on="on"
                            @click="''"
                            
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
                            @click="''"
                            
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
                text: 'Tất cả file',
                disabled: false,
                to: '/user/drive'
            }
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
    },

    computed: {
        ...mapState ([
            'selectedCount', 'showDetail'
        ])
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
        activeOptionFile(active) {
            this.$store.commit('setOptionFile', {
                activeViewDetail: active,
                activeShare: false,
                activeDownload: false,
                activeDelete: false
            })
        }
    }
}
</script>