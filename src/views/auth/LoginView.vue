<template>
  <div class="font-sans">
    <div class="relative min-h-screen flex flex-col sm:justify-center items-center bg-base-100">
      <div class="relative sm:max-w-sm w-full">
        <div class="card bg-primary shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
        <div class="card bg-secondary shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
        <div class="relative w-full rounded-3xl px-6 py-4 bg-base-200 shadow-md">
          <label class="block mt-3 text-lg text-base-content text-center font-bold">
            Login
          </label>
          <form @submit.prevent="handleLogin" class="mt-10">
            <div>
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                class="input input-bordered w-full bg-base-300 text-base-content"
                required
              />
            </div>
            <div class="mt-7 relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                class="input input-bordered w-full bg-base-300 text-base-content pr-10"
                required
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70">
                <span v-if="showPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
            <div class="mt-7 flex items-center justify-between">
              <label for="remember_me" class="inline-flex items-center cursor-pointer">
                <input id="remember_me" type="checkbox" v-model="remember" class="checkbox checkbox-primary" />
                <span class="ml-2 text-sm text-base-content">Remember me</span>
              </label>
              <router-link to="/forgot-password" class="link link-primary text-sm">Forgot your password?</router-link>
            </div>
            <div v-if="error" class="mt-4 text-error text-sm text-center">{{ error }}</div>
            <div class="mt-7 mb-4">
              <button
                type="submit"
                class="btn btn-primary w-full text-primary-content shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out"
                :disabled="loading"
              >
                <span v-if="loading" class="loading loading-spinner"></span>
                <span v-else>Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
  await auth.login({ email: email.value, password: password.value }, remember.value)
    router.push({ name: 'dashboard-home' })
  } catch (e) {
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
