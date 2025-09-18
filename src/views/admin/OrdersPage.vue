<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="container mx-auto p-6">
    <!-- Header with Title and Buttons -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold">Orders Management</h1>
        <p class="text-sm text-base-content/60 mt-1">
          Track purchases, revenue, and order fulfillment
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <button @click="exportOrders" class="btn btn-outline">
          <ArrowDownTrayIcon class="h-5 w-5" />
          <span>Export</span>
        </button>
        <button @click="openFilters" class="btn btn-outline">
          <FunnelIcon class="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <!-- Total Orders -->
      <div class="card bg-base-100 shadow">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-medium text-base-content/60">Total Orders</h2>
              <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.totalOrders) }}</p>
            </div>
            <div class="p-3 rounded-full bg-primary/10">
              <ShoppingBagIcon class="h-6 w-6 text-primary" />
            </div>
          </div>
          <div class="mt-2 flex items-center text-sm" :class="stats.ordersChange >= 0 ? 'text-success' : 'text-error'">
            <ArrowTrendingUpIcon v-if="stats.ordersChange >= 0" class="h-4 w-4" />
            <ArrowTrendingDownIcon v-else class="h-4 w-4" />
            <span class="ml-1">{{ Math.abs(stats.ordersChange) }}% vs last period</span>
          </div>
        </div>
      </div>

      <!-- Revenue -->
      <div class="card bg-base-100 shadow">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-medium text-base-content/60">Total Revenue</h2>
              <p class="text-3xl font-bold mt-1">${{ formatNumber(stats.totalRevenue) }}</p>
            </div>
            <div class="p-3 rounded-full bg-success/10">
              <CurrencyDollarIcon class="h-6 w-6 text-success" />
            </div>
          </div>
          <div class="mt-2 flex items-center text-sm" :class="stats.revenueChange >= 0 ? 'text-success' : 'text-error'">
            <ArrowTrendingUpIcon v-if="stats.revenueChange >= 0" class="h-4 w-4" />
            <ArrowTrendingDownIcon v-else class="h-4 w-4" />
            <span class="ml-1">{{ Math.abs(stats.revenueChange) }}% vs last period</span>
          </div>
        </div>
      </div>

      <!-- Average Order Value -->
      <div class="card bg-base-100 shadow">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-medium text-base-content/60">Avg. Order Value</h2>
              <p class="text-3xl font-bold mt-1">${{ formatNumber(stats.avgOrderValue) }}</p>
            </div>
            <div class="p-3 rounded-full bg-info/10">
              <ChartBarIcon class="h-6 w-6 text-info" />
            </div>
          </div>
          <div class="mt-2 flex items-center text-sm" :class="stats.aovChange >= 0 ? 'text-success' : 'text-error'">
            <ArrowTrendingUpIcon v-if="stats.aovChange >= 0" class="h-4 w-4" />
            <ArrowTrendingDownIcon v-else class="h-4 w-4" />
            <span class="ml-1">{{ Math.abs(stats.aovChange) }}% vs last period</span>
          </div>
        </div>
      </div>

      <!-- Fulfillment Status -->
      <div class="card bg-base-100 shadow">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-medium text-base-content/60">Fulfillment Rate</h2>
              <p class="text-3xl font-bold mt-1">{{ stats.fulfillmentRate }}%</p>
            </div>
            <div class="p-3 rounded-full bg-warning/10">
              <TruckIcon class="h-6 w-6 text-warning" />
            </div>
          </div>
          <div class="mt-2">
            <progress class="progress progress-warning w-full" :value="stats.fulfillmentRate" max="100"></progress>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-base-100 rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Date Range -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Date Range</span>
          </label>
          <select v-model="dateRange" class="select select-bordered">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <!-- Custom Date Picker -->
        <div v-if="dateRange === 'custom'" class="form-control">
          <label class="label">
            <span class="label-text">From</span>
          </label>
          <input v-model="startDate" type="date" class="input input-bordered" />
        </div>
        <div v-if="dateRange === 'custom'" class="form-control">
          <label class="label">
            <span class="label-text">To</span>
          </label>
          <input v-model="endDate" type="date" class="input input-bordered" />
        </div>

        <!-- Status Filter -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Order Status</span>
          </label>
          <select v-model="orderStatus" class="select select-bordered">
            <option value="">All Statuses</option>
            <option v-for="status in statusOptions" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <!-- Customer Filter -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Customer</span>
          </label>
          <input v-model="customerFilter" type="text" placeholder="Search customers..." class="input input-bordered" />
        </div>

        <!-- Apply/Clear Buttons -->
        <div class="flex items-end gap-2">
          <button @click="applyFilters" class="btn btn-primary">Apply</button>
          <button @click="clearFilters" class="btn btn-ghost">Clear</button>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-base-100 rounded-lg shadow ">
      <table class="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </td>
            <td>
              <div class="font-bold">#{{ order.id }}</div>

            </td>
            <td>
              <div class="flex items-center gap-3">
                <div class="avatar">
                  <div class="w-10 h-10 rounded-full">
                    <img :src="order.customer.avatar" :alt="order.customer.name" />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{{ order.customer.name }}</div>
                  <div class="text-sm text-base-content/60">{{ order.customer.email }}</div>
                </div>
              </div>
            </td>
            <td>
              {{ formatDate(order.date) }}
            </td>
            <td>
              <span class="badge" :class="statusBadgeClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td>
              <div class="flex items-center">
                <div class="avatar-group -space-x-4">
                  <div v-for="(item, index) in order.items.slice(0, 3)" :key="index" class="avatar">
                    <div class="w-8 h-8">
                      <img :src="item.image" :alt="item.name" />
                    </div>
                  </div>
                  <div v-if="order.items.length > 3" class="avatar placeholder">
                    <div class="w-8 h-8 bg-base-300 text-base-content">
                      <span class="text-xs">+{{ order.items.length - 3 }}</span>
                    </div>
                  </div>
                </div>
                <span class="ml-2 text-sm">{{ order.items.length }} items</span>
              </div>
            </td>
            <td>
              <div class="font-bold">${{ order.total.toFixed(2) }}</div>
              <div v-if="order.discount" class="text-sm text-error">
                -${{ order.discount.toFixed(2) }}
              </div>
            </td>
            <td>
              <div class="flex gap-2">
                <button @click="openOrderDetails(order)" class="btn btn-ghost btn-xs">
                  <EyeIcon class="h-4 w-4" />
                </button>
                <div class="dropdown dropdown-end" style="position: relative; z-index: 20;">
                  <label tabindex="0" class="btn btn-ghost btn-xs">
                    <EllipsisVerticalIcon class="h-4 w-4" />
                  </label>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40" style="z-index: 50;">
                    <li><a @click="updateStatus(order, 'processing')">Mark as Processing</a></li>
                    <li><a @click="updateStatus(order, 'confirmed')">Mark as Confirmed</a></li>
                    <li><a @click="updateStatus(order, 'shipped')">Mark as Shipped</a></li>
                    <li><a @click="updateStatus(order, 'delivered')">Mark as Delivered</a></li>
                    <li><a @click="cancelOrder(order)" class="text-error">Cancel Order</a></li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredOrders.length === 0" class="text-center py-12">
      <div class="mx-auto w-24 h-24 text-base-content/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-medium">No orders found</h3>
      <p class="mt-1 text-base-content/60">Try adjusting your search or filters</p>
      <button @click="clearFilters" class="btn btn-primary mt-4">
        Clear Filters
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="filteredOrders.length > 0" class="flex justify-between items-center mt-6">
      <div class="text-sm text-base-content/60">
        Showing {{ filteredOrders.length }} of {{ orders.length }} orders
      </div>
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

    <!-- Order Details Modal -->
    <OrderDetailsModal
      :order="selectedOrder"
      :visible="showOrderDetailsModal"
      @close="closeOrderDetailsModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TruckIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline'
