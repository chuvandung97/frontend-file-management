<template>
  <v-card flat>
    <v-card-title>
      Danh sách nhóm
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Tìm kiếm"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :search="search"
      item-key="name"
      :show-select=true
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-btn color="primary" dark class="mb-2" :to="{ name: 'group.add' }">Thêm mới<v-icon>add</v-icon></v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn text icon :to="{ name: 'group.update' }">
          <v-icon small>edit</v-icon>
        </v-btn>
        <v-btn text icon>
          <v-icon small>delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        search: '',
        selected: [],
        headers: [
          {
            text: 'Tên',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          { text: 'Số thành viên', align: 'center', value: 'member_count' },
          { text: 'Người tạo', align: 'center', value: 'user_created' },
          { text: 'Ngày tạo', align: 'center', value: 'created_at' },
          { text: 'Actions', align: 'center', value: 'action', sortable: false },
        ],
        desserts: [
          {
            name: 'Frozen Yogurt',
            member_count: 159,
            user_created: '',
            created_at: '',
          },
          {
            name: 'Ice cream sandwich',
            member_count: 237,
            user_created: '',
            created_at: '',
          },
          {
            name: 'Eclair',
            member_count: 262,
            user_created: '',
            created_at: '',
          },
        ],
      }
    },
  }
</script>
