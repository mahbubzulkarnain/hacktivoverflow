import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';

Vue.use(Router);

function checkIsLogin(next) {
  if (localStorage.xs && localStorage.xi) {
    window.location.href = `${window.location.protocol}//${window.location.host}`;
  } else {
    next();
  }
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      name: 'Not Found',
      redirect: '/login',
    },
    {
      path: '/tags/:slug',
      name: 'question-slug',
      component: () => import(/* webpackChunkName: "question-tags" */ './views/Home.vue'),
    },
    {
      path: '/watched',
      name: 'question-watched',
      component: () => import(/* webpackChunkName: "question-tags" */ './views/Home.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/auth/Login.vue'),
      meta: {
        requiresAuth: false,
      },
      beforeEnter: (to, from, next) => {
        checkIsLogin(next);
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './views/auth/Register.vue'),
      beforeEnter: (to, from, next) => {
        checkIsLogin(next);
      },
    },
    {
      path: '/question/create',
      name: 'question-create',
      component: () => import(/* webpackChunkName: "question-read" */ './views/question/Create.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/question/:slug/edit',
      name: 'question-edit',
      component: () => import(/* webpackChunkName: "question-read" */ './views/question/Create.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/question/:slug/answer/:id/edit',
      name: 'answer-edit',
      component: () => import(/* webpackChunkName: "question-read" */ './views/question/Create.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/question/',
      name: 'question',
      component: () => import(/* webpackChunkName: "question-read" */ './views/question/Index.vue'),
      children: [
        {
          path: ':slug',
          name: 'question-read',
          component: () => import(/* webpackChunkName: "question-read" */ './views/question/Read.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLogin) {
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
});

export default router;
