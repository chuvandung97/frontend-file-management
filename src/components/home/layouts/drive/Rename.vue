<template>
    <v-dialog v-model="dialog" width="400" persistent>
        <v-card>
            <v-card-title
                class="headline primary white--text"
                primary-title
            >
                Đổi tên thư mục
            </v-card-title>

            <v-card-text>
                <v-text-field
                    v-model="new_name"
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
                    @click="dialog = false, overlay = false, $store.commit('setRename', false)"
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
                    :disabled="new_name == '' ? true : false"
                >Lưu</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>