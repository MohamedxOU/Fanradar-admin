<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="container mx-auto p-4">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-base-content">All Posts</h1>
        <p class="text-sm text-base-content/60 mt-1">
          Browse through all community posts
        </p>
      </div>
      <div class="flex gap-2">
        <button @click="viewMode = 'grid'" class="btn btn-ghost" :class="{ 'btn-active': viewMode === 'grid' }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Grid
        </button>
        <button @click="viewMode = 'table'" class="btn btn-ghost" :class="{ 'btn-active': viewMode === 'table' }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Table
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card bg-base-100 shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Fandom Filter -->
        <select v-model="selectedFandom" class="select select-bordered bg-base-200 text-base-content">
          <option value="">All Fandoms</option>
          <option v-for="fandom in fandomsList" :key="fandom.id" :value="fandom.id">
            {{ fandom.name }}
          </option>
        </select>
        <!-- Category Filter -->
        <select v-model="selectedCategory" class="select select-bordered bg-base-200 text-base-content">
          <option value="">All Categories</option>
          <option v-for="category in categories" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <!-- Subcategory Filter -->
        <select v-model="selectedSubcategory" class="select select-bordered bg-base-200 text-base-content"
          :disabled="!selectedCategory">
          <option value="">All Subcategories</option>
          <option v-for="subcategory in filteredSubcategories" :key="subcategory.id" :value="subcategory.name">
            {{ subcategory.name }}
          </option>
        </select>

        <!-- Date Filter -->
        <select v-model="dateFilter" class="select select-bordered bg-base-200 text-base-content">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <!-- Search -->
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Search posts..."
            class="input input-bordered w-full bg-base-200 text-base-content pl-10" />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-base-content/60" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="post in filteredPosts" :key="post.id"
        class="card bg-base-100 shadow hover:shadow-lg transition-shadow">
        <figure class="relative h-48">
          <img :src="post.image" :alt="post.title" class="w-full h-full object-cover">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div class="flex flex-wrap gap-2">
              <span class="badge badge-primary">{{ post.fandom || (post.fandom_id ? 'Unknown Fandom' : '') }}</span>
              <span class="badge badge-secondary">{{ post.category }}</span>
              <span class="badge badge-accent" v-if="post.subcategory">{{ post.subcategory }}</span>
            </div>
          </div>
        </figure>
        <div class="card-body p-4">
          <h2 class="card-title text-base-content">{{ post.title }}</h2>
          <p class="text-base-content/70 line-clamp-2">{{ post.excerpt }}</p>
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-2">
              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img :src="post.user.avatar" :alt="post.user.name" />
                </div>
              </div>
              <span class="text-sm text-base-content/80">{{ post.user.name }}</span>
            </div>
            <span class="text-xs text-base-content/50">{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else-if="!loading" class="card bg-base-100 shadow overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr class="bg-base-200">
              <th class="text-base-content">Post</th>
              <th class="text-base-content">Fandom</th>
              <th class="text-base-content">Category</th>
              <th class="text-base-content">Subcategory</th>
              <th class="text-base-content">User</th>
              <th class="text-base-content">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-base-200/50">
              <td>
                <div class="flex items-center gap-4">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded">
                      <img :src="post.image" :alt="post.title" />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold text-base-content">{{ post.title }}</div>
                    <div class="text-sm text-base-content/60 line-clamp-1">{{ post.excerpt }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge badge-primary">{{ post.fandom || (post.fandom_id ? 'Unknown Fandom' : '') }}</span>
              </td>
              <td>
                <span class="badge badge-secondary">{{ post.category }}</span>
              </td>
              <td>
                <span class="badge badge-accent" v-if="post.subcategory">{{ post.subcategory }}</span>
                <span v-else class="text-base-content/60">-</span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="avatar">
                    <div class="w-6 rounded-full">
                      <img :src="post.user.avatar" :alt="post.user.name" />
                    </div>
                  </div>
                  <span>{{ post.user.name }}</span>
                </div>
              </td>
              <td>
                <span class="text-sm text-base-content/80">{{ formatDate(post.createdAt) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPosts.length === 0" class="card bg-base-100 shadow text-center py-12">
      <div class="mx-auto w-24 h-24 text-base-content/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-medium text-base-content">No posts found</h3>
      <p class="mt-1 text-base-content/60">Try adjusting your filters or search query</p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredPosts.length > 0" class="flex justify-center mt-6">
      <div class="join">
        <button class="join-item btn" :class="{ 'btn-disabled': currentPage === 1 }" @click="prevPage">«</button>
        <button class="join-item btn" v-for="page in totalPages" :key="page" @click="currentPage = page"
          :class="{ 'btn-active': currentPage === page }">
          {{ page }}
        </button>
        <button class="join-item btn" :class="{ 'btn-disabled': currentPage === totalPages }"
          @click="nextPage">»</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getPosts } from '@/api/posts'
import { getCategories, getSubCategories } from '@/api/categoryAndSubCat'
import {  getFandomById, getFandoms } from '@/api/fandoms'

// View mode
const viewMode = ref('grid') // 'grid' or 'table'

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const selectedFandom = ref('')
const dateFilter = ref('newest')
const currentPage = ref(1)

// API data
const posts = ref([])
const totalPosts = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

// Categories and subcategories from API
const categories = ref([])
const subcategories = ref([])

const filteredSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  return subcategories.value.filter(sc => sc.category_id === Number(selectedCategory.value))
})

const fetchCategoriesAndSubcategories = async () => {
  try {
    const [cats, subcats] = await Promise.all([
      getCategories(),
      getSubCategories()
    ])
    categories.value = cats
    subcategories.value = subcats
  } catch {
    // Optionally handle error
  }
}

// Fandoms cache to avoid duplicate requests
const fandomsCache = ref({})
const fandomsList = ref([])
const fetchFandomForPost = async (fandomId) => {
  if (!fandomId) return null
  if (fandomsCache.value[fandomId]) return fandomsCache.value[fandomId]
  try {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || ''

    const response = await getFandomById(fandomId, token)

    console.log('Fandom API response:', response)
    console.log('Response data structure:', response?.data)

    // The response structure is: response.data.fandom
    const fandom = response?.data?.fandom

    if (fandom && fandom.name) {
      console.log('Found fandom:', fandom.name)
      fandomsCache.value[fandomId] = fandom
      if (!fandomsList.value.some(f => f.id === fandom.id)) {
        fandomsList.value.push(fandom)
      }
      return fandom
    } else {
      console.log('Fandom not found in response, using fallback')
      fandomsCache.value[fandomId] = { id: fandomId, name: 'Unknown' }
      return fandomsCache.value[fandomId]
    }
  } catch (error) {
    console.error('Error fetching fandom:', error)
    fandomsCache.value[fandomId] = { id: fandomId, name: 'Unknown' }
    return fandomsCache.value[fandomId]
  }
}
const fetchFandoms = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || ''
    const response = await getFandoms(token)
    fandomsList.value = response?.data?.fandoms || []
  } catch {
    fandomsList.value = []
  }
}

