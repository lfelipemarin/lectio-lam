import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
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
      beforeEnter: (to, from, next) => {
        if (!store.state.isUserLoggedIn) {
          next()
        } else {
          next('/')
        }
      },
      // route level code-splitting
      // this generates a separate chunk (login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      beforeEnter: (to, from, next) => {
        if (!store.state.isUserLoggedIn) {
          next()
        } else {
          next('/')
        }
      },
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
      path: '/lectio-archivo/:date',
      name: 'previous-lectio',
      props: true,
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (previous-lectio.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "previous-lectio" */ './views/PreviousLectio.vue')
    },
    {
      path: '/favorite-readings',
      name: 'favorite-readings',
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (favorite-readings.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "favorite-readings" */ './views/FavoriteReadings.vue')
    },
    {
      path: '/favorite-saints',
      name: 'favorite-saints',
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (favorite-saints.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "favorite-saints" */ './views/FavoriteSaints.vue')
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
      path: '/saints/:id',
      name: 'saint',
      props: true,
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (saint.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "saint" */ './views/ViewSaint.vue')
    },
    {
      path: '/email-verify',
      name: 'email-verify',
      // route level code-splitting
      // this generates a separate chunk (email-verify.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "email-verify" */ './views/EmailVerify.vue')
    },
    {
      path: '/plan-mortificacion',
      name: 'plan-mortificacionverify',
      // route level code-splitting
      // this generates a separate chunk (plan-mortificacion.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "plan-mortificacion" */ './views/MortificationPlan.vue')
    },
    {
      path: '/404',
      name: '404',
      // route level code-splitting
      // this generates a separate chunk (404.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "404" */ './views/404.vue')
    },
    {
      path: '*', // or '/index.html'
      beforeEnter: (to, from, next) => {
        next('/')
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !store.state.isUserLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
