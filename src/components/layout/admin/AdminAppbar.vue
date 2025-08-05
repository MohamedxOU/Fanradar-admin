<template>
  <header class="sticky bg-base-100 shadow-md">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Logo Section -->

      <!-- Left side - Search -->
      <div class="flex items-center flex-1 max-w-md">
        <router-link to="/" class="flex items-center mr-12">
          <img class="h-10 w-auto" src="/images/FanRadar_logo.png" />
        <span v-if="!isCollapsed || isMobile" class="text-lg font-semibold text-base-content ml-2">FanRadar</span>

      </router-link>
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search task"
            class="w-full pl-10 pr-12 py-2.5 bg-base-200/50 border border-base-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <kbd class="px-2 py-1 text-xs font-medium bg-base-300 text-base-content/60 rounded border">
              ⌘F
            </kbd>
          </div>
        </div>
      </div>

      <!-- Right side - Actions and User -->
      <div class="flex items-center space-x-4 ml-6">
        <!-- Notification Bell -->
        <button class="relative p-2 rounded-lg hover:bg-base-200 transition-colors">
          <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <!-- Notification dot -->
          <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        <!-- Mail Icon -->
        <button class="p-2 rounded-lg hover:bg-base-200 transition-colors">
          <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </button>

        <!-- User Profile -->
        <div class="flex items-center space-x-3 cursor-pointer group">
          <div class="text-right">
            <p class="text-sm font-medium text-base-content group-hover:text-primary transition-colors">
              Totok Michael
            </p>
            <p class="text-xs text-base-content/60">
              tmichael20@mail.com
            </p>
          </div>
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
              alt="Totok Michael"
              class="w-10 h-10 rounded-full border-2 border-base-300 group-hover:border-primary transition-colors"
            />
            <!-- Online status indicator -->
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100"></span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

// You can add more functionality here like:
// - Search suggestions
// - User dropdown menu
// - Notification handling
// - etc.

/* const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // Implement search logic here
  }
} */

// Handle keyboard shortcut for search focus
const handleKeydown = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
    event.preventDefault()
    document.querySelector('input[type="text"]')?.focus()
  }
}

// Add keyboard event listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
/* Custom focus styles for better UX */
input:focus {
  box-shadow: 0 0 0 3px rgba(var(--p) / 0.1);
}

/* Smooth transitions for interactive elements */
button, .group {
  transition: all 0.2s ease-in-out;
}

/* Hover effects */
.group:hover img {
  transform: scale(1.05);
}

/* Notification dot animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.absolute.bg-error {
  animation: pulse 2s infinite;
}
</style>
