<template>
    <div>
        <NavigationDrawer />
        <Hello />
    </div>
</template>

<script>
import NavigationDrawer from '../components/home/layouts/navigation-drawer.vue';
import Hello from '../components/home/HelloWorld'
export default {
  components: {
    NavigationDrawer,
    Hello
  },
};
</script>