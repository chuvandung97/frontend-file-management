<template>
    <div>
        <AppBarNavigationDrawer />
        <v-content>
            <v-card flat v-if="userrole == 'User' || userrole == 'Group'">
                <v-row v-if="$route.fullPath != '/user/profile'">
                    <v-col cols="5" md="6" class="pa-0">
                        <v-breadcrumbs :items="items" large>
                            <template v-slot:divider>
                                <v-icon>mdi-chevron-right</v-icon>
                            </template>
                        </v-breadcrumbs>
                    </v-col>
                    <v-col cols="5" md="5">
                        <v-tooltip bottom v-if="selectedCount > 0">
                            <template v-slot:activator="{ on }">
                                <v-btn 
                                    depressed 
                                    text 
                                    icon
                                    class="float-right mr-n4"
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
                        <v-tooltip bottom v-if="selectedCount > 0">
                            <template v-slot:activator="{ on }">
                                <v-btn 
                                    depressed 
                                    text 
                                    icon
                                    class="float-right"
                                    v-on="on"
                                    @click="restoreTrash()"                            
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
            </v-card>
            <v-divider></v-divider>
            <!-- <v-progress-linear
                :active="true"
                :indeterminate="true"
                color="blue"
            ></v-progress-linear> -->
            <router-view :key="$route.fullPath"></router-view>
        </v-content>
    </div>
</template>

<script>
import AppBarNavigationDrawer from '../components/home/layouts/AppBarNavigationDrawer';
import { mapState } from 'vuex'
export default {
    components: {
        AppBarNavigationDrawer
    },

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
        fullPath: null,
    }),

    mounted() {
        this.userrole = localStorage.getItem('userrole')
        this.fullPath = this.$route.fullPath
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
            'selectedCount',
        ])
    },

    methods: {
        openDialogDeleteTrash() {
            this.$store.commit('setDialogDeleteTrash', true)
        },
        restoreTrash() {
            this.$store.commit('setRestoreTrash', true)
        }
    }
};
</script>