const fetchPosts = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await getPosts(currentPage.value)
    const postsArr = res.data || []
    // Fetch fandom details for posts with fandom_id
    const fandomIds = [...new Set(postsArr.map(p => p.fandom_id).filter(Boolean))]
    await Promise.all(fandomIds.map(fid => fetchFandomForPost(fid)))
    posts.value = postsArr.map(post => {
      // Compose user name from first_name and last_name
      const userName = post.user ? `${post.user.first_name || ''} ${post.user.last_name || ''}`.trim() : ''
      // Use profile_image directly if it's a full URL, else prepend storage URL
      let avatar = ''
      if (post.user && post.user.profile_image) {
        avatar = post.user.profile_image.startsWith('http')
          ? post.user.profile_image
          : `${import.meta.env.VITE_STORAGE_URL}/${post.user.profile_image}`
      }
      // Use first media as image if available
      let image = ''
      if (post.medias && post.medias.length > 0) {
        image = post.medias[0].file_path
          ? (post.medias[0].file_path.startsWith('http')
              ? post.medias[0].file_path
              : `${import.meta.env.VITE_STORAGE_URL}/${post.medias[0].file_path}`)
          : ''
      }
      // Find category and subcategory names
      let categoryName = ''
      let subcategoryName = ''
      if (subcategories.value.length && post.subcategory_id) {
        const subcat = subcategories.value.find(sc => sc.id === post.subcategory_id)
        if (subcat) {
          subcategoryName = subcat.name
          const cat = categories.value.find(c => c.id === subcat.category_id)
          if (cat) categoryName = cat.name
        }
      } else if (categories.value.length && post.category_id) {
        const cat = categories.value.find(c => c.id === post.category_id)
        if (cat) categoryName = cat.name
      }
      // Get fandom details from cache
      let fandomName = ''
      if (!post.fandom_id) {
        fandomName = 'General'
      } else if (fandomsCache.value[post.fandom_id] && fandomsCache.value[post.fandom_id].name) {
        fandomName = fandomsCache.value[post.fandom_id].name
      } else {
        fandomName = 'Unknown'
      }
      return {
        id: post.id,
        title: post.description ? post.description.slice(0, 40) + (post.description.length > 40 ? '...' : '') : 'Untitled',
        excerpt: post.description || '',
        image,
        fandom: fandomName,
        category: categoryName,
        subcategory: subcategoryName,
        user: {
          id: post.user?.id || post.user_id || '',
          name: userName,
          avatar
        },
        createdAt: post.created_at || '',
        status: post.content_status || '',
        feedback: post.feedback || 0,
        scheduleAt: post.schedule_at || '',
      }
    })
    totalPosts.value = res.total || 0
    totalPages.value = res.last_page || 1
  } catch (e) {
    error.value = e?.message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCategoriesAndSubcategories()
  await fetchFandoms()
  await fetchPosts()
})
watch(currentPage, fetchPosts)

const filteredPosts = computed(() => {
  let result = [...posts.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post =>
      (post.title || '').toLowerCase().includes(query) ||
      (post.excerpt || '').toLowerCase().includes(query) ||
      (post.fandom || '').toLowerCase().includes(query)
    )
  }
  if (selectedFandom.value) {
    result = result.filter(post => String(post.fandom_id) === String(selectedFandom.value))
  }
  if (selectedCategory.value) {
    // Filter by category id (not name)
    result = result.filter(post => {
      // Find the category for the post's subcategory
      const subcat = subcategories.value.find(sc => sc.name === post.subcategory)
      return subcat && subcat.category_id === Number(selectedCategory.value)
    })
    if (selectedSubcategory.value) {
      result = result.filter(post => post.subcategory === selectedSubcategory.value)
    }
  }
  switch (dateFilter.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'today': {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      result = result.filter(post => new Date(post.createdAt) >= today)
      break
    }
    case 'week': {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      result = result.filter(post => new Date(post.createdAt) >= weekAgo)
      break
    }
    case 'month': {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      result = result.filter(post => new Date(post.createdAt) >= monthAgo)
      break
    }
  }
  return result
})


const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
