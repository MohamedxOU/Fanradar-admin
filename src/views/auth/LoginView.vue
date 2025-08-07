<template>
  <!-- This is an example component -->
  <div class="font-sans">
    <div class="relative min-h-screen flex flex-col sm:justify-center items-center bg-base-100">
      <div class="relative sm:max-w-sm w-full">
        <div class="card bg-primary shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"></div>
        <div class="card bg-secondary shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"></div>
        <div class="relative w-full rounded-3xl px-6 py-4 bg-base-200 shadow-md">
          <label for="" class="block mt-3 text-sm text-base-content text-center font-semibold">
            Login
          </label>
          <form method="#" action="#" class="mt-10">

            <div>
              <input type="email" placeholder="Email" class="pl-5 mt-1 block w-full border-none bg-base-300 h-11 rounded-xl shadow-lg hover:bg-primary/10 focus:bg-primary/10 focus:ring-0 text-base-content">
            </div>

            <div class="mt-7">
              <input type="password" placeholder="Password" class="pl-5 mt-1 block w-full border-none bg-base-300 h-11 rounded-xl shadow-lg hover:bg-primary/10 focus:bg-primary/10 focus:ring-0 text-base-content">
            </div>

            <div class="mt-7 flex">
              <label for="remember_me" class="inline-flex items-center w-full cursor-pointer">
                <input id="remember_me" type="checkbox" class="rounded border-base-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" name="remember">
                <span class="ml-2 text-sm text-base-content">
                  Remember me
                </span>
              </label>

              <div class="w-full text-right">
                <router-link to="/forgot-password" class="underline text-sm text-base-content hover:text-primary">
                  Forgot your password?
                </router-link>

              </div>
            </div>

            <div class="mt-7 mb-20">
              <router-link
                to="/"
                class="w-full"
              >
              <button class="bg-primary w-full py-3 rounded-xl text-primary-content shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                Login
              </button>
            </router-link>
            </div>

            <!-- <div class="flex mt-7 items-center text-center">
              <hr class="border-base-300 border-1 w-full rounded-md">
              <label class="block font-medium text-sm text-base-content w-full">
                Accede con
              </label>
              <hr class="border-base-300 border-1 w-full rounded-md">
            </div>

            <div class="flex mt-7 justify-center w-full">
              <button class="mr-5 bg-info border-none px-4 py-2 rounded-xl cursor-pointer text-info-content shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                Facebook
              </button>

              <button class="bg-error border-none px-4 py-2 rounded-xl cursor-pointer text-error-content shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                Google
              </button>
            </div> -->

            <!-- <div class="mt-7">
              <div class="flex justify-center items-center">
                <label class="mr-2 text-base-content">¿Eres nuevo?</label>
                <a href="#" class="text-primary transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105">
                  Crea una cuenta
                </a>
              </div>
            </div> -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
