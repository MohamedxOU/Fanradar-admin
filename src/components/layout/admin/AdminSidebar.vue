<template>
  <!-- Mobile Menu Button -->
  <button @click="toggleMobileSidebar"
    class="fixed lg:hidden z-30 left-4 top-4 p-2 rounded-md bg-base-200 text-base-content shadow-md">
    <Bars3Icon class="h-6 w-6" />
  </button>

  <!-- Overlay -->
  <div v-if="isMobile && isSidebarOpen" @click="toggleMobileSidebar"
    class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
    :class="{ 'opacity-100': isSidebarOpen, 'opacity-0 pointer-events-none': !isSidebarOpen }"></div>

  <!-- Sidebar -->
  <aside ref="sidebar"
    class="fixed lg:sticky z-20 top-0 left-0 h-screen bg-base-200 border-r border-base-300 transition-all duration-300 ease-in-out flex flex-col"
    :class="[
      isMobile ?
        (isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64') :
        (isCollapsed ? 'w-20' : 'w-64')
    ]">
    <!-- Collapse Button (desktop only) -->
    <button v-if="!isMobile" @click="toggleCollapse"
      class="absolute -right-3 top-6 z-10 rounded-full bg-base-200 p-1 border border-base-300 shadow-sm hover:bg-base-300 transition-colors">
      <ChevronLeftIcon v-if="!isCollapsed" class="h-4 w-4 text-base-content" />
      <ChevronRightIcon v-else class="h-4 w-4 text-base-content" />
    </button>



    <!-- Navigation Section -->
    <nav class="flex-1 p-2 overflow-y-auto">
      <!-- General Section -->
      <div class="mb-2">
        <h3 v-if="!isCollapsed || isMobile"
          class="text-xs font-medium text-base-content/60 uppercase tracking-wider mb-2 px-2">
          General
        </h3>
        <ul class="space-y-1">
          <li v-for="item in generalItems" :key="item.route">
            <router-link :to="item.route" class="flex items-center px-2 py-2 text-sm rounded-lg transition-colors group"
              :class="[
                isCollapsed && !isMobile ? 'justify-center' : '',
                $route.path === item.route ||
                  (item.exact ? $route.path === item.route : $route.path.startsWith(item.route))
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-base-content hover:bg-base-300'
              ]" :title="isCollapsed && !isMobile ? item.label : ''" @click="isMobile && toggleMobileSidebar()">
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0"
                :class="[isCollapsed && !isMobile ? '' : 'mr-3']" />
              <span v-if="!isCollapsed || isMobile">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Fandoms Section -->
      <div class="mb-2">
        <div v-if="!isCollapsed || isMobile" class="flex items-center justify-between mb-2 px-2 cursor-pointer"
          @click="toggleFandomsDropdown">
          <h3 class="text-xs font-medium text-base-content/60 uppercase tracking-wider">Fandoms</h3>
          <ChevronDownIcon class="w-4 h-4 text-base-content/40 transition-transform duration-200"
            :class="{ 'rotate-180': isFandomsDropdownOpen }" />
        </div>
        <div v-else class="hidden">
          <button @click="toggleFandomsDropdown" class="p-2 rounded-lg hover:bg-base-300" title="Fandoms">

          </button>
        </div>

        <ul v-if="isFandomsDropdownOpen || isCollapsed" class="space-y-1"
          :class="{ 'ml-3 pl-2 border-l border-base-300': !isCollapsed && !isMobile }">
          <li v-for="item in fandomsItems" :key="item.route">
            <router-link :to="item.route" class="flex items-center px-2 py-2 text-sm rounded-lg transition-colors group"
              :class="[
                isCollapsed && !isMobile ? 'justify-center' : '',
                $route.path === item.route
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-base-content hover:bg-base-300'
              ]" :title="isCollapsed && !isMobile ? item.label : ''" @click="isMobile && toggleMobileSidebar()">
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0"
                :class="[isCollapsed && !isMobile ? '' : 'mr-3']" />
              <span v-if="!isCollapsed || isMobile">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Content management Section -->
      <div class="mb-2">
        <div v-if="!isCollapsed || isMobile" class="flex items-center justify-between mb-2 px-2 cursor-pointer"
          @click="toggleCardsDropdown">
          <h3 class="text-xs font-medium text-base-content/60 uppercase tracking-wider">Content Management</h3>
          <ChevronDownIcon class="w-4 h-4 text-base-content/40 transition-transform duration-200"
            :class="{ 'rotate-180': isCardsDropdownOpen }" />
        </div>
        <div v-else class="hidden">
          <button @click="toggleCardsDropdown" class="p-2 rounded-lg hover:bg-base-300" title="Cards">

          </button>
        </div>

        <ul v-if="isCardsDropdownOpen || isCollapsed" class="space-y-1"
          :class="{ 'ml-3 pl-2 border-l border-base-300': !isCollapsed && !isMobile }">
          <li v-for="item in cmsItems" :key="item.route">
            <router-link :to="item.route" class="flex items-center px-2 py-2 text-sm rounded-lg transition-colors group"
              :class="[
                isCollapsed && !isMobile ? 'justify-center' : '',
                $route.path.startsWith(item.route)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-base-content hover:bg-base-300'
              ]" :title="isCollapsed && !isMobile ? item.label : ''" @click="isMobile && toggleMobileSidebar()">
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0"
                :class="[isCollapsed && !isMobile ? '' : 'mr-3']" />
              <span v-if="!isCollapsed || isMobile">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>


      <!-- Shops and drops Section -->
      <div class="mb-2">
        <div v-if="!isCollapsed || isMobile" class="flex items-center justify-between mb-2 px-2 cursor-pointer"
          @click="toggleShopDropdsDropdown">
          <h3 class="text-xs font-medium text-base-content/60 uppercase tracking-wider">Shop and Drops</h3>
          <ChevronDownIcon class="w-4 h-4 text-base-content/40 transition-transform duration-200"
            :class="{ 'rotate-180': isShopsDropsDropdownOpen }" />
        </div>
        <div v-else class="hidden">
          <button @click="toggleShopDropdsDropdown" class="p-2 rounded-lg hover:bg-base-300" title="Cards">

          </button>
        </div>

        <ul v-if="isShopsDropsDropdownOpen || isCollapsed" class="space-y-1"
          :class="{ 'ml-3 pl-2 border-l border-base-300': !isCollapsed && !isMobile }">
          <li v-for="item in shopDropItems" :key="item.route">
            <router-link :to="item.route" class="flex items-center px-2 py-2 text-sm rounded-lg transition-colors group"
              :class="[
                isCollapsed && !isMobile ? 'justify-center' : '',
                $route.path.startsWith(item.route)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-base-content hover:bg-base-300'
              ]" :title="isCollapsed && !isMobile ? item.label : ''" @click="isMobile && toggleMobileSidebar()">
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0"
                :class="[isCollapsed && !isMobile ? '' : 'mr-3']" />
              <span v-if="!isCollapsed || isMobile">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Other Sections -->
      <div class="mb-2">
        <ul class="space-y-1">
          <li v-for="item in otherItems" :key="item.route">
            <router-link :to="item.route" class="flex items-center px-2 py-2 text-sm rounded-lg transition-colors group"
              :class="[
                isCollapsed && !isMobile ? 'justify-center' : '',
                $route.path.startsWith(item.route)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-base-content hover:bg-base-300'
              ]" :title="isCollapsed && !isMobile ? item.label : ''" @click="isMobile && toggleMobileSidebar()">
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0"
                :class="[isCollapsed && !isMobile ? '' : 'mr-3']" />
              <span v-if="!isCollapsed || isMobile">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>



    </nav>


  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  UsersIcon,
  Bars3Icon,
  UserGroupIcon,
  NewspaperIcon as PostsIcon,
  ClockIcon as PendingPostsIcon,
  CalendarDaysIcon as ScheduledPostsIcon,

  ShoppingBagIcon as ShopIcon,
  ShoppingCartIcon as ShopCartIcon,

  PresentationChartLineIcon as FandomTrackerIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,

