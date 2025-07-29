import { createRouter, createWebHistory } from 'vue-router'
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
import AddPost from '@/views/admin/AddPost.vue'
import ProductsView from '@/views/admin/ProductsView.vue'
import DropsPage from '@/views/admin/DropsPage.vue'
import OrdersPage from '@/views/admin/OrdersPage.vue'
import RadarTracker from '@/views/admin/RadarTracker.vue'
import AnalyticsView from '@/views/admin/AnalyticsView.vue'
import FooterLegalManagement from '@/views/admin/FooterLegalManagement.vue'
import SettingsView from '@/views/admin/SettingsView.vue'
import FansContent from '@/views/admin/FansContent.vue'

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
          path: 'add-post',
          name: 'add-post',
          component: AddPost,
         },

         {
          path: 'fans-content',
          name: 'fans-content',
          component: FansContent,
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
          path: 'drops',
          name: 'drops',
          component: DropsPage,
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
          path : 'footer-legal',
          name: 'footer-legal-management',
          component: FooterLegalManagement,
        },

        {
          path: 'settings',
          name: 'settings',
          component: SettingsView,
        }

      ]
    },


  ],
})

export default router
