<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-card flat class="mb-1">
        <v-card-title class="d-flex justify-center">
          <v-avatar >
            <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              class="mx-auto d-block"
            >
          </v-avatar>
        </v-card-title>
        <v-card-text class="text-center">
            <h5 class="category text-gray font-weight-bold">{{ roleDescription }}</h5>
            <h4 class="card-title font-weight-light">{{ name }}</h4>
        </v-card-text>
        <v-card-actions class="d-flex justify-center" v-if="roleDescription != 'Admin' && roleDescription != 'Sysadmin'">
          <v-menu
            bottom
            origin="center center"
            transition="scale-transition"
            close-on-content-click
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                dark
                rounded
                class="text-none px-12"
                v-on="on"
              >
                Tạo mới
              </v-btn>
            </template>

            <v-list min-width="250">
              <v-list-item @click="dialog = true">
                <v-list-item-icon><v-icon>create_new_folder</v-icon></v-list-item-icon>
                <v-list-item-title class="body-2 font-weight-medium ml-n3">Thư mục</v-list-item-title>
              </v-list-item>
              <v-list-item class="file-upload" @click="showUploadFile()">
                <v-list-item-icon><v-icon>cloud_upload</v-icon></v-list-item-icon>
                <v-list-item-title class="body-2 font-weight-medium ml-n3">Tải tệp lên</v-list-item-title>
                <input style="display: none" type="file" id="file" ref="file" accept=".doc,.docx,.xlsx,.xsl,.pptx,application/*,image/*, video/*, audio/*, font/*, text/*" v-on:change="handleFileUpload()"/>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-dialog v-model="dialog" width="400" persistent>
            <v-card>
              <v-card-title
                class="headline primary white--text"
                primary-title
              >
                Tạo mới thư mục
              </v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="name_folder"
                  label="Tên"
                  required
                  class="mt-3"
                  :rules="[v => !!v || 'Mời bạn nhập tên']"
                >
                </v-text-field>
              </v-card-text>
              <v-card-actions class="mt-n6 mr-4">
                <v-spacer></v-spacer>
                <v-btn
                  @click="cancelCreateFolder()"
                  class="text-none"
                  depressed
                  text
                  color="primary"
                  outlined
                >
                  Hủy
                </v-btn>
                <v-btn
                  color="primary"
                  @click="createFolder()"
                  class="text-none"
                  depressed
                  :disabled="name_folder == '' ? true : false"
                >
                  Tạo
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            v-if="item.heading"
            :key="item.heading"
            row
            align-center
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex
              xs6
              class="text-xs-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            :key="item.name"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else-if="item.active"
            :key="item.name"
            :to="item.router_link"
            color="primary"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider></v-divider>
        <v-list-item @click="logout()">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content >
            <v-list-item-title>
              Đăng xuất
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-3"
      >
        <span class="hidden-sm-and-down">Hệ thống quản lý file</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-menu
        min-width="150"
        bottom
        left
        content-class="dropdown-menu"
        offset-y
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            large
            v-on="on"
          >
            <v-avatar>
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list dense>
            <v-list-item to="/user/profile">
              <v-list-item-title><v-icon class="mr-4">person_outline</v-icon> Hồ sơ</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><v-icon class="mr-4">mdi-settings</v-icon> Cài đặt</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout()">
              <v-list-item-title ><v-icon class="mr-4">mdi-logout</v-icon> Đăng xuất</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import Axios from 'axios'
  export default {
    data () {
        return {
            drawer: null,
            items: [],
            roleDescription: null, 
            name: null,
            dialog: false,
            name_folder: 'Thư mục mới',
        }
    },

    mounted() {
      this.getMenu()
      this.name = localStorage.getItem('username')
      this.roleDescription = localStorage.getItem('userrole')
    },

    methods: {
      async getMenu() {
        try {
            let res = await Axios.get('http://localhost:3000/menus/lists/role', {
              params: {
                role: localStorage.getItem('userrole')
              }
            })  
            this.items = res.data.body.menu_list
        } catch (error) {
            console.log(error)
        }
      },

      async logout() {
        try {
          await Axios.post('http://localhost:3000/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
          })
          let storage = ['jwt_token', 'userid', 'username', 'useremail', 'userrole', 'bucket']
          storage.map((elCurrent) => {
            return localStorage.removeItem(elCurrent)
          })
          this.$router.push('/')
        } catch (error) {
          this.$store.commit('setNoti', {
              typeNoti: 0,
              textNoti: 'Đăng xuất thất bại !',
              showNoti: true
          })
        }
      },

      async handleFileUpload(){
        this.file = this.$refs.file.files[0];
        let formData = new FormData();
        formData.append('file', this.file);
        try {
          let res = await Axios.post('http://localhost:3000/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }, 
            params: {
              bucket_name: localStorage.getItem('bucket'),
              created_by: localStorage.getItem('userid'),
              folder_id: this.$route.params ? this.$route.params.folderId : null
            }
          })
          this.$store.commit('setNoti', {
              typeNoti: 1,
              textNoti: res.data.message,
              showNoti: true
          })
        } catch (error) {
          console.log(error)
          this.$store.commit('setNoti', {
              typeNoti: 0,
              textNoti: 'Tải file thất bại !',
              showNoti: true
          })
        } finally {
          this.$store.commit('setReloadIndexDrive', true)
        }
      },

      async downloadFile() {
        try {
          let res = await Axios.get('http://localhost:3000/files/download', {
            params: {
                bucket_name: localStorage.getItem('bucket'),
                name: 'Hệ thống quản lý tài liệu - Google Chrome 2019-10-28 21-51-05.mp4'
            }
          })
          window.location.href = res.data.body.url
        } catch (error) {
          console.log(error)
          this.$store.commit('setNoti', {
              typeNoti: 0,
              textNoti: 'Tải xuống thất bại !',
              showNoti: true
          })
        }
      },

      showUploadFile() {
        const btn_upload = document.getElementById('file')
        btn_upload.click()
      },

      cancelCreateFolder() {
        this.dialog = false,
        this.name_folder ="Thư mục mới"
      },

      async createFolder() {
        try {
          let res = await Axios.post('http://localhost:3000/folders/add', {
            parent_id: this.$route.params ? this.$route.params.folderId : null,
            name: this.name_folder,
            storage_id: localStorage.getItem('bucket'),
            created_by: localStorage.getItem('userid')
          })
          this.$store.commit('setNoti', {
              typeNoti: 1,
              textNoti: res.data.message,
              showNoti: true
          })
        } catch (error) {
          this.$store.commit('setNoti', {
              typeNoti: 0,
              textNoti: 'Tạo mới thư mục thất bại',
              showNoti: true
          })
        } finally {
          this.$store.commit('setReloadIndexDrive', true)
          this.dialog = false
          this.name_folder = "Thư mục mới"
        }
      }
    }
  }
</script>