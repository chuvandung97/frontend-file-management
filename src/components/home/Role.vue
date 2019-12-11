<template>
  <v-card flat>
    <v-card-title>
      Danh sách quyền hệ thống
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
      item-key="code"
      :show-select=true
      :footer-props="{
        itemsPerPageText: 'Hiển thị',
      }"
    >
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
                  <v-form ref="form">
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field 
                          v-model="editedItem.code" 
                          label="Mã" 
                          required 
                          :counter="10" 
                          :rules="codeRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field 
                          v-model="editedItem.name" 
                          label="Tên" 
                          required 
                          :counter="30" 
                          :rules="nameRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <v-textarea
                          v-model="editedItem.description" 
                          label="Mô tả"
                          counter
                        ></v-textarea>
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
              @click="deleteRole()"
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
      <!-- <v-icon
        small
        @click="deleteItem(item)"
      >
        delete
      </v-icon> -->
    </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Axios from 'axios'
  export default {
    data () {
      return {
        dialog: false,
        editedIndex: -1,
        editedItem: {
          code: '',
          name: '',
          description: '',
        },
        defaultItem: {
          code: '',
          name: '',
          description: '',
        },
        codeRules: [
          v => !!v || 'Mời bạn nhập mã',
          v => v.length <= 10 || 'Mã phải ít hơn 10 kí tự',
        ],
        nameRules: [
          v => !!v || 'Mời bạn nhập tên',
          v => v.length <= 30 || 'Tên phải ít hơn 30 kí tự',
        ],
        search: '',
        selected: [],
        headers: [
          { text: 'Mã', value: 'code'},
          {
            text: 'Tên',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          { text: 'Mô tả', value: 'description' },
          { text: 'Chỉnh sửa', value: 'edit', sortable: false, align: 'center' },
        ],
        desserts: [],
      }
    },

    mounted() {
      this.getRole()
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Thêm mới quyền hệ thống' : 'Sửa thông tin quyền hệ thống'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    methods: {
      async getRole() {
        this.useremail = localStorage.getItem('useremail')
        try {
          let res = await Axios.get('http://localhost:3000/roles/lists', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
          })  
          this.desserts = res.data.body.role_list
        } catch (error) {
          console.log(error)
        }
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
              let res = await Axios.post('http://localhost:3000/roles/update/' + this.editedItem.id, {
                code: this.editedItem.code,
                name: this.editedItem.name,
                description: this.editedItem.description
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
              this.getRole()
            }
          } else {
            try {
              let res = await Axios.post('http://localhost:3000/roles/add', {
                code: this.editedItem.code,
                name: this.editedItem.name,
                description: this.editedItem.description
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
              this.getRole()
            }
          }
          this.$refs.form.resetValidation()
          this.close()
        }
      },

      async deleteRole() {
        let roleIds = this.selected.map((currentElArray) => {
          return currentElArray.id
        })
        try {
          let res = await Axios.delete('http://localhost:3000/roles/delete', {
            params: {
              roleIds: roleIds
            }
          })
          this.$store.commit('setNoti', {
            typeNoti: 1,
            textNoti: res.data.message + res.data.count + ' vai trò !',
            showNoti: true
          })
        } catch (e) {
          this.$store.commit('setNoti', {
            typeNoti: 0,
            textNoti: 'Xóa thất bại !',
            showNoti: true
          })
        } finally {
          this.getRole()
          this.selected = []
        }
      }
    }
  }
</script>
