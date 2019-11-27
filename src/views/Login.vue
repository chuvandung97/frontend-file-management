<template>
  <div>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login to File Management</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation >
                  <v-text-field  
                    name="email" label="Email" required
                    v-model="email"
                    autocomplete="off"
                    autofocus
                    @keypress.enter="formSubmit()"
                    :rules="emailRules"
                  ></v-text-field>
                  <v-text-field id="password"
                    name="password" label="Password" type="password" required
                    v-model="password"
                    autocomplete="off"
                    @keypress.enter="formSubmit()"
                    :rules="passwordRules"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!valid" @click.stop="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      
    </v-content>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({
        email: null,
        password: null,
        valid: true,
        emailRules: [
          v => !!v || 'Email is required',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
        ],
    }),

    methods: {
      async login() {
        if(this.$refs.form.validate()) {
          this.valid = false
          try {
            let response = await axios.post('http://localhost:3000/login', {
              email: this.email,
              password: this.password
            })
            localStorage.setItem('jwt_token', response.data.body.token)
            this.$router.push('/')
          } catch(e) {
            this.$store.commit('setNoti', {
              typeNoti: 0,
              textNoti: e,
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