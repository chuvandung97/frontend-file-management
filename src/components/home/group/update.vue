<template>
<div>
  <v-card flat>
    <v-card-title>
      Cập nhật thông tin nhóm
      <v-spacer></v-spacer>
      <!-- <v-text-field
        v-model="search"
        append-icon="search"
        label="Tìm kiếm"
        single-line
        hide-details
      ></v-text-field> -->
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
          <v-row>
              <v-col cols="12" sm="6" md="4">
                  <v-text-field 
                      v-model="name"
                      label="Tên" 
                      required 
                      :counter="20" 
                      :rules="[v => !!v || 'Mời bạn nhập tên']"
                  ></v-text-field>
              </v-col>
              <v-col cols="12" sm="0" md="1">
              </v-col>
              <v-col cols="12" sm="6" md="7">
                  <v-textarea
                    v-model="description" 
                    label="Mô tả"
                    counter
                    auto-grow
                    clearable
                    dense
                  ></v-textarea>
              </v-col>
          </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn class="mb-2 ml-3" color="primary" exact depressed text outlined :to="{ name: 'group' }"><v-icon>mdi-arrow-left</v-icon>Quay lại</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" depressed class="mb-2" v-if="!memberList" @click="memberList = !memberList">Danh sách thành viên</v-btn>
      <v-btn color="primary" depressed class="mb-2" v-else @click="memberList = !memberList">Ẩn danh sách</v-btn>
      <v-btn color="primary" depressed class="mb-2" @click="updateGroup()">Cập nhật</v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-if="memberList" flat>
    <v-card-title>
      Danh sách thành viên
      <v-spacer></v-spacer>
      <v-col cols="6" sm="6" md="6">
        <v-autocomplete
          v-model="model"
          :items="items"
          :hide-selected="true"
          label="Thêm thành viên"
          multiple
          persistent-hint
          :small-chips="true"
          :clearable="true"
          deletable-chips
          item-text="name"
          return-object
          :rules="[v => !!v || 'Mời bạn chọn thành viên']"
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
      <v-btn class="mx-2" dark color="indigo" @click="addMemberToGroup()">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table 
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :search="search"
      item-key="name"
      :show-select=true
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <!-- <v-btn color="primary" dark class="mb-2" :to="{ name: 'group.add' }">Thêm mới<v-icon>add</v-icon></v-btn> -->
          <v-spacer></v-spacer>
          <v-btn 
              depressed 
              text 
              icon
              v-if="selected.length > 0"
              @click="removeUserfromGroup()"
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
      <template v-slot:item.role_group="{ item }">
        <v-btn-toggle color="red" dense mandatory borderless v-model="item.rolegroup.code" @change="updateRoleCode(item.rolegroup.code, item.id)">
          <v-btn class="text-none" :value="'READWRITE'">Đọc ghi</v-btn>
          <v-btn class="text-none" :value="'READ'">Đọc</v-btn>
        </v-btn-toggle>
      </template>
      <template v-slot:item.active="{ item }">
        <v-chip :color="getColor(item.active)" dark>{{ item.active == true ? 'Hoạt động' : 'Không hoạt động' }}</v-chip>
      </template>
    </v-data-table>
  </v-card>
</div>
</template>

<script>
import Axios from 'axios'
  export default {
    data () {
      return {
        name: null,
        description: null,
        items: [],
        model: null,
        searchAddMember: null,
        memberList: false,
        noData: true,
        dialog: false,
        search: '',
        selected: [],
        headers: [
          {
            text: 'Họ tên',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          { text: 'Email', value: 'email' },
          { text: 'Vai trò trong nhóm', sortable: false, align: 'center', value: 'role_group'},
          { text: 'Trạng thái', align: 'center', value: 'active' },
        ],
        desserts: [],
      }
    },

    mounted() {
      this.name = this.$route.query.name
      this.description = this.$route.query.description
      this.getUserCodeIsGroup()
      this.getMemberGroup()
    },

    methods: {
      getColor(active) {
        if(active) return 'green'
        else return 'gray'
      },

      async updateGroup() {
        if(this.$refs.form.validate()) {
          try {
            let res = await Axios.post('http://localhost:3000/groups/update/' + this.$route.params.groupId, {
              name: this.name,
              description: this.description
            }) 
            this.$store.commit('setNoti', {
              typeNoti: 1,
              textNoti: res.data.message,
              showNoti: true
            })
            this.$router.push('/user/group')
          } catch(e) {
            this.$store.commit('setNoti', {
              typeNoti: 0,
              textNoti: 'Cập nhật thất bại !',
              showNoti: true
            })
          }
        }
      },

      async getUserCodeIsGroup() {
        try {
          let res = await Axios.get('http://localhost:3000/users/lists/rolegroup')  
          this.items = res.data.body.user_list
        } catch (error) {
          console.log(error)
        }
      },

      async getMemberGroup() {
        try {
          let res = await Axios.get('http://localhost:3000/groups/list/id', {
            params: {
              groupId: this.$route.params.groupId
            }
          })  
          this.desserts = res.data.body.group.storage.Users
        } catch (error) {
          console.log(error)
        }
      },

      async addMemberToGroup() {
        let userIds = this.model.map((currentElArray) => {
          return currentElArray.id
        })
        try {
          let res = await Axios.post('http://localhost:3000/users/add/togroup', {
              userIds: userIds,
              groupId: this.$route.params.groupId
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
          this.model = null
          this.getMemberGroup()
          this.getUserCodeIsGroup()
        }
      },

      async removeUserfromGroup() {
        let userIds = this.selected.map((currentElArray) => {
          return currentElArray.id
        })
        try {
          let res = await Axios.post('http://localhost:3000/users/remove/fromgroup', {
              userIds: userIds
          })
          this.$store.commit('setNoti', {
            typeNoti: 1,
            textNoti: res.data.message + res.data.count + ' người dùng khỏi nhóm !',
            showNoti: true
          })
        } catch (e) {
          this.$store.commit('setNoti', {
            typeNoti: 0,
            textNoti: 'Xóa thất bại !',
            showNoti: true
          })
        } finally {
          this.getMemberGroup()
          this.getUserCodeIsGroup()
          this.selected = []
        }
      },

      async updateRoleCode(codeId, id) {
        try {
          await Axios.post('http://localhost:3000/users/update/rolegroup/' + id, {
            code: codeId
          }) 
        } catch (error) {
          this.$store.commit('setNoti', {
            typeNoti: 0,
            textNoti: 'Thất bại !',
            showNoti: true
          })
        }
      },
    }
  }
</script>
