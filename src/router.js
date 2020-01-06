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
          if(!token && to.path !== '/login') { 
            next('/login')
          } else if(token) {
            try {
              let res = await Axios.get('http://localhost:3000/me', {
               headers: {
                 Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
               } 
              })
              if(res.data.code == 200) {
                store.commit('setUser', res.data.body)
                if(res.data.body.role == "Admin" || res.data.body.role == "Sysadmin") {
                  next({name: 'user.info'})
                } else {
                  console.log(12)
                  next({name: 'user.drive'})
                }
              } else {
                next({name: 'login'})
              }
            } catch (error) {
              next('/login')
            }
          } else {
            next()
          }
      },
       children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('./components/landing-page/login.vue')
        },
        {
          path: 'register',
          component: () => import('./components/landing-page/register.vue')
        },
      ] 
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
          name: 'user.info',
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
          path: 'folder/:folderId',
          name: 'user.detailfolder',
          component: () => import('./components/home/my-drive/detail'),
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
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('./components/home/Category.vue'),
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('./components/home/my-drive/search'),
        }
      ]
    }
  ]
})
