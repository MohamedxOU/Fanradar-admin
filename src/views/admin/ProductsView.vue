<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products Management</h1>

      <button class="btn btn-primary" @click="openAddProductModal">
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
    <div v-if="viewMode === 'grid'">
      <div v-if="loading" class="flex justify-center items-center h-40">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <div v-else-if="error" class="alert alert-error">{{ error }}</div>
      <div v-else-if="filteredProducts.length === 0" class="text-center text-gray-400 py-10">No products found.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="card bg-base-100 shadow hover:shadow-lg transition-shadow"
        >
          <figure class="px-4 pt-4 relative">
            <img
              :src="resolveMediaUrl(product.medias && product.medias.length > 0 ? product.medias[0] : null)"
              :alt="product.product_name"
              class="rounded-xl h-48 w-full object-cover"
            />
            <!-- Drop badge and countdown -->
            <template v-if="product.sale_end_date">
              <div class="absolute top-2 right-2 badge badge-error gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                {{ formatCountdown(product.sale_end_date) }}
              </div>
              <div class="absolute top-2 left-2 badge badge-info">Drop</div>
            </template>
          </figure>
          <div class="card-body p-4">
            <div class="flex justify-between items-start">
              <h2 class="card-title">{{ product.product_name }}</h2>
              <span class="badge" :class="typeBadgeClass(product.type)">
                {{ product.type || (product.sale_end_date ? 'Drop' : 'N/A') }}
              </span>
            </div>
            <p class="text-lg font-bold mt-2">${{ Number(product.price).toFixed(2) }}</p>
            <div class="flex justify-between mt-4">
              <span class="badge" :class="statusBadgeClass(product.content_status)">
                {{ product.content_status }}
              </span>
              <span class="text-sm">${{ product.revenue ? Number(product.revenue).toLocaleString() : '0' }}</span>
            </div>
            <div class="text-xs text-gray-500 mt-2">
              <template v-if="product.sale_end_date">
                Drop ends: {{ formatDate(product.sale_end_date) }}
              </template>
              <template v-else>
                Added {{ formatDate(product.created_at) }}
              </template>
            </div>
            <div v-if="product.sale_end_date" class="mt-2">
              <div class="flex justify-between text-xs mb-1">
                <span>Stock: {{ product.stock }}</span>
                <span>Revenue: ${{ product.revenue ? Number(product.revenue).toLocaleString() : '0' }}</span>
              </div>
              <progress
                class="progress progress-primary w-full"
                :value="product.revenue || 0"
                :max="product.stock * Number(product.price)"
              ></progress>
            </div>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-sm btn-outline" @click="openEditProductModal(product)">Edit</button>
              <button class="btn btn-sm btn-primary">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Table View -->
    <div v-if="viewMode === 'table'" class="bg-base-100 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center h-40">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <div v-else-if="error" class="alert alert-error">{{ error }}</div>
      <div v-else>
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
                      <img :src="resolveMediaUrl(product.medias && product.medias.length > 0 ? product.medias[0] : null)" :alt="product.product_name" />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ product.product_name }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" :class="typeBadgeClass(product.type)">
                  {{ product.type || 'N/A' }}
                </span>
              </td>
              <td>${{ Number(product.price).toFixed(2) }}</td>
              <td>
                <span class="badge" :class="statusBadgeClass(product.content_status)">
                  {{ product.content_status }}
                </span>
              </td>
              <td>${{ product.revenue ? Number(product.revenue).toLocaleString() : '0' }}</td>
              <td>
                <template v-if="product.sale_end_date">
                  {{ formatDate(product.sale_end_date) }}
                </template>
                <template v-else>
                  {{ formatDate(product.created_at) }}
                </template>
              </td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-ghost btn-xs" @click="openEditProductModal(product)">
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
        <div v-if="filteredProducts.length === 0" class="text-center text-gray-400 py-10">No products found.</div>
      </div>
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

    <!-- Modal Component -->
    <AddProductModal ref="addProductModalRef" @product-added="fetchProducts" />

    <!-- Update Product Modal -->
    <UpdateProductModal
      v-if="showEditProductModal"
      ref="editProductModalRef"
      :product="productToEdit"
      @close="closeEditProductModal"
      @updated="onProductUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddProductModal from '@/components/admin/AddProductModal.vue'
