import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(credentials) {
      const data = await apiLogin(credentials)
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
    async logout() {
      if (this.token) await apiLogout(this.token)
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  }
})
