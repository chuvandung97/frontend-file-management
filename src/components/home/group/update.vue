<template>
<div>
  <v-card flat>
    <v-card-title>
      Cập nhật thông tin nhóm
      <v-spacer></v-spacer>
      <!-- <v-text-field
        v-model="search"
        append-icon="search"
        label="Tìm kiếm"
        single-line
        hide-details
      ></v-text-field> -->
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
          <v-row>
              <v-col cols="12" sm="6" md="4">
                  <v-text-field 
                      label="Tên" 
                      required 
                      :counter="20" 
                  ></v-text-field>
              </v-col>
          </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn class="mb-2 ml-3" :to="{ name: 'group' }"><v-icon>mdi-arrow-left</v-icon>Quay lại</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark class="mb-2" @click="memberList = !memberList">Danh sách thành viên</v-btn>
      <v-btn color="primary" dark class="mb-2" :to="{ name: 'group' }">Cập nhật<v-icon>add</v-icon></v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-if="memberList" flat>
    <v-card-title>
      Danh sách thành viên
      <v-spacer></v-spacer>
      <v-col cols="6" sm="6" md="6">
        <v-combobox
          v-model="model"
          :items="items"
          :search-input.sync="searchAddMember"
          :hide-selected="true"
          label="Thêm thành viên"
          :multiple="true"
          persistent-hint
          :small-chips="true"
          :clearable="true"
          deletable-chips
        >
          <template v-if="noData" v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
      </v-col>
      <v-btn class="mx-2" dark color="indigo">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table 
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :search="search"
      item-key="name"
      :show-select=true
    >
      <template v-slot:item.active="{ item }">
        <v-chip :color="getColor(item.active)" dark>{{ item.active }}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
            edit
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
            delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</div>
</template>

<script>
  export default {
    data () {
      return {
        items: ['Gaming', 'Programming', 'Vue', 'Vuetify'],
        model: null,
        searchAddMember: null,
        memberList: false,
        noData: true,
        dialog: false,
        search: '',
        selected: [],
        headers: [
          {
            text: 'Họ tên',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          { text: 'Email', value: 'email' },
          { text: 'Trạng thái', align: 'center', value: 'active' },
          { text: 'Actions', value: 'action', sortable: false },
        ],
        desserts: [
          {
            name: 'Test1',
            email: 'test1@gmail.com',
            active: 'Hoạt động',
          },
          {
            name: 'Test2',
            email: 'test2@gmail.com',
            active: 'Hoạt động',
          },
          {
            name: 'Test3',
            email: 'test3@gmail.com',
            active: 'Không hoạt động',
          },
        ],
      }
    },

    methods: {
      getColor(active) {
        if(active == 'Hoạt động') return 'green'
        else return 'gray'
      },
    }
  }
</script>
