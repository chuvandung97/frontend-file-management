<template>
    <v-dialog v-model="showMove" width="400" scrollable persistent>
        <v-card>
            <v-card-title
                class="headline primary white--text"
                primary-title
            >
                Di chuyển thư mục
            </v-card-title>

            <v-card-text class="red--text mt-3" v-if="folderLists.length == 0" style="height: 150px;">
                Không có thư mục nào để di chuyển !
            </v-card-text>
            <v-card-text class="unselectable" v-else style="height: 200px">
                <v-treeview
                    :active.sync="selection"
                    :items="folderLists"
                    transition
                    activatable
                    item-disabled="locked"
                    return-object
                    dense
                >
                    <template v-slot:prepend=" { items, active } ">
                        <v-icon style="margin-left: -90px">mdi_folder</v-icon>
                    </template>
                </v-treeview>
            </v-card-text>
            <v-card-actions class="mt-n6 mr-4">
                <v-spacer></v-spacer>
                <v-btn
                    @click="closeMove()"
                    class="text-none"
                    depressed
                    text
                    color="primary"
                    outlined
                >Hủy</v-btn>
                <v-btn
                    color="primary"
                    @click="moveFolderOrFile()"
                    class="text-none"
                    depressed
                    :disabled="selection.length == 0 ? true : false"
                >Di chuyển</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Axios from 'axios'
export default {
    props: {
        'showMove': {default: false, type: Boolean},
        'detailItem': {type: Object},
        'userId': {type: String},
        'folderLists': {type: Array}
    },

    data: () => ({
        selection: []
    }),

    methods: {
        async moveFolderOrFile() {
            if(this.detailItem.id == this.selection[0].id) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Không thể di chuyển đến chính mình',
                    showNoti: true
                })
            } else {
                try {
                    if(this.detailItem.filetypedetail === undefined) {
                        let res = await Axios.post('http://localhost:3000/folders/move/' + this.detailItem.id, {
                            folderId: this.selection[0].id,
                            user_id: localStorage.getItem('userid')
                        })
                        this.$store.commit('setNoti', {
                            typeNoti: 1,
                            textNoti: res.data.message,
                            showNoti: true
                        })
                    } else {
                        let res = await Axios.post('http://localhost:3000/files/move/' + this.detailItem.id, {
                            oldFolderId: this.$route.params ? this.$route.params.folderId : null,
                            newFolderId: this.selection[0].id,
                            user_id: localStorage.getItem('userid')
                        })
                        this.$store.commit('setNoti', {
                            typeNoti: 1,
                            textNoti: res.data.message,
                            showNoti: true
                        }) 
                    }
                } catch (error) {
                    this.$store.commit('setNoti', {
                        typeNoti: 0,
                        textNoti: 'Di chuyển thất bại',
                        showNoti: true
                    })
                } finally {
                    this.$emit('closeMovee', false)
                }
            }
        },

        closeMove() {
            this.$emit('closeMove', false)
            this.selection = []
            this.$store.commit('setMove', false)
        }
    }
}
</script>