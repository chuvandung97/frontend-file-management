<template>
    <v-dialog v-model="dialog3" width="600" scrollable>
        <v-card>
            <v-card-title
                class="headline primary white--text"
                primary-title
            >
                Quản lý phiên bản
                <v-spacer></v-spacer>
                <v-btn depressed text icon>
                    <v-icon color="white" @click="dialog3 = false">mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text style="height: 600px;">
                <v-expansion-panels
                    multiple
                    focusable
                    class="mt-3" 
                >
                    <v-expansion-panel
                        v-for="(item,i) in fileHistories"
                        :key="i"
                    >
                        <v-expansion-panel-header class="pa-1" disable-icon-rotate>
                            <v-icon class="mr-2" style="flex: 0" :color="item.filetypedetail.color">{{item.filetypedetail.icon}}</v-icon>
                            {{ item.name }}<v-subheader>Phiên bản {{fileHistories.length - i}}</v-subheader>
                            <template v-slot:actions>
                                <v-btn text icon depressed @click.stop="downloadFile(item.name)"><v-icon color="teal">mdi-download</v-icon></v-btn>
                            </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-subheader>Kích cỡ: {{item.size | formatSize}}</v-subheader>
                            <v-subheader class="mt-n3">Được tải lên bởi: {{item.updated_by == userId ? 'tôi' : item.User.name}} vào lúc {{item.updatedAt | formatTime}} ngày {{item.updatedAt | formatDate}}</v-subheader>
                            <v-divider></v-divider>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
            <v-card-actions class="mr-4">
                <v-spacer></v-spacer>
                <v-btn
                    @click="dialog3 = false"
                    class="text-none"
                    depressed
                    color="primary"
                >Đóng</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>