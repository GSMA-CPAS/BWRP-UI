'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Login = () => import('@/components/pages/Login.vue');
const Dashboard = () => import('@/components/pages/Dashboard.vue');
const TwoFactor = () => import('@/components/pages/TwoFactor.vue');
const ChangePassword = () => import('@/components/pages/ChangePassword.vue');
const AppFrame = () => import('@/components/pages/AppFrame.vue');
const AccountPassword = () => import('@/components/pages/account/Password.vue');
const AccountSecurity = () => import('@/components/pages/account/Security.vue');
const AccountSecurityTwoFactor = () => import('@/components/pages/account/TwoFactor.vue');
const SettingsUserList = () => import('@/components/pages/settings/users/UserList.vue');
const SettingsUserCreate = () => import('@/components/pages/settings/users/UserCreate.vue');
const SettingsUserDetails = () => import('@/components/pages/settings/users/UserDetails.vue');
const NotFound = () => import('@/components/NotFound.vue');

export default new VueRouter({

  // scroll to top on route change
  scrollBehavior() {
    return {x: 0, y: 0};
  },

  mode: 'history',

  routes: [
    {
      name: 'Dashboard',
      path: '/',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'Login',
      path: '/login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      name: 'TwoFactor',
      path: '/2fa',
      component: TwoFactor,
      meta: {
        guest: true
      }
    },
    {
      name: 'ChangePassword',
      path: '/password/change',
      component: ChangePassword,
      meta: {
        guest: true
      }
    },
    {
      name: 'AppFrame',
      path: '/a/:name',
      component: AppFrame,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'AccountPassword',
      path: '/account/security/password',
      component: AccountPassword,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'AccountSecurity',
      path: '/account/security',
      component: AccountSecurity,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'AccountSecurityTwoFactor',
      path: '/account/security/2fa',
      component: AccountSecurityTwoFactor,
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'SettingsUserList',
      path: '/settings/users',
      component: SettingsUserList,
      meta: {
        requiresAuth: true,
        isAdmin: true
      }
    },
    {
      name: 'SettingsUserCreate',
      path: '/settings/users/create',
      component: SettingsUserCreate,
      meta: {
        requiresAuth: true,
        isAdmin: true
      }
    },
    {
      name: 'SettingsUserDetails',
      path: '/settings/users/:id',
      component: SettingsUserDetails,
      meta: {
        requiresAuth: true,
        isAdmin: true
      }
    },
    {
      name: 'NotFound',
      path: '/404',
      component: NotFound,
      meta: {
        guest: true
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]

});
