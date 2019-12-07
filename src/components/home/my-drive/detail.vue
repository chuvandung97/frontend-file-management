<template>
    <v-card flat>
        <v-row>
            <v-col cols="10" md="11" class="pa-0">
                <v-breadcrumbs :items="items" large>
                    <template v-slot:divider>
                        <v-icon>mdi-chevron-right</v-icon>
                    </template>
                </v-breadcrumbs>
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
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :items-per-page="999"
            sort-by="name"
            v-if="viewFile"
            :class="'view_list'"
            
        >
            <template v-slot:body=" { items } ">
                <tbody>
                    <tr v-for="item in items" :key="item.name" @dblclick="showDetailFolder(item)">
                        <td><v-icon class="mr-2">mdi-folder</v-icon> {{ item.name }}</td>
                        <td>{{ item.User.name }}</td>
                        <td>{{ item.updatedAt | formatDate }}</td>
                        <td></td>
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
                    <v-col v-for="dessert in desserts" cols="3" :key="dessert.name">
                        <v-card outlined class="pa-3" :to="'/user/drive'"  @contextmenu="abc">
                            <v-icon class="mr-2">mdi-folder</v-icon> {{ dessert.name }}    
                        </v-card>
                    </v-col>
                </v-row>
                <v-menu
                    v-model="show"
                    :position-x="x"
                    :position-y="y"
                    absolute
                    offset-y
                    transition="scale-transition"
                >
                    <v-list>
                        <v-list-item
                            v-for="(item, i) in itemsss"
                            :key="i"
                        >
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
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
    </v-card>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import Axios from 'axios'

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
})
export default {
    data: () => ({
        itemsss: [
            { title: 'Click Me' },
            { title: 'Click Me' },
            { title: 'Click Me' },
            { title: 'Click Me 2' },
        ],
        show: false,
        x: 0,
        y: 0,
        viewFile: true,
        items: [
            {
                text: 'Tất cả file',
                disabled: false,
                to: '/user/drive'
            },
            {
                text: 'Link 1',
                disabled: false,
                href: 'breadcrumbs_link_1',
            },
            {
                text: 'Link 2',
                disabled: true,
                href: 'breadcrumbs_link_2',
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
        showDetailFolder(item) {
            this.$router.push('/user/folder/' + item.id)
        },

        abc(e) {
            e.preventDefault();
            this.show = false;
            this.x = e.clientX;
            this.y = e.clientY;
            this.$nextTick(() => {
                this.show = true;
            });
        },

        async getFolderList() {
            try {
                let res = await Axios.get('http://localhost:3000/folders/lists/subfolder', {
                    params: {
                        storage_id: localStorage.getItem('bucket'),
                        parent_id: this.$route.params.folderId
                    }
                })
                this.desserts = res.data.body.folder_list
            } catch (error) {
                console.log(error)
            }
        }
    }
  }
</script>