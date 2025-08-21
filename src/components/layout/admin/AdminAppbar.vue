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
        <!-- Notification Bell with Dropdown -->
        <div class="relative">
          <button
            class="relative p-2 rounded-lg hover:bg-base-200 transition-colors"
            @click="toggleNotificationDropdown"
          >
            <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <!-- Notification dot -->
            <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>

          <!-- Notification Dropdown Menu -->
          <div
            v-show="showNotificationDropdown"
            class="absolute right-0 mt-2 w-72 bg-base-100 rounded-md shadow-lg py-1 z-50 border border-base-300"
            @click.stop
          >
            <div class="px-4 py-2 border-b border-base-300">
              <p class="text-sm font-medium text-base-content">Notifications</p>
            </div>

            <!-- Notification Items -->
            <div class="max-h-64 overflow-y-auto">
              <a
                href="#"
                class="block px-4 py-3 text-sm hover:bg-base-200 transition-colors border-b border-base-300 last:border-b-0"
                v-for="notification in notifications"
                :key="notification.id"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0 pt-0.5">
                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="notification.type === 'message'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        <path v-if="notification.type === 'alert'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        <path v-if="notification.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-base-content">{{ notification.title }}</p>
                    <p class="text-xs text-base-content/60 mt-0.5">{{ notification.message }}</p>
                    <p class="text-xs text-base-content/40 mt-1">{{ notification.time }}</p>
                  </div>
                </div>
              </a>
            </div>

            <div class="px-4 py-2 border-t border-base-300">
              <a href="#" class="text-xs text-primary hover:underline">View all notifications</a>
            </div>
          </div>
        </div>

        <!-- User Profile with Dropdown -->
        <div class="relative">
          <div
            class="flex items-center space-x-3 cursor-pointer group"
            @click="toggleUserDropdown"
          >
            <div class="text-right">
              <p class="text-sm font-medium text-base-content group-hover:text-primary transition-colors">
                {{ userName }}
              </p>
              <p class="text-xs text-base-content/60">
                {{ userEmail }}
              </p>
            </div>
            <div class="relative">
              <img
                :src="userAvatar"
                :alt="userName"
                class="w-10 h-10 rounded-full border-2 border-base-300 group-hover:border-primary transition-colors"
              />
              <!-- Online status indicator -->
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100"></span>
            </div>
          </div>

          <!-- Dropdown Menu -->
          <div
            v-show="showUserDropdown"
            class="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg py-1 z-50 border border-base-300"
            @click.stop
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
              @click="showUserDropdown = false"
            >
              Profile
            </router-link>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
              @click="visitWebsite"
            >
              Visit Website
            </a>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
              @click="visitStore"
            >
              Visit Store
            </a>
            <div class="border-t border-base-300 my-1"></div>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors flex items-center justify-center"
              @click="logout"
            >
              <span v-if="loadingLogout" class="loading loading-spinner loading-xs mr-2"></span>
              <span v-else>Logout</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const searchQuery = ref('')
const showUserDropdown = ref(false)
const showNotificationDropdown = ref(false)
const loadingLogout = ref(false)
const router = useRouter()
const auth = useAuthStore()

const userName = computed(() => auth.user?.first_name + ' ' + auth.user?.last_name || 'User')
const userEmail = computed(() => auth.user?.email || '')
const userAvatar = computed(() => auth.user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format')

// Sample notifications data
const notifications = ref([
  {
    id: 1,
    type: 'message',
    title: 'New message received',
    message: 'You have a new message from Sarah Williams',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'alert',
    title: 'System update required',
    message: 'Your system needs to be updated to the latest version',
    time: '1 hour ago'
  },
  {
    id: 3,
    type: 'success',
    title: 'Payment received',
    message: 'Your subscription payment has been processed',
    time: '3 hours ago'
  }
])

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
  // Close notification dropdown if open
  if (showUserDropdown.value) {
    showNotificationDropdown.value = false
  }
}

const toggleNotificationDropdown = () => {
  showNotificationDropdown.value = !showNotificationDropdown.value
  // Close user dropdown if open
  if (showNotificationDropdown.value) {
    showUserDropdown.value = false
  }
}

const visitWebsite = () => {
  console.log('Visiting website...')
  showUserDropdown.value = false
}

const visitStore = () => {
  console.log('Visiting store...')
  showUserDropdown.value = false
}

const logout = async () => {
  loadingLogout.value = true
  try {
    await auth.logout()
    showUserDropdown.value = false
    router.push({ name: 'login' })
  } catch (e) {
    console.error('Logout failed', e)
  } finally {
    loadingLogout.value = false
  }
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserDropdown.value = false
    showNotificationDropdown.value = false
  }
}

// Add click event listener to close dropdowns when clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}

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

/* Dropdown animation */
[v-show] {
  transition: opacity 0.1s ease-out, transform 0.1s ease-out;
}

[v-show="false"] {
  opacity: 0;
  transform: translateY(-10px);
}

/* Notification dropdown scrollbar */
.max-h-64::-webkit-scrollbar {
  width: 4px;
}

.max-h-64::-webkit-scrollbar-track {
  background: rgba(var(--bc) / 0.1);
  border-radius: 10px;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: rgba(var(--bc) / 0.2);
  border-radius: 10px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--bc) / 0.3);
}
</style>
