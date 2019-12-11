<template>
<div>
  <v-card flat min-height="590">
    <v-card-title>
      Cập nhật thông tin chức năng
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
        <v-row>
            <v-col cols="12" xs="12" md="6">
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="6" md="8">
                            <v-text-field 
                                v-model="name"
                                label="Tên" 
                                required 
                                :counter="30" 
                                :rules="nameRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select
                                v-model="parent"
                                :items="menus"
                                label="Thuộc chức năng"
                                item-text="name"
                                required
                                clearable
                                return-object
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field 
                                v-model="link"
                                label="Đường dẫn" 
                                required 
                                :rules="linkRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field 
                                v-model="icon"
                                label="Biểu tượng" 
                                required 
                                :rules="iconRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field 
                                v-model="order"
                                type="number"
                                label="Thứ tự" 
                                required 
                                :rules="orderRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-switch
                                v-model="active"
                                label="Hoạt động"
                                color="primary"
                            ></v-switch>
                        </v-col>
                    </v-row>
                </v-form>
                <v-card-actions>
                    <v-btn class="mb-2 ml-n2" color="primary" depressed text outlined :to="{ name: 'menu' }"><v-icon>mdi-arrow-left</v-icon>Quay lại</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" depressed dark class="mb-2" @click="updateMenu()">Cập nhật</v-btn>
                </v-card-actions>
            </v-col>
            <v-col cols="12" xs="12" md="2"></v-col>
            <v-col cols="12" xs="12" md="4">
                <v-row>
                    <v-col cols="12" sm="6" md="7">
                        <v-autocomplete
                            v-model="model"
                            :items="roles"
                            :hide-selected="true"
                            label="Chọn vai trò"
                            persistent-hint
                            :small-chips="true"
                            deletable-chips
                            item-text="code"
                            return-object
                        >
                            <template v-if="noData" v-slot:no-data>
                                <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                    Không có dữ liệu.
                                    </v-list-item-title>
                                </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="5">
                        <v-btn class="mx-2 mt-3" dark color="indigo" @click="addRoleToMenu()">
                            <v-icon dark>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-data-table
                    :headers="headers"
                    :items="desserts"
                    item-key="name"
                    hide-default-footer
                >
                    <template v-slot:item.delete="{ item }">
                        <v-btn
                            icon
                            text
                            depressed
                        >
                            <v-icon
                                small
                                @click="deleteItem(item)"
                            >
                                delete
                            </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-card-text>
  </v-card>
</div>
</template>

<script>
import Axios from 'axios'
  export default {
    data () {
        return {
            name: null,
            parent: null,
            link: null,
            icon: null,
            order: null,
            active: true,
            model: null,
            noData: true,
            menus: [],
            roles: [],
            desserts: [],
            menu: [],
            headers: [
                { text: 'Vai trò', align: 'left', value: 'code'},
                { text: 'Xóa', align: 'center', value: 'delete', sortable: false },
            ],
            nameRules: [
                v => !!v || 'Mời bạn nhập tên',
                v => (v && v.length <= 30) || 'Tên phải nhỏ hơn 30 kí tự',
            ],
            linkRules: [
                v => !!v || 'Mời bạn nhập đường dẫn',
            ],
            iconRules: [
                v => !!v || 'Mời bạn nhập biểu tượng',
            ],
            orderRules: [
                v => !!v || 'Mời bạn nhập thứ tự',
            ],
        }
    },

    mounted() {
        this.getMenu()
        this.getRole()
        this.getMenuInfo()
    },

    methods: {
        async updateMenu() {
            if(this.$refs.form.validate()) {
                try {
                    let res = await Axios.post('http://localhost:3000/menus/update/' + this.$route.params.menuId, {
                        name: this.name,
                        router_link: this.link,
                        icon: this.icon,
                        order: this.order,
                        parent_id: this.parent ? this.parent.id : null,
                        active: this.active
                    }) 
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message,
                        showNoti: true
                    })
                    this.$router.push('/user/menu')
                } catch(e) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Cập nhật thất bại !',
                        showNoti: true
                    })
                }
            }
        },

        async getMenu() {
            try {
                let res = await Axios.get('http://localhost:3000/menus/lists')  
                this.menus = res.data.body.menu_list
            } catch (error) {
                console.log(error)
            }
        },

        async getRole() {
            try {
                let res = await Axios.get('http://localhost:3000/roles/lists', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                })  
                this.roles = res.data.body.role_list
            } catch (error) {
                console.log(error)
            }
        },

        async getMenuInfo() {
            try {
                let res = await Axios.get('http://localhost:3000/menus/info', {
                    params: {
                        id: this.$route.params.menuId
                    }
                })  
                this.menu = res.data.body.menu_info
                this.name = this.menu.name
                this.link = this.menu.router_link
                this.icon = this.menu.icon
                this.parent = this.menu.parentMenu  
                this.order = this.menu.order
                this.active = this.menu.active 
                this.desserts = this.menu.roles
            } catch (error) {
                console.log(error)
            }
        },

        async addRoleToMenu() {
            try {
                await Axios.post('http://localhost:3000/menus/add/role', {
                    menu_id: this.$route.params.menuId,
                    role_id: this.model.id,
                }) 
                this.desserts.push(this.model)
            } catch(e) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Vai trò đã được chọn !',
                    showNoti: true
                })
            } finally {
                this.model = null
            }
        },

        async deleteItem(item) {
            try {
                let res = await Axios.delete('http://localhost:3000/menus/delete/role', {
                    params: {
                        menu_id: this.$route.params.menuId,
                        role_id: item.id,
                    }
                }) 
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: res.data.message,
                    showNoti: true
                })
                this.getMenuInfo()
            } catch(e) {
                console.log(e)
            }
        }
    }
  }
</script>
