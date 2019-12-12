<template>
    <v-card flat>
        <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :items-per-page="999"
            sort-by="name"
            v-if="viewFile"
            :class="'view_list'"
        >
            <template v-slot:item.name="{ item }">
                <v-icon class="mr-2">folder_shared</v-icon> {{ item.name }}
            </template> 
            <template v-slot:item.size="{ item }">
                {{ item.size | formatSize }}
            </template>
        </v-data-table>
        <template v-if="!viewFile">
            <v-card-title>Thư mục</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col v-for="folder in folders" cols="3" :key="folder.name">
                        <v-card outlined class="pa-3" :to="'/user/drive'" @click.right.prevent="abc">
                            <v-icon class="mr-2">mdi-folder</v-icon> {{ folder.name }}    
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-title>File</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col v-for="folder in folders" cols="3" :key="folder.name">
                        <v-card outlined class="pa-3" :to="'/user/drive'">
                            {{ folder.name }}
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </template>
    </v-card>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import Axios from 'axios'
import { mapState } from 'vuex'
import numeral from 'numeral'

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
})

Vue.filter('formatSize', function(value) {
    if(value) {
        return numeral(value).format('0.0 ib')
    }
})

  export default {
    data: () => ({
        folders: [
            {
                name: 'Dashboard',
            },
            {
                name: 'Dashboard1',
            },
            {
                name: 'Dashboard2',
            },
            {
                name: 'Dashboard3',
            },
            {
                name: 'Dashboard4',
            },
            {
                name: 'Dashboard5',
            },
            {
                name: 'Dashboard6',
            },
            {
                name: 'Dashboard7',
            },
            {
                name: 'Dashboard8',
            },
            {
                name: 'Dashboard9',
            },
        ],
        items: [
            {
                text: 'Được chia sẻ với tôi',
                disabled: false,
                href: 'breadcrumbs_dashboard',
            },
            {
                text: 'Link 1',
                disabled: false,
                href: 'breadcrumbs_link_1',
            },
        ],

        headers: [
            {
                text: 'Tên',
                align: 'left',
                value: 'name',
            },
            { text: 'Người tải lên', value: 'user_upload' },
            { text: 'Cập nhật lần cuối', value: 'updated_at' },
            { text: 'Kích cỡ', value: 'size' },
        ],
        desserts: [
            {
                name: 'Frozen Yogurthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
                user_upload: 159,
                updated_at: 6.0,
                size: 24,
            },
            {
                name: 'Ice cream sandwich',
                user_upload: 237,
                updated_at: 9.0,
                size: 37,
            },
            {
                name: 'Eclair',
                user_upload: 262,
                updated_at: 16.0,
                size: 23,
            },
            {
                name: 'Cupcake',
                user_upload: 305,
                updated_at: 3.7,
                size: 67,
            },
            {
                name: 'Gingerbread',
                user_upload: 356,
                updated_at: 16.0,
                size: 49,
            },
            {
                name: 'Jelly bean',
                user_upload: 375,
                updated_at: 0.0,
                size: 94,
            },
            {
                name: 'Lollipop',
                user_upload: 392,
                updated_at: 0.2,
                size: 98,
            },
            {
                name: 'Honeycomb',
                user_upload: 408,
                updated_at: 3.2,
                size: 87,
            },
            {
                name: 'Donut',
                user_upload: 452,
                updated_at: 25.0,
                size: 51,
            },
            {
                name: 'KitKat',
                user_upload: 518,
                updated_at: 26.0,
                size: 65,
            },
            {
                name: 'KitKat3',
                user_upload: 518,
                updated_at: 26.0,
                size: 65,
            },
        ],
    }),

    mounted() {
        this.$store.commit('setSelectedTrash', {
            selectedCount: null
        })
    },

    computed: {
        ...mapState ([
            'viewFile',
        ])
    },

    methods: {
        abc() {
            console.log('test')
        }
    }
  }
</script>