TagIcon
} from '@heroicons/vue/24/outline'
import HomeIcon from '@/icons/HomeIcon.vue'

const sidebar = ref(null)
const isCollapsed = ref(false)
const isSidebarOpen = ref(false)
const isMobile = ref(false)
const isCardsDropdownOpen = ref(true)
const isShopsDropsDropdownOpen = ref(true)
const isFandomsDropdownOpen = ref(true)

// Toggle sidebar collapse (desktop)
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebarCollapsed', isCollapsed.value)
}

// Toggle mobile sidebar (mobile)
const toggleMobileSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Toggle cards dropdown
const toggleCardsDropdown = () => {
  isCardsDropdownOpen.value = !isCardsDropdownOpen.value
}

const toggleShopDropdsDropdown = () => {
  isShopsDropsDropdownOpen.value = !isShopsDropsDropdownOpen.value
}

const toggleFandomsDropdown = () => {
  isFandomsDropdownOpen.value = !isFandomsDropdownOpen.value
}

// Handle responsive behavior
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isSidebarOpen.value = true
    // Restore collapsed state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      isCollapsed.value = savedState === 'true'
    }
  } else {
    isSidebarOpen.value = false
    isCollapsed.value = false
  }
}

// Close sidebar when clicking outside (mobile)
const handleClickOutside = (event) => {
  if (isMobile.value && isSidebarOpen.value && sidebar.value && !sidebar.value.contains(event.target)) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('click', handleClickOutside)
})

const generalItems = [
  { route: '/', label: 'Dashboard', icon: HomeIcon, exact: true },
  { route: '/users', label: 'Users', icon: UsersIcon },
  { route: '/categories-subcategories', label: 'Category and subcategory', icon: TagIcon },
  {route : '/radar-tracker', label: 'Radar tracker', icon: FandomTrackerIcon, exact: true}
]

const cmsItems = [
  { route: '/posts', label: 'All posts', icon: PostsIcon },


  { route: '/pending-posts', label: 'Pending posts', icon: PendingPostsIcon },
  {route: '/scheduled-posts', label: 'Scheduled posts', icon: ScheduledPostsIcon }
]

const fandomsItems = [
  { route: '/fandoms', label: 'Active fandoms', icon: UserGroupIcon },
  { route: '/fandoms/inactive', label: 'Inactive fandoms', icon: UserGroupIcon }
]

const shopDropItems = [
  { route: '/products', label: 'All products', icon: ShopIcon },
  { route: '/orders', label: 'Orders', icon: ShopCartIcon }
]

const otherItems = [



]



</script>

<style scoped>
.sidebar {
  transition: transform 0.3s ease, width 0.3s ease;
  will-change: transform, width;
}

/* Smooth transitions for all animated properties */
.sidebar * {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar styling */
.sidebar nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar nav::-webkit-scrollbar-thumb {
  background: hsl(var(--bc)/0.2);
  border-radius: 2px;
}

.sidebar nav::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--bc)/0.4);
}

/* Tooltip for collapsed items */
[title] {
  position: relative;
}

[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 4px 8px;
  background: hsl(var(--b1));
  color: hsl(var(--bc));
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  pointer-events: none;
}
</style>
