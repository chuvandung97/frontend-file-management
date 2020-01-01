<template>
  <v-card flat>
    <v-card-title>
      Danh sách chức năng
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Tìm kiếm"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :search="search"
      item-key="name"
      :loading="isLoading"
      :show-select=true
      :footer-props="{
          itemsPerPageText: 'Hiển thị',
      }"
    >
      <template v-slot:progress>
          <Loading /> 
      </template>
      <template v-slot:no-data>
        Không có dữ liệu
      </template>
      <template v-slot:no-results>
        Không tìm thấy kết quả
      </template>
        <template v-slot:item.icon="{ item }">
            <v-icon class="ml-n5">{{item.icon}}</v-icon>
        </template>
        <template v-slot:item.active="{ item }">
            <v-chip :color="getColor(item.active)" dark>{{ item.active == true ? 'Hoạt động' : 'Không hoạt động' }}</v-chip>
        </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <!-- <v-btn color="primary" dark class="mb-2" :to="{ name: 'group.add' }">Thêm mới<v-icon>add</v-icon></v-btn> -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Thêm mới</v-btn>
            </template>
            <v-card>
              <v-card-title class="headline primary white--text" primary-title>
                <span class="headline">Thêm mới chức năng</span>
              </v-card-title>

              <v-card-text>
                  <v-form ref="form" lazy-validation v-model="valid">
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field 
                                v-model="editedItem.name" 
                                label="Tên" 
                                required 
                                :counter="30" 
                                :rules="nameRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-select
                                v-model="editedItem.parent"
                                :items="desserts"
                                label="Thuộc chức năng"
                                item-text="name"
                                required
                                clearable
                                return-object
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field 
                                v-model="editedItem.link" 
                                label="Đường dẫn" 
                                required 
                                :rules="linkRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field 
                                v-model="editedItem.icon" 
                                label="Biểu tượng" 
                                required 
                                :rules="iconRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field 
                                v-model="editedItem.order" 
                                type="number"
                                label="Thứ tự" 
                                required 
                                :rules="orderRules"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-checkbox v-model="editedItem.active"  label="Hoạt động"></v-checkbox>
                        </v-col>
                    </v-row>
                  </v-form>
              </v-card-text>

              <v-card-actions class="mt-n6 mr-4">
                <v-spacer></v-spacer>
                <v-btn 
                  color="blue darken-1" 
                  text 
                  @click="close"
                  class="text-none"
                  depressed
                  outlined
                  >Hủy</v-btn>
                <v-btn color="primary" depressed class="text-none" @click="save">Lưu</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-btn 
              depressed 
              text 
              icon
              v-if="selected.length > 0"
              @click="deleteMenu()"
          >
              <v-badge
                color="primary"
                overlap
                class="align-self-center"
              >
                <template v-slot:badge>
                  <span>{{ selected.length }}</span>
                </template>
                <v-icon large>
                  delete
                </v-icon>
              </v-badge>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-btn text icon :to="{ name: 'menu.update', params: {menuId: item.id}}">
          <v-icon small>edit</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Axios from 'axios'
import Loading from '../../layouts/Loading'
  export default {
    components: {
      Loading
    },
    data () {
        return {
            defaultItem: {
                name: null,
                parent: null,
                link: null,
                icon: null,
                active: true,
                order: null,
            },
            editedItem: {
                name: null,
                parent: null,
                link: null,
                icon: null,
                active: true,
                order: null,
            },
            valid: true,
            dialog: false,
            search: '',
            selected: [],
            headers: [
            {
                text: 'Tên',
                align: 'left',
                value: 'name',
            },
            { text: 'Thuộc chức năng', align: 'center', value: 'parent' },
            { text: 'Biểu tượng', align: 'center', value: 'icon' },
            { text: 'Trạng thái', align: 'center', value: 'active' },
            { text: 'Chỉnh sửa', align: 'center', value: 'edit', sortable: false },
            ],
            desserts: [],
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
            isLoading: false
        }
    },

    mounted() {
        this.getMenu()
    },

    methods: {
        async getMenu() {
            try {
                this.isLoading = true
                let res = await Axios.get('http://localhost:3000/menus/lists')  
                this.desserts = res.data.body.menu_list
            } catch (error) {
                console.log(error) 
            } finally {
              this.isLoading = false
            }
        },

        close () {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.$refs.form.resetValidation()
            }, 300)
        },

        async save () {
            if(this.$refs.form.validate()) {
                try {
                    let res = await Axios.post('http://localhost:3000/menus/add', {
                        name: this.editedItem.name,
                        router_link: this.editedItem.link,
                        icon: this.editedItem.icon,
                        order: this.editedItem.order,
                        parent_id: this.editedItem.parent ? this.editedItem.parent.id : null,
                        active: this.editedItem.active
                    })
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message,
                        showNoti: true
                    })
                } catch (error) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Thêm mới thất bại',
                        showNoti: true
                    })
                } finally {
                    this.getMenu()
                    this.$refs.form.resetValidation()
                    this.close()
                }
            }
        },

        async deleteMenu() {
            let menuIds = this.selected.map((currentElArray) => {
                return currentElArray.id
            })
            try {
                let res = await Axios.delete('http://localhost:3000/menus/delete', {
                    params: {
                        menuIds: menuIds
                    }
                })
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: res.data.message + res.data.count + ' chức năng !',
                    showNoti: true
                })
            } catch (e) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Xóa thất bại !',
                    showNoti: true
                })
            } finally {
                this.getMenu()
                this.selected = []
            }
        },

        getColor(active) {
            if(active) return 'green'
            else return 'gray'
        },
    }
  }
</script>
