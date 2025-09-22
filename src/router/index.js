import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/auth/LoginView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'
import AdminDashboardLayout from '@/components/layout/admin/AdminDashboardLayout.vue'
import AdminDashboardHome from '@/views/admin/AdminDashboardHome.vue'
import UserManagement from '@/views/admin/UserManagement.vue'
import AllPosts from '@/views/admin/AllPosts.vue'
import FandomsView from '@/views/admin/FandomsView.vue'
import PendingPosts from '@/views/admin/PendingPosts.vue'
import ScheduledPosts from '@/views/admin/ScheduledPosts.vue'

import ProductsView from '@/views/admin/ProductsView.vue'
import OrdersPage from '@/views/admin/OrdersPage.vue'
import RadarTracker from '@/views/admin/RadarTracker.vue'
import AnalyticsView from '@/views/admin/AnalyticsView.vue'

import CategorySubCatView from '@/views/admin/CategorySubCatView.vue'
import ProfileView from '@/views/account/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [


    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
    },

    {
      path: '/',
      name: 'dashboard',
      component: AdminDashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: AdminDashboardHome,
        },
        {
          path: 'users',
          name: 'user-management',
          component: UserManagement,
        },
        {
          path: 'posts',
          name: 'all-posts',
          component: AllPosts,
        },



        {
          path: 'pending-posts',
          name: 'pending-posts',
          component: PendingPosts,
        },

        {
          path: 'scheduled-posts',
          name: 'scheduled-posts',
          component: ScheduledPosts,
        },

        {
          path: 'fandoms',
          name: 'fandoms',
          component: FandomsView,
        },

        {
          path: 'products',
          name: 'products',
          component: ProductsView,
        },



        {
          path: 'orders',
          name: 'orders',
          component: OrdersPage,
        },

        {
          path : 'radar-tracker',
          name: 'radar-tracker',
          component: RadarTracker,
        },
        {
          path : 'analytics',
          name: 'analytics',
          component: AnalyticsView,

        },




        {
          path: 'categories-subcategories',
          name: 'categories-subcategories',
          component: CategorySubCatView,
        },

        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
        }

      ]
    },


  ],
})

export default router

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && auth.isAuthenticated) {
    next({ name: 'dashboard-home' })
  } else {
    next()
  }
})
