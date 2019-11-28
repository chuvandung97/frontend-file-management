<template>
  <v-card flat>
    <v-card-title>
      Danh sách nhóm
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
      :show-select=true
    >
      <template v-slot:item.member_count="{ item }">
        {{item.storage != null ? item.storage.Users.length : 0}}
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <!-- <v-btn color="primary" dark class="mb-2" :to="{ name: 'group.add' }">Thêm mới<v-icon>add</v-icon></v-btn> -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Thêm mới</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Thêm mới nhóm</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" lazy-validation v-model="valid">
                    <v-row>
                      <v-text-field 
                          v-model="name" 
                          label="Tên" 
                          required 
                          :counter="30" 
                          :rules="nameRules"
                        ></v-text-field>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-btn color="blue darken-1" text @click="close">Đóng</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="save">Lưu</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-btn 
              depressed 
              text 
              icon
              v-if="selected.length > 0"
              @click="deleteGroup()"
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
        <v-btn text icon :to="{ name: 'group.update', params: {groupId: item.id}, query: {name: item.name, description: item.description}}">
          <v-icon small>edit</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Axios from 'axios'
  export default {
    data () {
      return {
        name: null,
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
          { text: 'Số thành viên', align: 'center', value: 'member_count' },
          { text: 'Người tạo', align: 'center', value: 'user_created' },
          { text: 'Ngày tạo', align: 'center', value: 'created_at' },
          { text: 'Chỉnh sửa', align: 'center', value: 'edit', sortable: false },
        ],
        desserts: [],
        nameRules: [
          v => !!v || 'Mời bạn nhập tên',
          v => (v && v.length <= 30) || 'Tên phải nhỏ hơn 30 kí tự',
        ],
      }
    },

    mounted() {
      this.getGroup()
    },

    methods: {
      async getGroup() {
        this.useremail = localStorage.getItem('useremail')
        try {
          let res = await Axios.get('http://localhost:3000/groups/lists', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
          })  
          this.desserts = res.data.body.group_list
        } catch (error) {
          console.log(error)
        }
      },

      close () {
        this.$refs.form.resetValidation()
        this.dialog = false
      },

      async save () {
        if(this.$refs.form.validate()) {
          try {
            let res = await Axios.post('http://localhost:3000/groups/add', {
              name: this.name
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
            this.getGroup()
            this.$refs.form.resetValidation()
            this.close()
          }
        }
      },

      async deleteGroup() {
        let groupIds = this.selected.map((currentElArray) => {
          return currentElArray.id
        })
        try {
          let res = await Axios.delete('http://localhost:3000/groups/delete', {
            params: {
              groupIds: groupIds
            }
          })
          this.$store.commit('setNoti', {
            typeNoti: 1,
            textNoti: res.data.message + res.data.count + ' nhóm !',
            showNoti: true
          })
        } catch (e) {
          this.$store.commit('setNoti', {
            typeNoti: 0,
            textNoti: 'Xóa thất bại !',
            showNoti: true
          })
        } finally {
          this.getGroup()
          this.selected = []
        }
      }
    }
  }
</script>
