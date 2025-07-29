<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="container mx-auto p-6">
    <!-- Header with Title and Buttons -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold">Drops Management</h1>
      <div class="flex flex-wrap gap-3">
        <button @click="openAddDropModal" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Schedule Drop</span>
        </button>
        <button @click="openPastDrops" class="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Past Drops</span>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs tabs-boxed bg-base-200 p-1 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ 'tab-active': activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-base-100 rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search drops..."
              class="input input-bordered w-full pl-10"
            />
            <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <!-- Status Filter -->
        <select v-model="selectedStatus" class="select select-bordered">
          <option value="">All Statuses</option>
          <option v-for="status in statusFilters" :value="status.value">
            {{ status.label }}
          </option>
        </select>

        <!-- Date Filter -->
        <select v-model="selectedDate" class="select select-bordered">
          <option value="">All Dates</option>
          <option v-for="date in dateFilters" :value="date.value">
            {{ date.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="flex justify-between items-center mb-4">
      <div class="text-sm text-base-content/60">
        Showing {{ filteredDrops.length }} upcoming drops
      </div>
      <div class="btn-group">
        <button
          @click="viewMode = 'grid'"
          class="btn btn-sm"
          :class="{ 'btn-active': viewMode === 'grid' }"
        >
          <Squares2X2Icon class="h-4 w-4" />
          Grid
        </button>
        <button
          @click="viewMode = 'table'"
          class="btn btn-sm"
          :class="{ 'btn-active': viewMode === 'table' }"
        >
          <TableCellsIcon class="h-4 w-4" />
          Table
        </button>
      </div>
    </div>

    <!-- Drops Grid View -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="drop in filteredDrops"
        :key="drop.id"
        class="card bg-base-100 shadow hover:shadow-lg transition-all border border-base-300/50"
      >
        <figure class="relative">
          <img
            :src="drop.image"
            :alt="drop.name"
            class="rounded-t-xl h-48 w-full object-cover"
          />
          <!-- Countdown Badge -->
          <div class="absolute top-2 right-2 badge badge-error gap-2">
            <ClockIcon class="h-4 w-4" />
            {{ formatCountdown(drop.releaseDate) }}
          </div>
          <!-- Status Badge -->
          <div class="absolute top-2 left-2 badge gap-2" :class="statusBadgeClass(drop.status)">
            {{ drop.status }}
          </div>
        </figure>
        <div class="card-body p-4">
          <h2 class="card-title">{{ drop.name }}</h2>
          <div class="flex items-center justify-between mt-2">
            <div class="text-sm">
              <div class="flex items-center gap-1">
                <CalendarIcon class="h-4 w-4" />
                {{ formatDate(drop.releaseDate) }}
              </div>
              <div class="flex items-center gap-1 mt-1">
                <TagIcon class="h-4 w-4" />
                {{ drop.category }}
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold">${{ drop.price.toFixed(2) }}</div>
              <div class="text-xs text-base-content/60">
                {{ drop.quantity }} available
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex justify-between text-xs mb-1">
              <span>Reservations: {{ drop.reservations }}/{{ drop.quantity }}</span>
              <span>{{ Math.round((drop.reservations / drop.quantity) * 100) }}%</span>
            </div>
            <progress
              class="progress progress-primary w-full"
              :value="drop.reservations"
              :max="drop.quantity"
            ></progress>
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-sm btn-outline">Edit</button>
            <button class="btn btn-sm btn-primary">View</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drops Table View -->
    <div v-if="viewMode === 'table'" class="bg-base-100 rounded-lg shadow overflow-hidden">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Product</th>
            <th>Status</th>
            <th>Release Date</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Reservations</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="drop in filteredDrops" :key="drop.id">
            <td>
              <div class="flex items-center gap-3">
                <div class="avatar">
                  <div class="w-12 h-12 rounded">
                    <img :src="drop.image" :alt="drop.name" />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{{ drop.name }}</div>
                  <div class="text-sm text-base-content/60">{{ drop.category }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge" :class="statusBadgeClass(drop.status)">
                {{ drop.status }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-1">
                <CalendarIcon class="h-4 w-4" />
                {{ formatDate(drop.releaseDate) }}
              </div>
              <div class="text-xs text-base-content/60">
                {{ formatCountdown(drop.releaseDate) }}
              </div>
            </td>
            <td>${{ drop.price.toFixed(2) }}</td>
            <td>{{ drop.quantity }}</td>
            <td>
              <div class="flex items-center gap-2">
                <span>{{ drop.reservations }}</span>
                <progress
                  class="progress progress-primary w-20"
                  :value="drop.reservations"
                  :max="drop.quantity"
                ></progress>
              </div>
            </td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-xs">
                  <PencilSquareIcon class="h-4 w-4" />
                </button>
                <button class="btn btn-ghost btn-xs">
                  <EyeIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredDrops.length === 0" class="text-center py-12">
      <div class="mx-auto w-24 h-24 text-base-content/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-medium">No drops found</h3>
      <p class="mt-1 text-base-content/60">Try adjusting your search or filters</p>
      <button @click="resetFilters" class="btn btn-primary mt-4">
        Reset Filters
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="filteredDrops.length > 0" class="flex justify-center mt-8">
      <div class="join">
        <button class="join-item btn" :disabled="currentPage === 1" @click="prevPage">
          «
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="join-item btn"
          :class="{ 'btn-active': page === currentPage }"
        >
          {{ page }}
        </button>
        <button class="join-item btn" :disabled="currentPage === totalPages" @click="nextPage">
          »
        </button>
      </div>
    </div>

    <!-- Add Drop Modal -->
    <AddDropModal
      v-if="showAddDropModal"
      @close="closeAddDropModal"
      @save="handleAddDrop"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  PencilSquareIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/vue/24/outline'
import AddDropModal from '../../components/drops/AddDropModal.vue'

// Tabs
const tabs = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' }
]
const activeTab = ref('upcoming')

// View mode
const viewMode = ref('grid') // 'grid' or 'table'

// Search and filters
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedDate = ref('')

const statusFilters = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'live', label: 'Live' },
  { value: 'ended', label: 'Ended' },
  { value: 'cancelled', label: 'Cancelled' }
]

const dateFilters = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
]

