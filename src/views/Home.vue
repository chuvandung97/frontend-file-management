<template>
    <div>
        <AppBarNavigationDrawer />
        <v-content>
            <OptionBar />
            <v-divider></v-divider>
            <router-view :key="$route.fullPath"></router-view>
        </v-content>
    </div>
</template>

<script>
import AppBarNavigationDrawer from '../components/home/layouts/AppBarNavigationDrawer';
import OptionBar from '../components/home/layouts/OptionBar'
export default {
    components: {
        AppBarNavigationDrawer, OptionBar
    },

    data: () => ({
        fullPath: null,
    }),

    mounted() {
        this.fullPath = this.$route.fullPath
    },
};
</script>