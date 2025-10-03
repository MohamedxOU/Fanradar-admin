<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="fandoms-container p-6">
      <!-- Header with Title and Buttons in one line -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 class="text-2xl font-bold">Inactive Fandoms Management</h1>
        <div class="flex flex-wrap gap-3">
          <router-link to="/fandoms" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Back to Active Fandoms</span>
          </router-link>
        </div>
      </div>

    <!-- Stats Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Inactive Fandoms Card -->
      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">Total Inactive Fandoms</h3>
            <p class="text-3xl font-bold mt-2">
              <span v-if="!loading">{{ formatNumber(fandoms.length) }}</span>
              <span v-else class="loading loading-spinner loading-md"></span>
            </p>
          </div>
          <div class="p-3 rounded-full bg-error/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Placeholder Cards -->
      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">Status</h3>
            <p class="text-lg font-bold mt-2 text-error">Inactive</p>
          </div>
          <div class="p-3 rounded-full bg-warning/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">Actions Available</h3>
            <p class="text-lg font-bold mt-2 text-info">Reactivate</p>
          </div>
          <div class="p-3 rounded-full bg-info/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-info" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters Section -->
    <div class="bg-base-100 shadow-md rounded-lg p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Search Field -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="Search inactive fandoms..."
            class="input input-bordered w-full pl-10" />
        </div>

        <!-- Category Filter -->
        <select v-model="selectedCategory" class="select select-bordered" @change="updateSubcategories">
          <option value="">All Categories</option>
          <option v-for="category in categories" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Fandoms Grid -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else-if="filteredFandoms.length === 0" class="text-center py-12">
      <div class="text-base-content/60">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
        </svg>
        <h3 class="text-lg font-semibold mb-2">No Inactive Fandoms Found</h3>
        <p>There are no inactive fandoms matching your search criteria.</p>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
      <div v-for="fandom in filteredFandoms" :key="fandom.id"
        class="relative group bg-base-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-base-200 fandom-card">
        <!-- Inactive Badge -->
        <div class="absolute top-3 right-3 z-20">
          <span class="badge badge-error badge-sm">Inactive</span>
        </div>
        
        <!-- Cover Image with Logo Overlay -->
        <div class="relative h-36 w-full bg-base-200">
          <img :src="fandom.cover_image" :alt="fandom.name + ' cover'" class="w-full h-full object-cover opacity-60" />
          <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10">
            <img :src="fandom.logo_image" :alt="fandom.name + ' logo'" class="rounded-full h-16 w-16 object-cover border-4 border-base-100 shadow-md bg-base-100 opacity-60" />
          </div>
        </div>
        <!-- Card Content -->
        <div class="pt-12 pb-4 px-5 flex flex-col gap-2">
          <div class="flex flex-col items-center text-center">
            <h2 class="font-bold text-lg leading-tight mb-1 line-clamp-1">{{ fandom.name }}</h2>
            <div class="text-base-content/60 text-xs mb-2 line-clamp-2 min-h-[2.5em]">{{ fandom.description }}</div>
          </div>
          <div class="flex flex-wrap justify-center gap-2 mb-1">
            <span v-if="fandom.subcategory" class="badge badge-outline badge-sm">{{ fandom.subcategory }}</span>
          </div>
          <div class="flex justify-between text-xs text-base-content/60 mb-1">
            <span><span class="font-semibold">{{ fandom.members_count }}</span> members</span>
            <span>{{ formatDate(fandom.created_at) }}</span>
          </div>
          <div class="flex justify-between text-xs text-base-content/60 mb-1">
            <span><span class="font-semibold">{{ fandom.posts_count }}</span> posts</span>
          </div>
          <div class="flex justify-between gap-2 mt-2">
            <button 
              @click="reactivateFandom(fandom)" 
              class="btn btn-xs btn-success"
              :disabled="updatingFandom === fandom.id"
            >
              <span v-if="updatingFandom === fandom.id" class="loading loading-spinner loading-xs"></span>
              <span v-else>Reactivate</span>
            </button>
            <div class="flex gap-2">
              <button class="btn btn-xs btn-primary">View</button>
              <button class="btn btn-xs btn-error" @click="handleDeleteFandom(fandom)">Delete</button>
            </div>
          </div>
        </div>
        <!-- Subtle hover overlay -->
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getInactiveFandoms, deleteFandomById, updateFandom } from '@/api/fandoms'
import { getCategories, getSubCategories } from '@/api/categoryAndSubCat'
import { useAuthStore } from '@/stores/auth'

// Search and filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')

