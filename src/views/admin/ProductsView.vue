<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products Management</h1>
      <button class="btn btn-primary">
        <PlusIcon class="h-5 w-5" />
        Add Product
      </button>
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
              placeholder="Search products..."
              class="input input-bordered w-full pl-10"
            />
            <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <!-- Filters -->
        <select v-model="selectedCategory" class="select select-bordered">
          <option value="">All Categories</option>
          <option v-for="category in categories" :value="category.value">
            {{ category.label }}
          </option>
        </select>

        <select v-model="selectedDate" class="select select-bordered">
          <option value="">All Dates</option>
          <option v-for="date in dateFilters" :value="date.value">
            {{ date.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="flex justify-end mb-4">
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

    <!-- Products Grid View -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="card bg-base-100 shadow hover:shadow-lg transition-shadow"
      >
        <figure class="px-4 pt-4">
          <img
            :src="product.image"
            :alt="product.name"
            class="rounded-xl h-48 w-full object-cover"
          />
        </figure>
        <div class="card-body p-4">
          <div class="flex justify-between items-start">
            <h2 class="card-title">{{ product.name }}</h2>
            <span class="badge" :class="typeBadgeClass(product.type)">
              {{ product.type }}
            </span>
          </div>
          <p class="text-lg font-bold mt-2">${{ product.price.toFixed(2) }}</p>
          <div class="flex justify-between mt-4">
            <span class="badge" :class="statusBadgeClass(product.status)">
              {{ product.status }}
            </span>
            <span class="text-sm">${{ product.revenue.toLocaleString() }}</span>
          </div>
          <div class="text-xs text-gray-500 mt-2">
            Added {{ formatDate(product.createdAt) }}
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-sm btn-outline">Edit</button>
            <button class="btn btn-sm btn-primary">View</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Table View -->
    <div v-if="viewMode === 'table'" class="bg-base-100 rounded-lg shadow overflow-hidden">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Product</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th>Revenue</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>
              <div class="flex items-center gap-3">
                <div class="avatar">
                  <div class="w-12 h-12 rounded">
                    <img :src="product.image" :alt="product.name" />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{{ product.name }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge" :class="typeBadgeClass(product.type)">
                {{ product.type }}
              </span>
            </td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td>
              <span class="badge" :class="statusBadgeClass(product.status)">
                {{ product.status }}
              </span>
            </td>
            <td>${{ product.revenue.toLocaleString() }}</td>
            <td>{{ formatDate(product.createdAt) }}</td>
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

    <!-- Pagination -->
    <div class="flex justify-center mt-8">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  PencilSquareIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

// Tabs
const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Items', value: 'item' },
  { label: 'Services', value: 'service' }
]
const activeTab = ref('all')

// View mode
const viewMode = ref('grid') // 'grid' or 'table'

// Search and filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDate = ref('')

const categories = [
  { value: 'merchandise', label: 'Merchandise' },
  { value: 'digital', label: 'Digital Goods' },
  { value: 'subscription', label: 'Subscriptions' }
]

const dateFilters = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
]

// Sample products data
const products = ref([
  {
    id: 1,
    name: 'Limited Edition Poster',
    type: 'item',
    price: 24.99,
    status: 'active',
    revenue: 12450,
    createdAt: '2023-05-15',
    image: 'data:image/jpeg;base64,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',
    category: 'merchandise'
  },
  // More sample products...
])

// Filtered products
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Tab filter
    const matchesTab = activeTab.value === 'all' || product.type === activeTab.value

    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Category filter
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value

    // Date filter (simplified)
    const matchesDate = true // Implement date filtering logic

    return matchesTab && matchesSearch && matchesCategory && matchesDate
  })
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
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

// Helpers
const typeBadgeClass = (type) => {
  return type === 'item' ? 'badge-primary' : 'badge-secondary'
}

const statusBadgeClass = (status) => {
  const classes = {
    active: 'badge-success',
    draft: 'badge-warning',
    archived: 'badge-error'
  }
  return classes[status] || 'badge-ghost'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.card figure img {
  transition: transform 0.3s ease;
}

.card:hover figure img {
  transform: scale(1.03);
}
</style>
