<template>
    <v-dialog v-model="dialog1" width="400" scrollable persistent>
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
                    @click="dialog1 = false, selection = []"
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