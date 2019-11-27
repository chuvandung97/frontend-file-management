<template>
  <div>
    <AppBarNavigationDrawer />
    <v-content>
      <router-view></router-view>
    </v-content>
    <!-- <v-btn
      bottom
      color="pink"
      dark
      fab
      fixed
      right
      @click="dialog = !dialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn> -->
  </div>
</template>

<script>
import AppBarNavigationDrawer from '../components/home/layouts/AppBarNavigationDrawer';
export default {
  components: {
    AppBarNavigationDrawer
  },
};
</script>