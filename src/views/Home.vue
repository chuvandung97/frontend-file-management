<template>
    <div>
        <AppBar />
        <NavigationDrawer />
        <v-content>
            <OptionBar />
            <v-divider></v-divider>
            <router-view :key="$route.fullPath"></router-view>
        </v-content>
    </div>
</template>

<script>
import AppBar from '../components/home/layouts/AppBar'
import NavigationDrawer from '../components/home/layouts/NavigationDrawer';
import OptionBar from '../components/home/layouts/OptionBar'
export default {
    components: {
        AppBar, NavigationDrawer, OptionBar
    },

    data: () => ({
        
    }),

    
};
</script>