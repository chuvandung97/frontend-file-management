<template>
    <v-form ref="form" v-model="valid" lazy-validation >
      <v-toolbar color="white" flat class="d-flex justify-center">
        <v-toolbar-title>Đăng kí thành viên</v-toolbar-title>
      </v-toolbar>
      <v-text-field  
        name="name" label="Tên" required
        v-model="name"
        autocomplete="off"
        outlined
        dense
        @keypress.enter="formSubmit()"
        :rules="nameRules"
      ></v-text-field>
      <v-text-field  
        name="email" label="Email" required
        v-model="email"
        autocomplete="off"
        outlined
        dense
        @keypress.enter="formSubmit()"
        :rules="emailRules"
      ></v-text-field>
      <v-text-field id="password"
        name="password" label="Mật khẩu" required
        :type="showPass ? 'text' : 'password'"
        v-model="password"
        autocomplete="off"
        @keypress.enter="formSubmit()"
        :rules="passwordRules"
        outlined
        dense
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPass = !showPass"
      ></v-text-field>
      <v-btn color="primary" width="100%" depressed :disabled="!valid" @click.stop="signup()">Đăng kí</v-btn>
      <span class="caption">Đã có tài khoản ? <router-link :to="'login'">Đăng nhập ngay</router-link></span>
    </v-form>            
</template>

<script>
  import axios from 'axios'
  export default {
    components: {
      
    },
    data: () => ({
        name: null,
        email: null,
        password: null,
        valid: true,
        showPass: false,
        typeNoti: null,
        textNoti: null,
        showNoti: false,
        nameRules: [
          v => !!v || 'Mời bạn nhập tên',
          v => (v && v.length <= 10) || 'Tên phải ít hơn 10 kí tự',
        ],
        emailRules: [
          v => !!v || 'Mời bạn nhập email',
          v => /.+@.+\..+/.test(v) || 'Email không hợp lệ',
        ],
        passwordRules: [
          v => !!v || 'Mời bạn nhập mật khẩu',
          v => (v && v.length >=8) || 'Mật khẩu phải có ít nhất 8 kí tự',
        ],
    }),

    methods: {
        async signup() {
          if(this.$refs.form.validate()) {
            try {
              this.valid = false
              let response = await axios.post('http://localhost:3000/register', {
                name: this.name,
                email: this.email,
                password: this.password
              })
              if(response) {
                this.$store.commit('setNoti', {
                  typeNoti: 1,
                  textNoti: "Đăng kí thành công !",
                  showNoti: true
                })
                this.$router.go('/')
              }
            } catch(e) { 
              this.$store.commit('setNoti', {
                typeNoti: 0,
                textNoti: "Email đã được sử dụng !",
                showNoti: true
              })
            } finally {
              this.valid =  true
            }
          }
        },

        formSubmit() {
          this.signup()
        }
     }
  }
</script>

<style scoped>
  a {
      text-decoration:none;
  }
  a:hover {
    text-decoration:underline;
  }
</style>