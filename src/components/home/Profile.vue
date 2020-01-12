<template>
    <v-card flat>
        <v-card-title>
            Hồ sơ người dùng
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" xs="12" md="8">
                    <v-form>
                        <v-row>
                            <v-col
                                cols="12"
                                xs="12"
                                md="4"
                            >
                                <v-text-field
                                    v-model="name"
                                    class="purple-input"
                                    label="Tên"
                                />
                            </v-col>
                            <v-col
                                cols="12"
                                xs="12"
                                md="4"
                                >
                                <v-text-field
                                    v-model="email"
                                    label="Email"
                                    class="purple-input"/>
                            </v-col>
                            <v-col
                                cols="12"
                                xs="12"
                                md="4"
                            >
                                <v-switch
                                    v-model="active"
                                    label="Hoạt động"
                                    color="primary"
                                ></v-switch>
                            </v-col>
                            <v-col
                                cols="12"
                                xs="12"
                                md="6"
                            >
                                <v-text-field
                                    readonly
                                    label="Địa chỉ"
                                    class="purple-input"/>
                            </v-col>
                            <v-col
                                cols="12"
                                xs="12"
                                md="6"
                            >
                                <v-select
                                    v-model="role"
                                    :items="roles"
                                    :rules="[v => !!v || 'Mời bạn chọn vai trò']"
                                    label="Vai trò"
                                    item-text="code"
                                    required
                                    return-object
                                    disabled
                                >
                                </v-select>
                            </v-col>
                            <v-col
                                cols="12"
                                xs="12"
                                md="12"
                            >
                                <v-textarea
                                    readonly
                                    label="Mô tả"
                                    class="purple-input"
                                    counter
                                    auto-grow
                                    clearable
                                    dense/>
                            </v-col>
                            <v-col>
                                <v-btn
                                    class="mx-0"
                                    color="primary"
                                    outlined
                                    exact depressed text
                                    :to="role.code == 'User' || role.code == 'Group' ? '/user/drive' : '/user/info'"
                                >
                                    <v-icon>mdi-arrow-left</v-icon> Quay lại
                                </v-btn>
                            </v-col>
                            <v-col class="d-flex justify-end">
                                <v-btn
                                    class="mx-0"
                                    color="primary"
                                    depressed
                                    @click="updateUser()"
                                >
                                    Cập nhật hồ sơ
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
                <v-col col="12" xs="12" md="4">
                    <v-avatar
                        slot="offset"
                        class="mx-auto d-block"
                        size="130"
                    >
                        <img
                        src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
                        >
                    </v-avatar>
                    <v-card-text class="text-center">
                        <h5 class="category text-gray font-weight-bold mb-3">{{ roleDescription }}</h5>
                        <h4 class="card-title font-weight-light">{{ name }}</h4>
                        <p class="card-description font-weight-light">Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...</p>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card-text>        
    </v-card>
</template>

<script>
import Axios from 'axios'
export default {
    data: () => {
        return {
            name: null, 
            email: null,
            active: true,
            password: null,
            roleDescription: null,
            roles: [],
            user: [],
            role: []
        }
    },

    mounted() {
        this.getInfo()
        this.getRole()
    },

    methods: {
        async getInfo() {
            try {
                let res = await Axios.get('http://localhost:3000/users/info', {
                    params: {
                        id: localStorage.getItem('userid')
                    }
                })  
                this.user = res.data.body.user_info
                this.name = this.user.name
                this.email = this.user.email
                this.role = this.user.role
                this.active = this.user.active
                this.roleDescription = this.user.role.name
            } catch (error) {
                console.log(error)
            }
        },

        async getRole() {
            try {
                let res = await Axios.get('http://localhost:3000/roles/lists', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                })  
                this.roles = res.data.body.role_list
            } catch (error) {
                console.log(error)
            }
        },

        async updateUser() {
            try {
                let res = await Axios.post('http://localhost:3000/users/update/' + this.user.id, {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    role_id: this.role.id,
                    active: this.active
                }) 
                this.$store.commit('setNoti', {
                    typeNoti: 1,
                    textNoti: res.data.message,
                    showNoti: true
                })
                if(this.role.code == 'Admin' || this.role.code == 'Sysadmin') {
                    this.$router.push('/user/info')
                } else {
                    this.$router.push('/user/drive')
                }
            } catch(e) {
                this.$store.commit('setNoti', {
                    typeNoti: 0,
                    textNoti: 'Cập nhật thất bại !',
                    showNoti: true
                })
            }
        }
    }
}
</script>