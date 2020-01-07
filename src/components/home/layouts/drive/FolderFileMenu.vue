<template>
    <v-menu
        v-model="show"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
        transition="scale-transition"
    >
        <v-list width="300">
            <v-list-item @click="showDetailView = true">
                <v-list-item-action>
                    <v-icon>mdi-eye</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item @click="dialog = true, overlay = true" :disabled="rolegroup == 'READ' ? true : false">
                <v-list-item-action>
                    <v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-pencil</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Đổi tên</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item @click="dialog1 = true" :disabled="rolegroup == 'READ' ? true : false">
                <v-list-item-action>
                    <v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-folder-move</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Di chuyển</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item :disabled="rolegroup == 'READ' ? true : false">
                <v-list-item-action>
                    <v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-share</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Chia sẻ</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="detailItem.filehistories && detailItem.filehistories.length != 0" @click="dialog3 = true">
                <v-list-item-action>
                    <v-icon>mdi-history</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Quản lý phiên bản</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="file-upload" @click="showUploadFile()" :disabled="detailItem.filetypedetail && rolegroup != 'READ' ? false : true"> 
                <v-list-item-action>
                    <v-icon :disabled="detailItem.filetypedetail && rolegroup != 'READ' ? false : true">mdi-upload</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Tải lên bản thay thế</v-list-item-title>
                </v-list-item-content>
                <input style="display: none" type="file" id="file" name="file" ref="file" :accept="typeList" v-on:change="replaceFileUpload()"/>
            </v-list-item>
            <v-list-item @click.prevent="downloadFile()">
                <v-list-item-action>
                    <v-icon>mdi-download</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Tải xuống</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="removeToTrash()" :disabled="rolegroup == 'READ' ? true : false">
                <v-list-item-action>
                    <v-icon :disabled="rolegroup == 'READ' ? true : false">mdi-delete</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Xóa</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    data: () => ({
        show: false,
    })
}
</script>