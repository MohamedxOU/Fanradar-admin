<script setup>
import { RouterView } from 'vue-router'
import ThemeChanger from './components/ThemeChanger.vue'
</script>

<template>
  <div class="app-wrapper bg-base-100">
    <!-- Main content wrapper -->
    <RouterView >

    </RouterView>

    <!-- Theme changer will persist as it's outside RouterView -->
    <ThemeChanger />
  </div>
</template>

