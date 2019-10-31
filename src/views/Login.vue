<template>
  <v-app>
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
                <v-btn color="primary" :disabled="!valid" @click.stop="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
        email: null,
        password: null,
        valid: null
    })
  }
</script>