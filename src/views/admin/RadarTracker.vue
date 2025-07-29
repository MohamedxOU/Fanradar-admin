<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-base-content">Fandom Radar Tracker</h1>
        <p class="text-sm text-base-content/60 mt-1">
          Monitor trending topics across fandoms
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button @click="showAddForm = !showAddForm" class="btn btn-primary">
          <span>Add Keyword</span>
        </button>
        <button @click="fetchTrendingHashtags" class="btn btn-outline">
          <span>Import Trends</span>
        </button>
      </div>
    </div>

    <!-- Add Keyword Form -->
    <div v-if="showAddForm" class="card bg-base-100 shadow p-4 mb-6">
      <h3 class="font-bold mb-3 text-base-content">Add New Keyword</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="newKeyword.term"
          type="text"
          placeholder="Keyword or hashtag"
          class="input input-bordered bg-base-200 text-base-content"
        />

        <select
          v-model="newKeyword.category"
          class="select select-bordered bg-base-200 text-base-content"
        >
          <option value="">Select category</option>
          <option v-for="category in categories" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <select
          v-model="newKeyword.source"
          class="select select-bordered bg-base-200 text-base-content"
        >
          <option value="manual">Manual</option>
          <option value="twitter">Twitter</option>
          <option value="reddit">Reddit</option>
        </select>

        <button @click="addKeyword" class="btn btn-primary">Add</button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card bg-base-100 shadow" v-for="stat in statCards" :key="stat.title">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-medium text-base-content/60">{{ stat.title }}</h2>
              <p class="text-3xl font-bold mt-1 text-base-content">{{ stat.value }}</p>
            </div>
            <div class="p-3 rounded-full" :class="stat.bgColor">
              <span :class="stat.iconColor">{{ stat.icon }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card bg-base-100 shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search keywords..."
          class="input input-bordered bg-base-200 text-base-content"
        />

        <select
          v-model="selectedCategory"
          class="select select-bordered bg-base-200 text-base-content"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <select
          v-model="selectedSource"
          class="select select-bordered bg-base-200 text-base-content"
        >
          <option value="">All Sources</option>
          <option v-for="source in sources" :value="source">
            {{ source }}
          </option>
        </select>

        <select
          v-model="activeTab"
          class="select select-bordered bg-base-200 text-base-content"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="monitoring">Monitoring</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>

    <!-- Keywords Table -->
    <div class="card bg-base-100 shadow overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr class="bg-base-200">
              <th class="text-base-content">Keyword</th>
              <th class="text-base-content">Category</th>
              <th class="text-base-content">Source</th>
              <th class="text-base-content">Trend Score</th>
              <th class="text-base-content">Status</th>
              <th class="text-base-content">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="keyword in filteredKeywords"
              :key="keyword.id"
              class="hover:bg-base-200/50"
            >
              <td>
                <div class="font-bold text-base-content">{{ keyword.term }}</div>
                <div class="text-sm text-base-content/60">
                  {{ keyword.type === 'hashtag' ? '#' : '' }}{{ keyword.term }}
                </div>
              </td>
              <td>
                <span class="badge" :class="categoryBadgeClass(keyword.category)">
                  {{ getCategoryName(keyword.category) }}
                </span>
              </td>
              <td>
                <span class="capitalize text-base-content">{{ keyword.source || 'manual' }}</span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="radial-progress text-primary"
                    :style="`--value:${keyword.trendScore}; --size:2rem; --thickness: 3px;`">
                    {{ keyword.trendScore }}
                  </div>
                  <span
                    v-if="keyword.trendChange > 0"
                    class="text-success flex items-center gap-1"
                  >
                    ↑ {{ keyword.trendChange }}%
                  </span>
                  <span
                    v-else-if="keyword.trendChange < 0"
                    class="text-error flex items-center gap-1"
                  >
                    ↓ {{ Math.abs(keyword.trendChange) }}%
                  </span>
                </div>
              </td>
              <td>
                <span class="badge" :class="statusBadgeClass(keyword.status)">
                  {{ keyword.status }}
                </span>
              </td>
              <td>
                <div class="flex gap-2">
                  <button
                    @click="toggleKeywordStatus(keyword)"
                    class="btn btn-xs"
                    :class="keyword.status === 'active' ? 'btn-warning' : 'btn-success'"
                  >
                    {{ keyword.status === 'active' ? 'Archive' : 'Activate' }}
                  </button>
                  <button
                    @click="deleteKeyword(keyword)"
                    class="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredKeywords.length === 0" class="card bg-base-100 shadow text-center py-12">
      <h3 class="mt-4 text-lg font-medium text-base-content">No keywords found</h3>
      <p class="mt-1 text-base-content/60">Try adding new keywords or adjusting your filters</p>
      <button @click="showAddForm = true" class="btn btn-primary mt-4">
        Add Keyword
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Tabs
const activeTab = ref('all')

// Search and filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedSource = ref('')
const showAddForm = ref(false)

// Sample data
const categories = ref([
  { id: 'kpop', name: 'K-Pop' },
  { id: 'anime', name: 'Anime' },
  { id: 'sports', name: 'Sports' },
  { id: 'movies', name: 'Movies' },
  { id: 'gaming', name: 'Gaming' }
])

const sources = ['twitter', 'reddit', 'manual']

const keywords = ref([
  {
    id: 1,
    term: 'BTS',
    type: 'keyword',
    category: 'kpop',
    source: 'twitter',
    trendScore: 85,
    trendChange: 12,
    status: 'active'
  },
  {
    id: 2,
    term: 'DemonSlayer',
    type: 'hashtag',
    category: 'anime',
    source: 'reddit',
    trendScore: 72,
    trendChange: -5,
    status: 'active'
  },
  {
    id: 3,
    term: 'WorldCup',
    type: 'hashtag',
    category: 'sports',
    source: 'twitter',
    trendScore: 68,
    trendChange: 8,
    status: 'monitoring'
  }
])

// New keyword form
const newKeyword = ref({
  term: '',
  category: '',
  source: 'manual',
  type: 'keyword'
})

// Stats cards
const statCards = computed(() => [
  {
    title: 'Total Keywords',
    value: keywords.value.length,
    icon: '#',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    title: 'Trending Now',
    value: keywords.value.filter(k => k.trendScore > 70).length,
    icon: '↑',
    bgColor: 'bg-success/10',
    iconColor: 'text-success'
  },
  {
    title: 'New This Week',
    value: Math.floor(keywords.value.length * 0.3),
    icon: '★',
    bgColor: 'bg-info/10',
    iconColor: 'text-info'
  },
  {
    title: 'Top Category',
    value: 'K-Pop',
    icon: '🏆',
    bgColor: 'bg-warning/10',
    iconColor: 'text-warning'
  }
])

// Filtered keywords
const filteredKeywords = computed(() => {
  return keywords.value.filter(keyword => {
    const matchesTab = activeTab.value === 'all' || keyword.status === activeTab.value
    const matchesSearch = keyword.term.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || keyword.category === selectedCategory.value
    const matchesSource = !selectedSource.value || keyword.source === selectedSource.value

    return matchesTab && matchesSearch && matchesCategory && matchesSource
  })
})

// Keyword actions
const addKeyword = () => {
  if (!newKeyword.value.term) return

  keywords.value.unshift({
    id: Date.now(),
    term: newKeyword.value.term,
    type: newKeyword.value.term.startsWith('#') ? 'hashtag' : 'keyword',
    category: newKeyword.value.category || 'other',
    source: newKeyword.value.source,
    trendScore: Math.floor(Math.random() * 50) + 50,
    trendChange: (Math.random() * 20 - 10).toFixed(1),
    status: 'active'
  })

  // Reset form
  newKeyword.value = {
    term: '',
    category: '',
    source: 'manual',
    type: 'keyword'
  }
  showAddForm.value = false
}

const fetchTrendingHashtags = () => {
  // Simulate importing trending hashtags
  const mockImports = [
    { term: 'StrayKids', category: 'kpop', source: 'twitter' },
    { term: 'OnePiece', category: 'anime', source: 'twitter' },
    { term: 'NBA', category: 'sports', source: 'reddit' }
  ]

  mockImports.forEach(item => {
    keywords.value.unshift({
      id: Date.now() + Math.random(),
      term: item.term,
      type: 'hashtag',
      category: item.category,
      source: item.source,
      trendScore: Math.floor(Math.random() * 100),
      trendChange: (Math.random() * 20 - 5).toFixed(1),
      status: 'active'
    })
  })
}

const toggleKeywordStatus = (keyword) => {
  keyword.status = keyword.status === 'active' ? 'archived' : 'active'
}

const deleteKeyword = (keyword) => {
  if (confirm(`Delete "${keyword.term}"?`)) {
    keywords.value = keywords.value.filter(k => k.id !== keyword.id)
  }
}

// Helpers
const getCategoryName = (categoryId) => {
  return categories.value.find(c => c.id === categoryId)?.name || categoryId
}

const categoryBadgeClass = (categoryId) => {
  const classes = {
    kpop: 'badge-primary',
    anime: 'badge-secondary',
    sports: 'badge-accent',
    movies: 'badge-info',
    gaming: 'badge-success'
  }
  return classes[categoryId] || 'badge-ghost'
}

const statusBadgeClass = (status) => {
  const classes = {
    active: 'badge-success',
    monitoring: 'badge-info',
    archived: 'badge-error'
  }
  return classes[status] || 'badge-ghost'
}
</script>

<style scoped>
.radial-progress {
  --value: 0;
  --size: 2rem;
  --thickness: 3px;
}
</style>
