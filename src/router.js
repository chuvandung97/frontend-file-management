import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from './views/LandingPage.vue'
import Axios from 'axios'
import store from './store/store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landingpage',
      component: LandingPage,
      beforeEnter: async (to, from, next) => {
        let token = localStorage.getItem('jwt_token')
        if(!token) {
          next('/login')
        } else {
          try {
            let res = await Axios.get('http://localhost:3000/me', {
             headers: {
               Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
             } 
            })
            if(res.data.code == 200) {
              store.commit('setUser', res.data.body)
              if(res.data.body.role == "Admin") {
                next('/user/info')
              } else {
                next('/user/drive')
              }
            } else {
              next('/login')
            }
          } catch (error) {
            next('/login')
          }
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/user',
      component: () => import('./views/Home.vue'),
      beforeEnter: (to, from, next) => {
        let token = localStorage.getItem('jwt_token')
        if(!token) {
          next('/login')
        } else {
          next()
        }
      },
      children: [
        {
          path: 'info',
          component: () => import('./components/home/User.vue'),
        },
        {
          path: 'profile',
          component: () => import('./components/home/Profile.vue'),
        },
        {
          path: 'role',
          component: () => import('./components/home/Role.vue')
        },
        {
          path: 'menu',
          name: 'menu',
          component: () => import('./components/home/system/menu/index')
        },
        {
          path: 'menu/update/:menuId',
          name: 'menu.update',
          component: () => import('./components/home/system/menu/update')
        },
        {
          path: 'group',
          name: 'group',
          component: () => import('./components/home/group/index'),
        },
        {
          path: 'group/add',
          name: 'group.add',
          component: () => import('./components/home/group/add'),
        },
        {
          path: 'group/update/:groupId',
          name: 'group.update',
          component: () => import('./components/home/group/update'),
        },
        {
          path: 'drive',
          name: 'user.drive',
          component: () => import('./components/home/my-drive/index'),
        },
        {
          path: 'share',
          name: 'user.share',
          component: () => import('./components/home/my-drive/share'),
        },
        {
          path: 'trash',
          name: 'user.trash',
          component: () => import('./components/home/my-drive/trash'),
        }
      ]
    }
  ]
})
