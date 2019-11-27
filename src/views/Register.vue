<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Register to File Management</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation >
                  <v-text-field  
                    name="name" label="Name" required
                    v-model="name"
                    autocomplete="off"
                    :counter="10"
                    autofocus
                    @keypress.enter="formSubmit()"
                    :rules="nameRules"
                  ></v-text-field>
                  <v-text-field  
                    name="email" label="Email" required
                    v-model="email"
                    autocomplete="off"
                    @keypress.enter="formSubmit()"
                    :rules="emailRules"
                  ></v-text-field>
                  <v-text-field id="password"
                    name="password" label="Password" required
                    :type="showPass ? 'text' : 'password'"
                    v-model="password"
                    autocomplete="off"
                    @keypress.enter="formSubmit()"
                    :rules="passwordRules"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPass = !showPass"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!valid" @click.stop="signup()">Sign Up</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
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
                this.$router.push('login')
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