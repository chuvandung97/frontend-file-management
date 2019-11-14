<template>
  <div>
    <AppBar />
    <HelloWorld />
  </div>
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
