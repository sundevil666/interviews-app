import { RouteRecordRaw } from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const checkAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  let isAuth = false;

  onAuthStateChanged(getAuth(), (user) => {
    if(user && !isAuth) {
      isAuth = true;
      next();
    } else if (!user && !isAuth) {
      isAuth = true;
      next({ name: 'Auth' });
    }
  })
}
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'Statistics' },
    children: [
      {
        path: 'auth',
        name: 'Auth',
        component: () => import('pages/AuthPage.vue'),
      },
      {
        path: 'add-interview',
        name: 'AddInterview',
        component: () => import('pages/AddInterviewPage.vue'),
        beforeEnter: checkAuth,
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('pages/StatisticsPage.vue'),
        beforeEnter: checkAuth,
      },
      {
        path: 'list-interviews',
        name: 'ListInterviews',
        component: () => import('pages/InterviewsPage.vue'),
        beforeEnter: checkAuth,
      },
      {
        path: 'interview/:id',
        name: 'Interview',
        component: () => import('pages/InterviewPage.vue'),
        beforeEnter: checkAuth,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
