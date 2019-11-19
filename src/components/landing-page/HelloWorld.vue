<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to File Management System
        </h1>
      </v-flex>
      <!-- <v-flex
        xs12
        mb-5
      >
        <h2 class="headline font-weight-bold mb-3">Ecosystem</h2>

        <v-layout justify-center>
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-layout>
      </v-flex> -->
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    
  }),
};
</script>
