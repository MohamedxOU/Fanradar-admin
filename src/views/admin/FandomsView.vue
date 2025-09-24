<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="fandoms-container p-6">
      <!-- Header with Title and Buttons in one line -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 class="text-2xl font-bold">Fandoms Management</h1>
        <div class="flex flex-wrap gap-3">
          <button @click="openAddFandomModal" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Fandom</span>
          </button>

      </div>

      <!-- Rest of your content goes here -->
    </div>
    <!-- Stats Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Fandoms Card -->
      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">Total Fandoms</h3>
            <p class="text-3xl font-bold mt-2">
              <span v-if="!statsLoading">{{ formatNumber(stats.totalFandoms) }}</span>
              <span v-else class="loading loading-spinner loading-md"></span>
            </p>
          </div>
          <div class="p-3 rounded-full bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Posts Card -->
      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">Total Posts</h3>
            <p class="text-3xl font-bold mt-2">
              <span v-if="!statsLoading">{{ formatNumber(stats.totalPosts) }}</span>
              <span v-else class="loading loading-spinner loading-md"></span>
            </p>
          </div>
          <div class="p-3 rounded-full bg-success/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Medias Card -->
      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">Total Medias</h3>
            <p class="text-3xl font-bold mt-2">
              <span v-if="!statsLoading">{{ formatNumber(stats.totalMedias) }}</span>
              <span v-else class="loading loading-spinner loading-md"></span>
            </p>
          </div>
          <div class="p-3 rounded-full bg-info/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-info" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
          <input v-model="searchQuery" type="text" placeholder="Search fandoms..."
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
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
      <div v-for="fandom in filteredFandoms" :key="fandom.id"
        class="relative group bg-base-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-base-200 fandom-card">
        <!-- Cover Image with Logo Overlay -->
        <div class="relative h-36 w-full bg-base-200">
          <img :src="fandom.cover_image" :alt="fandom.name + ' cover'" class="w-full h-full object-cover" />
          <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10">
            <img :src="fandom.logo_image" :alt="fandom.name + ' logo'" class="rounded-full h-16 w-16 object-cover border-4 border-base-100 shadow-md bg-base-100" />
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
          <div class="flex justify-end gap-2 mt-2">

            <button class="btn btn-xs btn-primary">View</button>
            <button class="btn btn-xs btn-error" @click="handleDeleteFandom(fandom)">Delete</button>
          </div>
        </div>
        <!-- Subtle hover overlay -->
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </div>



    <!-- Add Fandom Modal -->
    <AddFandomModal v-if="showAddFandomModal" :categories="categories" @close="closeAddFandomModal"
      @save="handleAddFandom" />


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddFandomModal from '../../components/admin/AddFandomModal.vue'
import { getFandoms, deleteFandomById } from '@/api/fandoms'
import { getCategories, getSubCategories } from '@/api/categoryAndSubCat'
import { getFandomCount, getPostCount, getMediaCount } from '@/api/stats'
import { useAuthStore } from '@/stores/auth'

// Stats data
const stats = ref({
  totalFandoms: 0,
  totalPosts: 0,
  totalMedias: 0
})
const statsLoading = ref(false)

const fetchStats = async () => {
  statsLoading.value = true
  try {
    const auth = useAuthStore()
    const [fandoms, posts, medias] = await Promise.all([
      getFandomCount(auth.token),
      getPostCount(auth.token),
      getMediaCount(auth.token)
    ])
    stats.value.totalFandoms = fandoms.fandom_count || fandoms.count || 0
    // posts: sum all counts in post_counts array
    if (Array.isArray(posts.post_counts)) {
      stats.value.totalPosts = posts.post_counts.reduce((sum, p) => sum + (p.count || 0), 0)
    } else {
      stats.value.totalPosts = posts.count || 0
    }
    // medias: sum all counts in media_counts array
    if (Array.isArray(medias.media_counts)) {
      stats.value.totalMedias = medias.media_counts.reduce((sum, m) => sum + (m.count || 0), 0)
    } else {
      stats.value.totalMedias = medias.count || 0
    }
  } catch (e) {
    stats.value.totalFandoms = 0
    stats.value.totalPosts = 0
    stats.value.totalMedias = 0
    console.error('Failed to fetch stats', e)
  } finally {
    statsLoading.value = false
  }
}

// Search and filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')

const categories = ref([])
const subcategories = ref([])

// Fetch categories and subcategories, grouping subcategories by category as in CategorySubCatView
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
const auth = useAuthStore()

// Fetch fandoms from API
const fetchFandoms = async () => {
  loading.value = true
  try {
    const res = await getFandoms(auth.token)
    // API: { success, data: { fandoms: [...] } }
    const resolveImg = (img) => {
      if (!img) return ''
      if (img.startsWith('http://') || img.startsWith('https://')) return img
      // Always prepend backend URL for storage paths
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
      members_count: f.members_count
    }))
  } catch (e) {
    console.error(e)
    fandoms.value = []
    // Optionally show error
  } finally {
    loading.value = false
  }
}


// Filtered fandoms based on search and filters
const filteredFandoms = computed(() => {
  return fandoms.value.filter(fandom => {
          // Search filter
          const matchesSearch = fandom.name.toLowerCase().includes(searchQuery.value.toLowerCase())

          // Category filter: check if fandom's subcategory belongs to selected category
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

// Modal controls
const showAddFandomModal = ref(false)


// Formatting functions
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Modal methods
const openAddFandomModal = () => {
  showAddFandomModal.value = true
}

const closeAddFandomModal = () => {
  showAddFandomModal.value = false
}

const handleAddFandom = (newFandom) => {
  fandoms.value.unshift(newFandom)
  stats.value.totalFandoms++
  closeAddFandomModal()
}


const handleDeleteFandom = async (fandom) => {
  if (!confirm(`Are you sure you want to delete fandom "${fandom.name}"?`)) return
  try {
    await deleteFandomById(fandom.id, auth.token)
    fandoms.value = fandoms.value.filter(f => f.id !== fandom.id)
    stats.value.totalFandoms--
  } catch (e) {
    alert('Failed to delete fandom.')
    console.error('Failed to delete fandom', e)
  }
}



// Fetch data on mount
onMounted(() => {
  fetchStats()
  fetchFandoms()
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
}
.fandom-card .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.fandom-card .min-h-\[2\.5em\] {
  min-height: 2.5em;
}
</style>
