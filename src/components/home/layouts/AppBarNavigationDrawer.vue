<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
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
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
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
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else-if="item.role == role"
            :key="item.text"
            :to="item.link"
            color="primary"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
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
        v-if="role != 'admin'"
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
            role: null,
            items: [
                { icon: 'person', text: 'Người dùng', link: '/user/info', role: 'Admin'},
                { icon: 'history', text: 'Quyền hệ thống', link: '/user/role', role: 'Admin'},
                { icon: 'group', text: 'Nhóm', link: '/user/group', role: 'Admin'},
                { icon: 'folder_open', text: 'File của tôi', link: '/user/drive', role: 'User'},
                { icon: 'mdi-account-multiple', text: 'Được chia sẻ với tôi', link: '/user/share', role: 'User'},
                { icon: 'delete', text: 'Thùng rác', link: '/user/trash', role: 'User'},
            ],
        }
    },

    mounted() {
      this.role = localStorage.getItem('userrole')
    },

    methods: {
      async logout() {
        try {
          await Axios.post('http://localhost:3000/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
          })
          localStorage.removeItem('jwt_token')
          localStorage.removeItem('userid')
          localStorage.removeItem('username')
          localStorage.removeItem('useremail')
          localStorage.removeItem('userrole')
          this.$router.push('/')
        } catch (error) {
          this.$store.commit('setNoti', {
              typeNoti: 0,
              textNoti: 'Đăng xuất thất bại !',
              showNoti: true
          })
        }
      }
    }
  }
</script>