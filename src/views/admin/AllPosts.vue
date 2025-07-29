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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <option v-for="subcategory in filteredSubcategories" :value="subcategory">
            {{ subcategory }}
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
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="post in filteredPosts" :key="post.id"
        class="card bg-base-100 shadow hover:shadow-lg transition-shadow">
        <figure class="relative h-48">
          <img :src="post.image" :alt="post.title" class="w-full h-full object-cover">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div class="flex flex-wrap gap-2">
              <span class="badge badge-primary">{{ post.fandom }}</span>
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
    <div v-else class="card bg-base-100 shadow overflow-hidden mb-6">
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
                <span class="badge badge-primary">{{ post.fandom }}</span>
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
import { ref, computed } from 'vue'

// View mode
const viewMode = ref('grid') // 'grid' or 'table'

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const dateFilter = ref('newest')
const currentPage = ref(1)
const postsPerPage = 12

// Sample data - replace with API calls
const categories = ref([
  { id: 'anime', name: 'Anime', subcategories: ['Shonen', 'Shojo', 'Seinen', 'Horror'] },
  { id: 'sports', name: 'Sports', subcategories: ['Football', 'Basketball', 'Tennis', 'Esports'] },
  { id: 'movies', name: 'Movies', subcategories: ['Action', 'Horror', 'Comedy', 'Sci-Fi'] },
  { id: 'gaming', name: 'Gaming', subcategories: ['RPG', 'FPS', 'MMO', 'Indie'] }
])

const posts = ref([
  {
    id: 1,
    title: 'Naruto Shippuden Rewatch Discussion',
    excerpt: 'Starting our rewatch of Naruto Shippuden next week! Join us for weekly discussions.',
    image: 'data:image/jpeg;base64,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',
    fandom: 'Naruto Fandom',
    category: 'anime',
    subcategory: 'Shonen',
    user: {
      id: 1,
      name: 'AnimeFan42',
      avatar: 'data:image/jpeg;base64,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'
    },
    createdAt: '2023-11-15T14:30:00Z',
    likes: 124,
    comments: 32
  },
  // More sample posts...
])

// Computed properties
const filteredSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  const category = categories.value.find(c => c.id === selectedCategory.value)
  return category ? category.subcategories : []
})

const filteredPosts = computed(() => {
  let result = [...posts.value]

  // Apply filters
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.fandom.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(post => post.category === selectedCategory.value)

    if (selectedSubcategory.value) {
      result = result.filter(post => post.subcategory === selectedSubcategory.value)
    }
  }

  // Apply date sorting/filtering
  switch (dateFilter.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'today':
      {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        result = result.filter(post => new Date(post.createdAt) >= today)
        break
      }
    case 'week':
      {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        result = result.filter(post => new Date(post.createdAt) >= weekAgo)
        break
      }
    case 'month':
      {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        result = result.filter(post => new Date(post.createdAt) >= monthAgo)
        break
      }
  }

  // Pagination
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return result.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(posts.value.length / postsPerPage)
})

// Methods
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Reset subcategory when category changes

</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