const categories = ref([])
const subcategories = ref([])

// Fetch categories and subcategories
const fetchCategoriesAndSubcategories = async () => {
  try {
    const [catRes, subRes] = await Promise.all([
      getCategories(auth.token),
      getSubCategories(auth.token)
    ])
    const cats = Array.isArray(catRes) ? catRes : []
    const subs = Array.isArray(subRes) ? subRes : []
    // Attach subcategories to their parent category
    const catMap = cats.map(cat => ({ ...cat, subcategories: [] }))
    subs.forEach(sub => {
      const cat = catMap.find(c => c.id === sub.category_id)
      if (cat) {
        cat.subcategories.push(sub)
      }
    })
    categories.value = catMap
    subcategories.value = subs
  } catch (e) {
    console.error('Failed to fetch categories or subcategories', e)
    categories.value = []
    subcategories.value = []
  }
}

// Fandoms data
const fandoms = ref([])
const loading = ref(false)
const updatingFandom = ref(null)
const auth = useAuthStore()

// Fetch inactive fandoms from API
const fetchInactiveFandoms = async () => {
  loading.value = true
  try {
    const res = await getInactiveFandoms(auth.token)
    const resolveImg = (img) => {
      if (!img) return ''
      if (img.startsWith('http://') || img.startsWith('https://')) return img
      return `${import.meta.env.VITE_STORAGE_URL}/${img}`
    }
    fandoms.value = (res?.data?.fandoms || []).map(f => ({
      id: f.id,
      name: f.name,
      description: f.description,
      logo_image: resolveImg(f.logo_image),
      cover_image: resolveImg(f.cover_image),
      subcategory: f.subcategory?.name || '',
      created_at: f.created_at,
      posts_count: f.posts_count,
      members_count: f.members_count,
      isactive: f.isactive
    }))
  } catch (e) {
    console.error(e)
    fandoms.value = []
  } finally {
    loading.value = false
  }
}

// Filtered fandoms based on search and filters
const filteredFandoms = computed(() => {
  return fandoms.value.filter(fandom => {
    // Search filter
    const matchesSearch = fandom.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Category filter
    let matchesCategory = true
    if (selectedCategory.value) {
      const cat = categories.value.find(c => c.id == selectedCategory.value)
      matchesCategory = cat && cat.subcategories && cat.subcategories.some(sub => sub.name === fandom.subcategory)
    }

    return matchesSearch && matchesCategory
  })
})

// Update subcategories when category changes
const updateSubcategories = () => {
  selectedSubcategory.value = ''
}

// Formatting functions
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Reactivate fandom
const reactivateFandom = async (fandom) => {
  if (!confirm(`Are you sure you want to reactivate "${fandom.name}"?`)) return
  
  updatingFandom.value = fandom.id
  try {
    await updateFandom(fandom.id, { isactive: true }, auth.token)
    
    // Remove from current list
    fandoms.value = fandoms.value.filter(f => f.id !== fandom.id)
    
    alert(`"${fandom.name}" has been reactivated successfully!`)
  } catch (e) {
    console.error('Failed to reactivate fandom:', e)
    alert('Failed to reactivate fandom. Please try again.')
  } finally {
    updatingFandom.value = null
  }
}

// Delete fandom
const handleDeleteFandom = async (fandom) => {
  if (!confirm(`Are you sure you want to delete fandom "${fandom.name}"? This action cannot be undone.`)) return
  try {
    await deleteFandomById(fandom.id, auth.token)
    fandoms.value = fandoms.value.filter(f => f.id !== fandom.id)
    alert('Fandom deleted successfully!')
  } catch (e) {
    alert('Failed to delete fandom.')
    console.error('Failed to delete fandom', e)
  }
}

// Fetch data on mount
onMounted(() => {
  fetchInactiveFandoms()
  fetchCategoriesAndSubcategories()
})
</script>

<style scoped>
.fandoms-container {
  max-width: 100%;
  overflow-x: hidden;
}

.card figure img {
  transition: transform 0.3s ease;
}

.card:hover figure img {
  transform: scale(1.03);
}

/* Enhanced fandom card styles */
.fandom-card {
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.04);
  transition: box-shadow 0.2s, transform 0.2s;
}

.fandom-card:hover {
  box-shadow: 0 6px 24px 0 rgb(0 0 0 / 0.10);
  transform: translateY(-2px) scale(1.02);
}

.fandom-card .line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}

.fandom-card .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}

.fandom-card .min-h-\[2\.5em\] {
  min-height: 2.5em;
}
</style>