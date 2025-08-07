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
          <button @click="openAddCategoryModal" class="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Category</span>
          </button>
          <button @click="openAddSubcategoryModal" class="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Subcategory</span>
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

        <!-- Subcategory Filter -->
        <select v-model="selectedSubcategory" class="select select-bordered" :disabled="!selectedCategory">
          <option value="">All Subcategories</option>
          <option v-for="subcategory in filteredSubcategories" :value="subcategory.id">
            {{ subcategory.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Fandoms Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div v-for="fandom in filteredFandoms" :key="fandom.id"
        class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <figure class="px-4 pt-4">
          <img :src="fandom.image" :alt="fandom.name" class="rounded-xl h-48 w-full object-cover" />
        </figure>
        <div class="card-body p-4">
          <h2 class="card-title">{{ fandom.name }}</h2>
          <div class="flex flex-wrap gap-2 mb-2">
            <span class="badge badge-outline">{{ fandom.category }}</span>
            <span class="badge badge-outline" v-if="fandom.subcategory">{{ fandom.subcategory }}</span>
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

    <!-- Add Category Modal -->
    <AddCategoryModal v-if="showAddCategoryModal" @close="closeAddCategoryModal" @save="handleAddCategory" />

    <!-- Add Subcategory Modal -->
    <AddSubcategoryModal v-if="showAddSubcategoryModal" :categories="categories" @close="closeAddSubcategoryModal"
      @save="handleAddSubcategory" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddFandomModal from '../../components/admin/AddFandomModal.vue'
import AddCategoryModal from '../../components/admin/AddCategoryModal.vue'
import AddSubcategoryModal from '../../components/admin/AddSubcategoryModal.vue'

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

// Sample categories and subcategories data
const categories = ref([
  { id: 1, name: 'Movies' },
  { id: 2, name: 'TV Shows' },
  { id: 3, name: 'Books' },
  { id: 4, name: 'Games' }
])

const subcategories = ref([
  { id: 1, categoryId: 1, name: 'Action' },
  { id: 2, categoryId: 1, name: 'Comedy' },
  { id: 3, categoryId: 1, name: 'Sci-Fi' },
  { id: 4, categoryId: 2, name: 'Drama' },
  { id: 5, categoryId: 2, name: 'Fantasy' },
  { id: 6, categoryId: 3, name: 'Fiction' },
  { id: 7, categoryId: 3, name: 'Non-Fiction' },
  { id: 8, categoryId: 4, name: 'RPG' }
])

// Sample fandoms data
const fandoms = ref([
  {
    id: 1,
    name: 'Marvel Cinematic Universe',
    image: 'https://lumiere-a.akamaihd.net/v1/images/au_portrait_grid_marvel_logo_2025_mobile_1ad65200.png',
    category: 'Movies',
    subcategory: 'Action',
    memberCount: 12500,
    postCount: 3421,
    createdAt: '2020-05-15'
  },
  // More sample fandoms...
])

// Filtered subcategories based on selected category
const filteredSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  return subcategories.value.filter(sub => sub.categoryId == selectedCategory.value)
})

// Filtered fandoms based on search and filters
const filteredFandoms = computed(() => {
  return fandoms.value.filter(fandom => {
    // Search filter
    const matchesSearch = fandom.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Category filter
    const matchesCategory = !selectedCategory.value ||
      fandom.category.toLowerCase() === categories.value.find(c => c.id == selectedCategory.value)?.name.toLowerCase()

    // Subcategory filter
    const matchesSubcategory = !selectedSubcategory.value ||
      fandom.subcategory?.toLowerCase() === subcategories.value.find(s => s.id == selectedSubcategory.value)?.name.toLowerCase()

    return matchesSearch && matchesCategory && matchesSubcategory
  })
})

// Update subcategories when category changes
const updateSubcategories = () => {
  selectedSubcategory.value = ''
}

// Modal controls
const showAddFandomModal = ref(false)
const showAddCategoryModal = ref(false)
const showAddSubcategoryModal = ref(false)

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

const openAddCategoryModal = () => {
  showAddCategoryModal.value = true
}

const closeAddCategoryModal = () => {
  showAddCategoryModal.value = false
}

const handleAddCategory = (newCategory) => {
  categories.value.push({
    id: Date.now(),
    name: newCategory.name
  })
  closeAddCategoryModal()
}

const openAddSubcategoryModal = () => {
  showAddSubcategoryModal.value = true
}

const closeAddSubcategoryModal = () => {
  showAddSubcategoryModal.value = false
}

const handleAddSubcategory = (newSubcategory) => {
  subcategories.value.push({
    id: Date.now(),
    categoryId: newSubcategory.categoryId,
    name: newSubcategory.name
  })
  closeAddSubcategoryModal()
}

// Fetch data on mount
onMounted(() => {
  // In a real app, you would fetch this data from an API
  // fetchFandoms()
  // fetchCategories()
  // fetchSubcategories()
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
