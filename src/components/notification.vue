<template>
    <v-snackbar
      v-model="showNoti"
      :bottom="'bottom'"
      :color="typeNoti == 0 ? 'error' : 'success'"
      :right="'right'"
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
</template>

<script>
    export default {
        props: {
            textInput: { type: String },
            typeInput: { type: Number },
            showNotification: { type: Boolean }
        },
        data: () => {
            return {
                typeNoti: null,
                textNoti: null,
                showNoti: false
            }
        },

        watch: {
            textInput(value) {
                if(!(value === null)){
                    this.textNoti = value;
                }
            },
            typeInput(value){
                if(!(value === null)) {
                    this.typeNoti = value;
                }
            },
            showNotification(value) {
                if(!(value === null)) {
                    this.showNoti = value;
                    setTimeout(this.clearData, 3050);
                }
            }
        },

        methods: {
            clearData() {
                this.typeNoti = null
                this.textNoti = null
                this.showNoti = false
            }
        }
    }
</script>