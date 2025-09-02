import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null, token = null
    if (typeof window !== 'undefined') {
      user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || 'null')
      token = sessionStorage.getItem('token') || localStorage.getItem('token') || null
    }
    return {
      user,
      token,
    }
  },
  actions: {
    async login(credentials, remember = false) {
      const data = await apiLogin(credentials)
      this.token = data.token
      this.user = data.user
      const storage = remember ? localStorage : sessionStorage
      storage.setItem('token', data.token)
      storage.setItem('user', JSON.stringify(data.user))
      const otherStorage = remember ? sessionStorage : localStorage
      otherStorage.removeItem('token')
      otherStorage.removeItem('user')
    },
    async logout() {
      if (this.token) await apiLogout(this.token)
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
      sessionStorage.setItem('user', JSON.stringify(user))
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  }
})
