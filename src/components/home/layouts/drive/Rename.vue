<template>
    <v-dialog v-model="showRename" width="400" persistent>
        <v-card>
            <v-card-title
                class="headline primary white--text"
                primary-title
            >
                Đổi tên thư mục
            </v-card-title>

            <v-card-text>
                <v-text-field
                    v-model="name"
                    label="Tên"
                    required
                    class="mt-3"
                    :rules="[v => !!v || 'Mời bạn nhập tên']"
                    @keypress.enter="formSubmit()"
                    autofocus
                >
                </v-text-field>
            </v-card-text>
            <v-card-actions class="mt-n6 mr-4">
                <v-spacer></v-spacer>
                <v-btn
                    @click="closeRename()"
                    class="text-none"
                    depressed
                    text
                    color="primary"
                    outlined
                >Hủy</v-btn>
                <v-btn
                    color="primary"
                    @click="updateName()"
                    class="text-none"
                    depressed
                    :disabled="name == '' ? true : false"
                >Lưu</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Axios from 'axios'
export default {
    props: {
        'showRename': {default: false, type: Boolean},
        'detailItem': {type: Object},
        'userId': {type: String}
    },
    data: () => ({
        name: null
    }),

    watch: {
        detailItem: function(val) {
            this.name = val.name
        }
    },

    methods: {
        async updateName() {
            let detailItem = this.$props.detailItem
            if(this.name === detailItem.name) {
                this.$emit('closeRename', false)
                this.$store.commit('setRename', false)
            } else { 
                try {
                    var url = ''
                    if(detailItem.filetypedetail === undefined) {
                        url = 'http://localhost:3000/folders/update/'
                    } else {
                        url = 'http://localhost:3000/files/update/'
                    }
                    let res = await Axios.post(url + detailItem.id, {
                        name: this.name,
                        user_id: this.$props.userId
                    })
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message,
                        showNoti: true
                    })
                } catch (error) {
                    console.log(error)
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Đổi tên thất bại',
                        showNoti: true
                    })
                } finally {
                    this.$emit('closeRename', false)
                    this.$store.commit('setReloadIndexDrive', true)
                    this.$store.commit('setRename', false)
                }
            }
        },

        closeRename() {
            this.$emit('closeRename', false)
            this.$store.commit('setRename', false)
        }
    }
}
</script>