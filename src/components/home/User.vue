<template>
  <v-card flat>
    <v-card-title>
      Danh sách người dùng 
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
      item-key="email"
      :show-select=true
      :footer-props="{
        itemsPerPageText: 'Hiển thị',
      }"
    >
      <template v-slot:no-data>
        Không có dữ liệu
      </template>
      <template v-slot:no-results>
        Không tìm thấy kết quả
      </template>
      <template v-slot:item.active="{ item }">
        <v-chip :color="getColor(item.active)" dark>{{ item.active == true ? 'Hoạt động' : 'Không hoạt động' }}</v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Thêm mới</v-btn>
            </template>
            <v-card>
              <v-card-title class="headline primary white--text" primary-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                  <v-form ref="form" lazy-validation v-model="valid">
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field 
                          v-model="editedItem.name" 
                          label="Họ tên" 
                          required 
                          :counter="10" 
                          :rules="nameRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field 
                          v-model="editedItem.email" 
                          label="Email"
                          required
                          :rules="emailRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field 
                          :type="showPass ? 'text' : 'password'"
                          v-model="editedItem.password" 
                          label="Mật khẩu"
                          required
                          :rules="editedIndex == -1 ? passwordRules : []"
                          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="showPass = !showPass"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field 
                          :type="showPass ? 'text' : 'password'"
                          v-model="editedItem.repassword" 
                          label="Nhập lại mật khẩu"
                          required
                          :rules="editedIndex == -1 ? passwordRules : []"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="editedItem.role"
                          :items="roles"
                          :rules="[v => !!v || 'Mời bạn chọn vai trò']"
                          label="Vai trò"
                          item-text="code"
                          required
                          return-object
                        ></v-select>
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
                  color="primary" 
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
              @click="deleteUser()"
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
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
            edit
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Axios from 'axios'
  export default {
    data () {
      return {
        valid: true,
        dialog: false,
        showPass: false,
        //showRePass: false,
        editedIndex: -1,
        editedItem: {
          name: '',
          email: '',
          password: '',
          repassword: '',
          active: true,
          role: []
        },
        defaultItem: {
          name: '',
          email: '',
          password: '',
          repassword: '',
          active: true,
          role: []
        },
        nameRules: [
          v => !!v || 'Mời bạn nhập tên',
          v => (v && v.length <= 10) || 'Tên phải nhỏ hơn 10 kí tự',
        ],
        emailRules: [
          v => !!v || 'Mời bạn nhập email',
          v => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ',
        ],
        passwordRules: [
          v => !!v || 'Mời bạn nhập mật khẩu',
          v => (v && v.length >=8) || 'Mật khẩu phải chứa ít nhất 8 kí tự',
        ],
        search: '',
        selected: [],
        headers: [
          {
            text: 'Họ tên',
            align: 'left',
            value: 'name',
          },
          { text: 'Email', value: 'email' },
          { text: 'Vai trò', value: 'role.code' },
          { text: 'Trạng thái', align: 'center', value: 'active' },
          { text: 'Chỉnh sửa', value: 'edit', align: 'center', sortable: false },
        ],
        desserts: [],
        roles: [],
      }
    },
    
    async mounted() {
      this.getUser()
      this.getRole()
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Thêm mới người dùng' : 'Sửa thông tin người dùng'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    methods: {
      async getUser() {
        try {
          let res = await Axios.get('http://localhost:3000/users/lists', {
            headers: {
                
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
          })  
          this.desserts = res.data.body.user_list
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
          this.roles = res.data.body.role_list.filter(el => el.code != 'User' && el.code != 'Sysadmin')
        } catch (error) {
          console.log(error)
        }
      },

      getColor(active) {
        if(active) return 'green'
        else return 'gray'
      },

      editItem (item) {
        if(this.$refs.form != undefined) {
          this.$refs.form.resetValidation()
        }
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.$refs.form.resetValidation()
        }, 300)
      },

      async save () {
        if(this.$refs.form.validate()) {
          if (this.editedIndex > -1) {
            try {
              let res = await Axios.post('http://localhost:3000/users/update/' + this.editedItem.id, {
                name: this.editedItem.name,
                email: this.editedItem.email,
                password: this.editedItem.password,
                role_id: this.editedItem.role.id,
                active: this.editedItem.active
              }) 
              this.$store.commit('setNoti', {
                typeNoti: 1,
                textNoti: res.data.message,
                showNoti: true
              })
            } catch(e) {
              this.$store.commit('setNoti', {
                typeNoti: 0,
                textNoti: 'Cập nhật thất bại !',
                showNoti: true
              })
            } finally {
              this.getUser()
            }
          } else {
            try {
              let res = await Axios.post('http://localhost:3000/users/add', {
                name: this.editedItem.name,
                email: this.editedItem.email,
                password: this.editedItem.password,
                role_id: this.editedItem.role.id,
                role_code: this.editedItem.role.code,
                active: this.editedItem.active
              })
              this.$store.commit('setNoti', {
                typeNoti: 1,
                textNoti: res.data.message,
                showNoti: true
              })
            } catch(e) {
              this.$store.commit('setNoti', {
                typeNoti: 0,
                textNoti: 'Thêm mới thất bại !',
                showNoti: true
              })
            } finally {
              this.getUser()
            }
          }
          this.$refs.form.resetValidation()
          this.close()
        }
      },

      async deleteUser() {
        let userIds = this.selected.map((currentElArray) => {
          return currentElArray.id
        })
        try {
          let res = await Axios.delete('http://localhost:3000/users/delete', {
            params: {
              userIds: userIds
            }
          })
          this.$store.commit('setNoti', {
            typeNoti: 1,
            textNoti: res.data.message + res.data.count + ' người dùng !',
            showNoti: true
          })
        } catch (e) {
          this.$store.commit('setNoti', {
            typeNoti: 0,
            textNoti: 'Xóa thất bại !',
            showNoti: true
          })
        } finally {
          this.getUser()
          this.selected = []
        }
      }
    }
  }
</script>
