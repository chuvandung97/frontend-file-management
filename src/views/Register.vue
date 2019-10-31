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
                    autofocus
                    @keypress.enter="formSubmit()"
                  ></v-text-field>
                  <v-text-field  
                    name="email" label="Email" required
                    v-model="email"
                    autocomplete="off"
                    @keypress.enter="formSubmit()"
                  ></v-text-field>
                  <v-text-field id="password"
                    name="password" label="Password" type="password" required
                    v-model="password"
                    autocomplete="off"
                    @keypress.enter="formSubmit()"
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
    data: () => ({
        name: null,
        email: null,
        password: null,
        valid: null
    }),

    methods: {
        signup() {
            axios.post('http://localhost:3000/register', {
              params: {
                name: this.name,
                email: this.email,
                password: this.password
              }
            })
            .then(() => {
              
            })
        }
     }
  }
</script>