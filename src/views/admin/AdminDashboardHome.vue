<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Analytics Dashboard</h1>

    <!-- Date Range Selector -->
    <div class="flex justify-end mb-6">
      <select v-model="selectedRange" class="select select-bordered max-w-xs">
        <option value="7">Last 7 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="90">Last Quarter</option>
        <option value="365">Last Year</option>
      </select>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Site Traffic -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="card-title text-sm">Site Traffic</h2>
              <p class="text-3xl font-bold">{{ formatNumber(stats.traffic.total) }}</p>
              <div class="flex items-center mt-2">
                <span :class="stats.traffic.change >= 0 ? 'text-success' : 'text-error'">
                  {{ stats.traffic.change >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.traffic.change) }}%
                </span>
                <span class="text-sm text-gray-500 ml-1">vs previous period</span>
              </div>
            </div>
            <div class="p-3 rounded-full bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Trending Content -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="card-title text-sm">Trending Posts</h2>
              <p class="text-3xl font-bold">{{ formatNumber(stats.trending.count) }}</p>
              <p class="text-sm mt-2">Top: {{ stats.trending.topPost }}</p>
            </div>
            <div class="p-3 rounded-full bg-success/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Fan Contributions -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="card-title text-sm">Fan Contributions</h2>
              <p class="text-3xl font-bold">{{ formatNumber(stats.contributions.total) }}</p>
              <div class="flex items-center mt-2">
                <span class="text-sm text-gray-500">{{ stats.contributions.topType }}: {{ stats.contributions.topCount }}</span>
              </div>
            </div>
            <div class="p-3 rounded-full bg-info/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Subscribers -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="card-title text-sm">Newsletter Subs</h2>
              <p class="text-3xl font-bold">{{ formatNumber(stats.newsletter.total) }}</p>
              <div class="flex items-center mt-2">
                <span class="text-success">+{{ stats.newsletter.newThisPeriod }}</span>
                <span class="text-sm text-gray-500 ml-1">new</span>
              </div>
            </div>
            <div class="p-3 rounded-full bg-warning/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Traffic Chart -->
      <div class="card bg-base-100 shadow p-6">
        <h2 class="text-lg font-bold mb-4">Site Traffic</h2>
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <canvas ref="trafficChart" class="w-full h-full"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-4 text-center">
          <div v-for="(source, index) in stats.traffic.sources" :key="index" class="text-sm">
            <p class="font-medium">{{ source.percentage }}%</p>
            <p class="text-gray-500">{{ source.name }}</p>
          </div>
        </div>
      </div>

      <!-- Top Fandoms -->
      <div class="card bg-base-100 shadow p-6">
        <h2 class="text-lg font-bold mb-4">Top Fandoms</h2>
        <div class="space-y-4">
          <div v-for="(fandom, index) in stats.topFandoms" :key="index" class="flex items-center">
            <div class="w-8 text-center font-medium">{{ index + 1 }}.</div>
            <div class="flex-1">
              <p class="font-medium">{{ fandom.name }}</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" :style="`width: ${fandom.percentage}%`"></div>
              </div>
            </div>
            <div class="w-16 text-right text-sm">{{ fandom.engagement }} </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card bg-base-100 shadow p-6">
      <h2 class="text-lg font-bold mb-4">Recent Activity</h2>
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Type</th>
              <th>Item</th>
              <th>User</th>
              <th>Time</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(activity, index) in stats.recentActivity" :key="index">
              <td>
                <span class="badge" :class="activityBadgeClass(activity.type)">
                  {{ activity.type }}
                </span>
              </td>
              <td>{{ activity.item }}</td>
              <td>{{ activity.user }}</td>
              <td>{{ activity.time }}</td>
              <td>{{ activity.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const selectedRange = ref('7')
const trafficChart = ref(null)
let chartInstance = null
const getTrafficChartData = () => {
  // Mock: generate traffic data for the selected range
  // For demo, just use random data
  const days = Number(selectedRange.value)
  const labels = Array.from({ length: days }, (_, i) => `Day ${i + 1}`)
  // Simulate traffic numbers
  const base = stats.value.traffic.total / days
  const data = labels.map((_, i) => Math.round(base + Math.sin(i / 2) * base * 0.2 + Math.random() * base * 0.1))
  return { labels, data }
}

const renderTrafficChart = () => {
  if (!trafficChart.value) return
  const ctx = trafficChart.value.getContext('2d')
  const { labels, data } = getTrafficChartData()
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Site Traffic',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
      }
    }
  })
}

onMounted(() => {
  renderTrafficChart()
})

watch(selectedRange, () => {
  renderTrafficChart()
})

const stats = ref({
  traffic: {
    total: 12543,
    change: 12.5,
    sources: [
      { name: 'Direct', percentage: 45 },
      { name: 'Social', percentage: 30 },
      { name: 'Search', percentage: 25 }
    ]
  },
  trending: {
    count: 342,
    topPost: "Marvel's Phase 5 Announcement"
  },
  contributions: {
    total: 876,
    topType: 'Fan Art',
    topCount: 423
  },
  newsletter: {
    total: 5243,
    newThisPeriod: 243
  },
  topFandoms: [
    { name: 'Marvel Cinematic Universe', engagement: 12543, percentage: 100 },
    { name: 'Star Wars', engagement: 9872, percentage: 78 },
    { name: 'K-Pop Global', engagement: 7654, percentage: 61 },
    { name: 'Anime Universe', engagement: 5432, percentage: 43 },
    { name: 'Fantasy Books', engagement: 3210, percentage: 25 }
  ],
  recentActivity: [
    { type: 'purchase', item: 'Spider-Man Poster', user: 'user_marvelfan', time: '2 mins ago', value: '$24.99' },
    { type: 'post', item: 'New Theory About Loki', user: 'user_timekeeper', time: '15 mins ago', value: '1.2k views' },
    { type: 'comment', item: 'Star Wars Discussion', user: 'user_jedimaster', time: '32 mins ago', value: '45 likes' },
    { type: 'signup', item: 'Newsletter', user: 'new_user123', time: '1 hour ago', value: 'Premium' },
    { type: 'contribution', item: 'Fan Art Submission', user: 'user_artist', time: '2 hours ago', value: 'Approved' }
  ]
})

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const activityBadgeClass = (type) => {
  const classes = {
    purchase: 'badge-success',
    post: 'badge-primary',
    comment: 'badge-info',
    signup: 'badge-warning',
    contribution: 'badge-secondary'
  }
  return classes[type] || 'badge-ghost'
}
</script>

<style scoped>
.card-body {
  padding: 1.5rem;
}
</style>
