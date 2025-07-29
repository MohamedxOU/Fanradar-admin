<template>
  <div class="app-layout flex h-screen bg-base-100">
    <!-- Sidebar -->
    <AppSidebar class="w-64 flex-shrink-0" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <AppHeader class="flex-shrink-0" />

      <!-- Dynamic Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from './AdminAppbar.vue'
import AppSidebar from './AdminSidebar.vue'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
