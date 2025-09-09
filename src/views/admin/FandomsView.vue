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
            <p class="text-3xl font-bold mt-2">{{ formatNumber(stats.totalFandoms) }}</p>
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
            <p class="text-3xl font-bold mt-2">{{ formatNumber(stats.totalPosts) }}</p>
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
            <p class="text-3xl font-bold mt-2">{{ formatNumber(stats.totalMedias) }}</p>
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
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div v-for="fandom in filteredFandoms" :key="fandom.id"
        class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <figure class="px-4 pt-4">
          <img :src="fandom.image" :alt="fandom.name" class="rounded-xl h-48 w-full object-cover" />
        </figure>
        <div class="card-body p-4">
          <h2 class="card-title">{{ fandom.name }}</h2>
          <div class="flex flex-wrap gap-2 mb-2">
            <span class="badge badge-outline">{{ fandom.subcategory }}</span>
          </div>
          <div class="flex justify-between text-sm text-base-content/60">
            <span>{{ fandom.memberCount }} members</span>
            <span>{{ formatDate(fandom.createdAt) }}</span>
          </div>
          <div class="mt-2 text-sm">
            <span class="font-medium">{{ fandom.postCount }}</span> posts
          </div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-sm btn-outline">Modify</button>
            <button class="btn btn-sm btn-primary">View</button>
          </div>
        </div>
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
import { getFandoms } from '@/api/fandoms'
import { getCategories, getSubCategories } from '@/api/categoryAndSubCat'
import { useAuthStore } from '@/stores/auth'

// Stats data
const stats = ref({
  totalFandoms: 1243,
  totalPosts: 45678,
  totalMedias: 23456
})

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
      getCategories(),
      getSubCategories()
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
    fandoms.value = (res?.data?.fandoms || []).map(f => ({
      id: f.id,
      name: f.name,
      description: f.description,
      image: f.logo_image || f.cover_image || '',
      subcategory: f.subcategory?.name || '',
      memberCount: f.members_count,
      postCount: f.posts_count,
      createdAt: f.created_at
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





// Fetch data on mount
onMounted(() => {
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
</style>
