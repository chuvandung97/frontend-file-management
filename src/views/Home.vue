<template>
  <div>
    <AppBarNavigationDrawer />
    <v-content>
      <router-view></router-view>
    </v-content>
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