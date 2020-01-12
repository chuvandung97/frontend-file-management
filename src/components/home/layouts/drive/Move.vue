<template>
    <v-dialog v-model="showMove" width="400" scrollable persistent>
        <v-card :loading="isLoading">
            <v-card-title
                class="headline primary white--text"
                primary-title
            >
                <div v-if="lists[0] ? !lists[0].parent : ''">Kho của tôi</div>
                <div v-else>
                    <v-btn @click="getFolderChild(lists[0].parent.parent_id)" text icon dark depressed>
                        <v-icon>mdi-keyboard-backspace</v-icon> 
                    </v-btn>{{lists[0] ? lists[0].parent.name.slice(14) : ''}}
                </div>
            </v-card-title>

            <!-- <v-card-text class="red--text mt-3" v-if="lists.length == 0" style="height: 150px;">
                Không có thư mục nào để di chuyển !
            </v-card-text> -->
            <v-card-text class="unselectable" style="height: 200px">
                
                <v-treeview
                    :active.sync="selection"
                    :items="lists"
                    transition
                    activatable
                    item-disabled="locked"
                    return-object
                    dense
                >
                    <template v-slot:prepend=" { items, active } ">
                        <v-icon style="margin-left: -90px">mdi_folder</v-icon>
                    </template>
                    <template v-slot:label="{ item }">
                        {{item.name.length > 14 ? item.name.slice(14) : item.name }}
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
                    :disabled="isDisabled"
                >{{selection.length > 0 ? 'Di chuyển' : 'Di chuyển đến đây'}}</v-btn>
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
        selection: [],
        lists: [],
        isLoading: false,
        isDisabled: true,
    }),

    watch: {
        showMove: function(val) {
            let folderId = this.$route.params.folderId
            if(val && !folderId) {
                this.lists = this.$props.folderLists
            } else if(val) {
                this.getFolderChild(folderId)
            }
            else {
                this.lists = []
            }
        },
        selection: function(val) {
            if(val.length > 0 && val[0].id != this.$props.detailItem.id) {
                this.isDisabled = false
            } else if(val.length > 0 && val[0].id == this.$props.detailItem.id) {
                this.isDisabled = true
            }
        },
        lists: function(val) {
            let detailItem = this.$props.detailItem
            if(this.selection.length != 0 || this.lists.length > 0 && this.lists[0].parent && this.$route.params.folderId != this.lists[0].parent.id || val.length > 0 && detailItem.filetypedetail && detailItem.folders.length > 0 && detailItem.folders[0].id != val[0].parent_id 
            || val.length > 0 && !detailItem.filetypedetail && detailItem.parent_id && detailItem.parent_id != val[0].parent_id) {
                this.isDisabled = false
            }
        }
    },

    methods: {
        async moveFolderOrFile() {
            try {
                if(this.detailItem.filetypedetail === undefined) {
                    let res = await Axios.post('http://localhost:3000/folders/move/' + this.detailItem.id, {
                        folderId: this.selection.length > 0 ? this.selection[0].id : this.lists[0].parent_id,
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
                        newFolderId: this.selection.length > 0 ? this.selection[0].id : this.lists[0].parent_id,
                        user_id: localStorage.getItem('userid')
                    })
                    this.$store.commit('setNoti', {
                        typeNoti: 1,
                        textNoti: res.data.message,
                        showNoti: true
                    }) 
                }
            } catch (error) {
                console.log(error)
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Di chuyển thất bại',
                    showNoti: true
                })
            } finally {
                this.isDisabled = true
                this.$emit('closeMove', false)
                this.$store.commit('setReloadIndexDrive', true)
                this.$store.commit('setMove', false)
            }
        },

        async getFolderChild(id) {
            try {
                this.isLoading = true
                let res = await Axios.get('http://localhost:3000/folders/lists/subfolder', {
                    params: {
                        folder_id: id,
                        active: 1
                    }
                })
                this.lists = res.data.body.folder_list
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
                this.selection = []
            }
              
        },

        closeMove() {
            this.isDisabled = true
            this.$emit('closeMove', false)
            this.selection = []
            this.$store.commit('setMove', false)
        }
    }
}
</script>