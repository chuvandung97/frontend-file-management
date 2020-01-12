<template>
    <v-card flat>
        <v-card-title>
            Danh sách thành viên trong nhóm 
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Tìm kiếm"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="6" xs="6" sm="4" md="4"  lg="3" xl="2" v-for="item in list" :key="item.email">
                    <v-card
                        class="mx-auto pa-2"
                        height="150"
                        style="position: relative"
                    >
                        <v-row>
                            <v-col cols="12" class="d-flex align-center">
                                <v-avatar>
                                    <v-img src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
                                </v-avatar>
                                <v-chip style="position: absolute; right: 10px" :color="getColor(item.active)" dark>{{ item.active == true ? 'Hoạt động' : 'Không hoạt động' }}</v-chip>
                            </v-col>
                            <v-col class="pa-0">
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title class="title">{{item.name}}</v-list-item-title>
                                        <v-list-item-subtitle class="caption">{{item.rolegroup.name}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import Axios from 'axios'
export default {
    data() {
        return {
            desserts: [],
            search: '',
            headers: [
                {
                    text: 'Họ tên',
                    align: 'left',
                    value: 'name',
                },
                { text: 'Vai trò', value: 'role.code' },
                { text: 'Trạng thái', align: 'center', value: 'active' },
            ],
            list: []
        }
    },

    async mounted() {
        this.getUser()
    },

    watch: {
        search: function(val) {
            if(val) {
                this.list = this.desserts.filter(el => el.name.toLowerCase().includes(val))
            } else {
                this.list = this.desserts
            }    
        }
    },

    methods: {
        async getUser() {
            try {
                let res = await Axios.get('http://localhost:3000/users/lists/storage', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }, 
                    params: {
                        storage_name: localStorage.getItem('bucket')
                    }
                })  
                this.desserts = res.data.body.user_list
                this.list = this.desserts
            } catch (error) {
                console.log(error)
            }
        },

        getColor(active) {
            if(active) return 'green'
            else return 'gray'
        },
    }
}
</script>