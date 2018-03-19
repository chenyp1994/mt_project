import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Room from '@/components/home/Room.vue'
import Pay from '@/components/home/Pay.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/web/',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: "/home",
      name: 'Home',
      component: Home
      // childrens:[
      //   {
      //     path:"/room",
      //     name:'Room',
      //     component:Room
      //   }
      // ]
    },
    {
      path: "/room",
      name: 'Room',
      component: Room
    },
    {
      path: "/pay",
      name: 'Pay',
      component: Pay
    }
  ]
})