import OrderDetailsModal from '../../components/admin/OrderDetailsModal.vue'

import { onMounted } from 'vue'
import { getOrders } from '@/api/orders'

const orders = ref([])

// Helper to resolve Laravel storage paths
const resolveImg = (img) => {
  if (!img) return '/public/images/test_logo.png'
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  const base = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000'
  return `${base}/${img}`
}

const fetchOrders = async () => {
  try {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    const res = await getOrders(token)
    orders.value = (res || []).map(order => {
      // Map user info
      const user = order.user || {}
      const customer = {
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email || '',
        avatar: resolveImg(user.profile_image)
      }
      // Map products to items
      const items = (order.products || []).map(prod => ({
        id: prod.id,
        name: prod.product_name,
        image: prod.medias && prod.medias.length > 0 ? resolveImg(prod.medias[0].url) : '/public/images/test_logo.png',
        price: Number(prod.price),
        quantity: prod.pivot?.quantity || 1
      }))
      return {
        id: order.id,
        customer,
        date: order.order_date || order.created_at,
        status: order.status,
        paymentMethod: order.payment_method || 'N/A',
        items,
        total: Number(order.total_amount),
        discount: 0 // Add discount if available
      }
    })
  } catch (err) {
    // Optionally show error
    orders.value = []
    console.error('Failed to load orders', err)
  }
}

