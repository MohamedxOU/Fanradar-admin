<template>
  <div class="font-sans">
    <div class="relative min-h-screen flex flex-col sm:justify-center items-center bg-base-100">
      <div class="relative sm:max-w-sm w-full">
        <div class="card bg-primary shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
        <div class="card bg-secondary shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
        <div class="relative w-full rounded-3xl px-6 py-4 bg-base-200 shadow-md">
          <label class="block mt-3 text-sm text-base-content text-center font-semibold">
            Reset Password
          </label>
          <form @submit.prevent="handleSubmit" class="mt-10">
            <div>
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                required
                class="pl-5 mt-1 block w-full border-none bg-base-300 h-11 rounded-xl shadow-lg hover:bg-primary/10 focus:bg-primary/10 focus:ring-0 text-base-content"
              >
            </div>

            <div class="mt-7">
              <p class="text-sm text-base-content text-center">
                We'll send you a link to reset your password
              </p>
            </div>

            <div class="mt-7 mb-20">
              <button
                type="submit"
                class="bg-primary w-full py-3 rounded-xl text-primary-content shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">Send Reset Link</span>
                <span v-else>Sending...</span>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    // Here you would typically call your API to send reset password email
    console.log('Reset password requested for:', email.value);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Redirect to confirmation page or show success message
    router.push('/reset-password-confirmation');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>
