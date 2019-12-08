<template>
  <div>
    <AppBarNavigationDrawer />
    <v-content>
      <!-- <v-progress-linear
          :active="true"
          :indeterminate="true"
          color="blue"
      ></v-progress-linear> -->
      <router-view :key="$route.fullPath"></router-view>
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