<template>
  <v-app>
    <AppBarNavigationDrawer />
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-btn
      bottom
      color="pink"
      dark
      fab
      fixed
      right
      @click="dialog = !dialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import AppBarNavigationDrawer from '../components/home/layouts/AppBarNavigationDrawer';
export default {
  components: {
    AppBarNavigationDrawer
  },
};
</script>