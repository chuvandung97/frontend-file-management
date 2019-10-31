<template>
  <v-app>
      <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/"><span class="font-weight-light">File Management System</span></router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text>
        <router-link to="login">Login</router-link>
      </v-btn>
      <v-btn text>
        <router-link to="register">Register</router-link>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
    
  },
  data: () => ({
    //
  }),
};
</script>
