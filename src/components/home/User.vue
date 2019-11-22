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
    >
      <template v-slot:item.active="{ item }">
        <v-chip :color="getColor(item.active)" dark>{{ item.active }}</v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Thêm mới</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
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
                          :rules="passwordRules"
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
                          :rules="passwordRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-checkbox v-model="isAdmin" label="Admin"></v-checkbox>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-checkbox v-model="isActive"  label="Hoạt động"></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
            edit
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
            delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        valid: true,
        dialog: false,
        isAdmin: false,
        isActive: true,
        showPass: false,
        //showRePass: false,
        editedIndex: -1,
        editedItem: {
          name: '',
          email: '',
          password: '',
          repassword: '',
        },
        defaultItem: {
          name: '',
          email: '',
          password: '',
          repassword: '',
        },
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        emailRules: [
          v => !!v || 'Email is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >=8) || 'Password must be more than 8 characters',
        ],
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
          { text: 'Vai trò', value: 'role' },
          { text: 'Trạng thái', align: 'center', value: 'active' },
          { text: 'Actions', value: 'action', sortable: false },
        ],
        desserts: [
          {
            name: 'Admin',
            email: 'admin@gmail.com',
            role: 'ADMIN',
            active: 'Hoạt động'
          },
          {
            name: 'Tester',
            email: 'tester@gmail.com',
            role: 'GROUP',
            active: 'Hoạt động'
          },
          {
            name: 'Tester1',
            email: 'tester1@gmail.com',
            role: 'USER',
            active: 'Không hoạt động'
          },
        ],
      }
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
      getColor(active) {
        if(active == 'Hoạt động') return 'green'
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

      save () {
        if(this.$refs.form.validate()) {
          if (this.editedIndex > -1) {
            Object.assign(this.desserts[this.editedIndex], this.editedItem)
          } else {
            this.desserts.push(this.editedItem)
          }
          this.$refs.form.resetValidation()
          this.close()
        }
      },
    }
  }
</script>
