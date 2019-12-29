<template>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-toolbar color="white" flat class="d-flex justify-center">
        <v-toolbar-title>Đăng nhập hệ thống</v-toolbar-title>
      </v-toolbar>
      <v-text-field  
        name="email" label="Email" required
        v-model="email"
        autocomplete="off"
        outlined
        @keypress.enter="formSubmit()"
        :rules="emailRules"
        dense
      ></v-text-field>
      <v-text-field id="password"
        name="password" label="Mật khẩu" type="password" required
        v-model="password"
        autocomplete="off"
        outlined
        @keypress.enter="formSubmit()"
        :rules="passwordRules"
        dense
      ></v-text-field>
      <v-btn color="primary" width="100%" depressed :disabled="!valid" @click.stop="login()">Đăng nhập</v-btn>
      <span class="caption">Chưa có tài khoản ? <router-link :to="'register'">Đăng kí ngay</router-link></span>
    </v-form>
</template>

<script>
  import Axios from 'axios'
  export default {
    data: () => ({
        email: null,
        password: null,
        valid: true,
        emailRules: [
          v => !!v || 'Mời bạn nhập email',
        ],
        passwordRules: [
          v => !!v || 'Mời bạn nhập mật khẩu',
        ],
    }),

    methods: {
      async login() {
        if(this.$refs.form.validate()) {
          this.valid = false
          try {
            let response = await Axios.post('http://localhost:3000/login', {
              email: this.email,
              password: this.password
            })
            localStorage.setItem('jwt_token', response.data.body.token)
            localStorage.setItem('bucket', response.data.body.bucket)
            this.$router.go('/')
          } catch(e) {
            this.$store.commit('setNoti', {
              typeNoti: 0,
              textNoti: 'Đăng nhập thất bại !',
              showNoti: true
            })
          } finally {
            this.valid =  true
          }
        }
      },

      formSubmit() {
        this.login()
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