onMounted(() => {
  fetchOrders()
})

// Stats
const stats = ref({
  totalOrders: 1243,
  ordersChange: 12.5,
  totalRevenue: 45678.50,
  revenueChange: 8.2,
  avgOrderValue: 89.45,
  aovChange: 3.7,
  fulfillmentRate: 87
})

// Filters
const showFilters = ref(false)
const dateRange = ref('7')
const startDate = ref('')
const endDate = ref('')
const orderStatus = ref('')
const customerFilter = ref('')

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' }
]

// Filtered orders
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Status filter
    const matchesStatus = !orderStatus.value || order.status === orderStatus.value

    // Customer filter
    const matchesCustomer = !customerFilter.value ||
      order.customer.name.toLowerCase().includes(customerFilter.value.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(customerFilter.value.toLowerCase())

    // Date filter (simplified)
    const matchesDate = true // Implement date filtering logic

    return matchesStatus && matchesCustomer && matchesDate
  })
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage)
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

// Order details modal logic
const selectedOrder = ref(null)
const showOrderDetailsModal = ref(false)

const openOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderDetailsModal.value = true
}

const closeOrderDetailsModal = () => {
  showOrderDetailsModal.value = false
  selectedOrder.value = null
}



const updateStatus = (order, status) => {
  order.status = status
  // In a real app, you would update via API
}

const cancelOrder = (order) => {
  order.status = 'cancelled'
  // In a real app, you would update via API
}

// Filter actions
const openFilters = () => {
  showFilters.value = true
}

const applyFilters = () => {
  showFilters.value = false
  currentPage.value = 1
}

const clearFilters = () => {
  dateRange.value = '7'
  startDate.value = ''
  endDate.value = ''
  orderStatus.value = ''
  customerFilter.value = ''
  currentPage.value = 1
}

const exportOrders = () => {
  console.log('Exporting orders...')
  // Implement export functionality
}

// Helpers
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const statusBadgeClass = (status) => {
  const classes = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-error',
    refunded: 'badge-neutral'
  }
  return classes[status] || 'badge-ghost'
}
</script>

<style scoped>
.avatar-group {
  display: flex;
}
.avatar {
  position: relative;
}
.avatar img {
  border-radius: 9999px;
  border: 2px solid hsl(var(--b1));
}
.avatar.placeholder > div {
  border-radius: 9999px;
  border: 2px solid hsl(var(--b3));
}
</style>
