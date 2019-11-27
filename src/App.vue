<template>
<v-app>
    <router-view/>
    <v-snackbar
      v-model="showNoti"
      top right
      :color="typeNoti == 0 ? 'error' : 'success'"
      :timeout="3000"
    >
      {{ textNoti }}
      <v-btn
        dark
        text
        @click="showNoti = false"
      >
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </v-snackbar>
</v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  components: {
    
  },
  data: () => ({
    
  }),

  computed: {
    showNoti: {
      get() {
        return this.$store.state.showNoti
      },
      set() {
        this.$store.commit('updateShowNoti', false)
      }
    },
    ...mapState ([
      'typeNoti', 'textNoti'
    ])
  }
};
</script>
