<template>
    <div style="background-color: white">
        <AppBar />
        <v-divider></v-divider>
        <v-content>
            <v-container>
            <v-row>
                <v-col cols="12" md="8">
                <v-img 
                    src="/images/storage-file.jpg"
                    max-width="500"
                    max-height="500"
                >
                </v-img>
                </v-col>
                <v-col cols="12" md="4" align-self="center">
                <router-view />
                </v-col>
            </v-row>
            </v-container>
        </v-content>
        <v-divider></v-divider>
        <Footer />
    </div>
</template>

<script>
import AppBar from '../components/landing-page/layouts/appbar'
import Footer from '../components/landing-page/layouts/footer'
export default {
  components: {
    AppBar, Footer
  },
};
</script>