// Sample drops data
const drops = ref([
  {
    id: 1,
    name: 'Limited Edition Sneakers',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=400&fit=crop',
    category: 'Footwear',
    status: 'scheduled',
    price: 199.99,
    quantity: 500,
    reservations: 327,
    releaseDate: '2023-12-15T10:00:00'
  },
  {
    id: 2,
    name: 'Artist Collaboration Tee',
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=400&fit=crop',
    category: 'Apparel',
    status: 'live',
    price: 49.99,
    quantity: 1000,
    reservations: 892,
    releaseDate: '2023-11-30T12:00:00'
  },
  // More sample drops...
])

// Filtered drops
const filteredDrops = computed(() => {
  return drops.value.filter(drop => {
    // Tab filter
    const matchesTab =
      (activeTab.value === 'upcoming' && drop.status === 'scheduled') ||
      (activeTab.value === 'active' && drop.status === 'live') ||
      (activeTab.value === 'completed' && ['ended', 'cancelled'].includes(drop.status))

    // Search filter
    const matchesSearch = drop.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      drop.category.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Status filter
    const matchesStatus = !selectedStatus.value || drop.status === selectedStatus.value

    // Date filter (simplified)
    const matchesDate = true // Implement date filtering logic

    return matchesTab && matchesSearch && matchesStatus && matchesDate
  })
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

const totalPages = computed(() => {
  return Math.ceil(filteredDrops.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

// Modal controls
const showAddDropModal = ref(false)

const openAddDropModal = () => {
  showAddDropModal.value = true
}

const closeAddDropModal = () => {
  showAddDropModal.value = false
}

const handleAddDrop = (newDrop) => {
  drops.value.unshift(newDrop)
  closeAddDropModal()
}

// Helpers
const statusBadgeClass = (status) => {
  const classes = {
    scheduled: 'badge-info',
    live: 'badge-success',
    ended: 'badge-warning',
    cancelled: 'badge-error'
  }
  return classes[status] || 'badge-ghost'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCountdown = (dateString) => {
  const now = new Date()
  const releaseDate = new Date(dateString)
  const diff = releaseDate - now

  if (diff <= 0) return 'Live now!'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return `${days}d ${hours}h`
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedDate.value = ''
  currentPage.value = 1
}
</script>

<style scoped>
.card figure img {
  transition: transform 0.3s ease;
}

.card:hover figure img {
  transform: scale(1.03);
}

.progress {
  height: 6px;
}
</style>
