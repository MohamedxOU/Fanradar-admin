<template>
  <div class="font-sans">
    <div class="relative min-h-screen flex flex-col sm:justify-center items-center bg-base-100">
      <div class="relative sm:max-w-sm w-full">
        <div class="card bg-primary shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
        <div class="card bg-secondary shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
        <div class="relative w-full rounded-3xl px-6 py-4 bg-base-200 shadow-md">
          <label class="block mt-3 text-sm text-base-content text-center font-semibold">
            Reset Your Password
          </label>
          <form @submit.prevent="handleSubmit" class="mt-10">
            <div class="mb-4 text-sm text-base-content text-center">
              <p>Enter your new password below</p>
            </div>

            <div class="mt-4">
              <input
                v-model="password"
                type="password"
                placeholder="New Password"
                required
                class="pl-5 mt-1 block w-full border-none bg-base-300 h-11 rounded-xl shadow-lg hover:bg-primary/10 focus:bg-primary/10 focus:ring-0 text-base-content"
              >
            </div>

            <div class="mt-4">
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                required
                class="pl-5 mt-1 block w-full border-none bg-base-300 h-11 rounded-xl shadow-lg hover:bg-primary/10 focus:bg-primary/10 focus:ring-0 text-base-content"
              >
              <p v-if="passwordMismatch" class="text-error text-xs mt-1">Passwords don't match</p>
            </div>

            <div class="mt-7 mb-20">
              <button
                type="submit"
                class="bg-primary w-full py-3 rounded-xl text-primary-content shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                :disabled="isLoading || passwordMismatch"
              >
                <span v-if="!isLoading">Reset Password</span>
                <span v-else>Resetting...</span>
              </button>
            </div>

            <div class="mt-7 text-center">
              <router-link
                to="/login"
                class="text-primary transition duration-500 ease-in-out hover:underline"
              >
                Back to Login
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const token = route.query.token // Get reset token from URL

const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const passwordMismatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value
})

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  try {
    isLoading.value = true

    // Here you would typically call your API to reset password
    console.log('Resetting password with token:', token)
    console.log('New password:', password.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Redirect to success page
    router.push('/password-reset-success')
  } catch (error) {
    console.error('Error resetting password:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
