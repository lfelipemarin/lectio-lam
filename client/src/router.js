import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import firebase from 'firebase/app'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/readings',
      name: 'readings',
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (readings.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "readings" */ './views/Readings.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (signup.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "signup" */ './views/Signup.vue')
    },
    {
      path: '/lectio',
      name: 'lectio',
      props: true,
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (lectio.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "lectio" */ './views/Lectio.vue')
    },
    {
      path: '/lectio-archivo',
      name: 'lectio-archivo',
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (lectio-archivo.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "lectio-archivo" */ './views/LectioArchive.vue')
    },
    {
      path: '/saints',
      name: 'saints',
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (saints.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "saints" */ './views/Saints.vue')
    },
    {
      path: '*', // or '/index.html'
      beforeEnter: (to, from, next) => {
        next('/')
      }
    }
  ]
})


//TODO refarctor this code
const firebaseConfig = {
  apiKey: 'AIzaSyCdAX_TnRncsLM0tV8oRCdS26QdxOigjNA',
  authDomain: 'sizzling-heat-354.firebaseapp.com',
  databaseURL: 'https://sizzling-heat-354.firebaseio.com',
  projectId: 'sizzling-heat-354',
  storageBucket: 'sizzling-heat-354.appspot.com',
  messagingSenderId: '485166763553',
  appId: '1:485166763553:web:5d0080146713de4baa1d60'
}
firebase.initializeApp(firebaseConfig)

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user && requiresAuth) {
      // User is signed in.
      next('/login')
    } else if (user && requiresAuth) {
      next()
    } else {
      next()
    }

  });
})

export default router
