<template>
  <v-app>
    <v-content>
      <AppBar />
      <HelloWorld />
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from '../components/landing-page/HelloWorld.vue';
import AppBar from '../components/landing-page/layouts/app-bar.vue'

export default {
  components: {
    HelloWorld,
    AppBar
  },
};
</script>
