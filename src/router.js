import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from './views/LandingPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landingpage',
      component: LandingPage
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
      children: [
        {
          path: '',
          component: () => import('./components/home/User.vue')
        },
        {
          path: 'role',
          component: () => import('./components/home/Role.vue')
        },
        {
          path: 'group',
          component: () => import('./components/home/group/index'),
        },
        {
          path: 'group/add',
          name: 'group.add',
          component: () => import('./components/home/group/add'),
        }
      ]
    }
  ]
})