import UpdateProductModal from '@/components/admin/UpdateProductModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  PencilSquareIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { getProducts } from '@/api/product'

// Template ref for the modal
const addProductModalRef = ref(null)

// Function to open the modal
const openAddProductModal = () => {
  if (addProductModalRef.value) {
    addProductModalRef.value.openModal()
  }
}

// Tabs
const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Items', value: 'item' },
  { label: 'Services', value: 'service' },
  { label: 'Drops', value: 'drops' }
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

const products = ref([])
const loading = ref(false)
const error = ref(null)

// Pagination state from API
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(10)
const totalItems = ref(0)

const fetchProducts = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const res = await getProducts(page, sessionStorage.getItem('token') || localStorage.getItem('token'))
    products.value = res.data
    currentPage.value = res.current_page
    totalPages.value = res.last_page
    perPage.value = res.per_page
    totalItems.value = res.total
  } catch (err) {
    error.value = err.message || 'Failed to load products.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

// Filtered products (search, tab, category, date)
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Drops filter
    if (activeTab.value === 'drops' && !product.sale_end_date) return false
    if (activeTab.value !== 'drops' && activeTab.value !== 'all' && product.sale_end_date) return false

    // Tab filter (for item/service)
    const matchesTab =
      activeTab.value === 'all' ||
      activeTab.value === 'drops' ||
      product.type === activeTab.value

    // Search filter
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Category filter (by subcategory.category_id or subcategory.name)
    const matchesCategory = !selectedCategory.value || (product.subcategory && product.subcategory.name === selectedCategory.value)

    // Date filter (not implemented)
    const matchesDate = true

    return matchesTab && matchesSearch && matchesCategory && matchesDate
  })
})

// Pagination helpers for API
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
  if (currentPage.value > 1) {
    fetchProducts(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchProducts(currentPage.value + 1)
  }
}

const goToPage = (page) => {
  if (page !== currentPage.value) {
    fetchProducts(page)
  }
}

// Helpers
const typeBadgeClass = (type) => {
  return type === 'item' ? 'badge-primary' : 'badge-secondary'
}

const statusBadgeClass = (status) => {
  const classes = {
    published: 'badge-success',
    draft: 'badge-warning',
    archived: 'badge-error'
  }
  return classes[status] || 'badge-ghost'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Drop countdown helper
const formatCountdown = (dateString) => {
  const now = new Date()
  const end = new Date(dateString)
  const diff = end - now
  if (diff <= 0) return 'Ended'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return `${days}d ${hours}h`
}

// Helper to resolve media URL for Laravel storage
const resolveMediaUrl = (media) => {
  if (!media || !media.file_path) return '/public/images/test_logo.png'
  const url = media.file_path
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${import.meta.env.VITE_STORAGE_URL}/storage/${url}`
}

// Edit product modal
const showEditProductModal = ref(false)
const productToEdit = ref(null)

const openEditProductModal = (product) => {
  productToEdit.value = { ...product }
  showEditProductModal.value = true
  // Wait for modal to mount, then call openModal
  setTimeout(() => {
    if (editProductModalRef.value) {
      editProductModalRef.value.openModal()
    }
  }, 0)
}
const closeEditProductModal = () => {
  showEditProductModal.value = false
  productToEdit.value = null
}
const onProductUpdated = () => {
  closeEditProductModal()
  fetchProducts(currentPage.value)
}
const editProductModalRef = ref(null)
</script>

<style scoped>
.card figure img {
  transition: transform 0.3s ease;
}

.card:hover figure img {
  transform: scale(1.03);
}
</style>
