<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="user-management-container p-6">
     <!-- Header with Title and Buttons in one line -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">User Management</h1>
    <div class="flex gap-2">
      <button @click="openAddUserModal" class="btn btn-primary">
        <PlusIcon class="h-5 w-5" />
        <span class="hidden md:inline">Add User</span>
      </button>
      <button @click="openRoleManagement" class="btn btn-outline">
        <Cog6ToothIcon class="h-5 w-5" />
        <span class="hidden md:inline">Manage Roles</span>
      </button>
      <button @click="open2FASettings" class="btn btn-outline">
        <LockClosedIcon class="h-5 w-5" />
        <span class="hidden md:inline">2FA Settings</span>
      </button>
    </div>
  </div>
    <!-- Stats Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Users Card -->
      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">Total Users</h3>
            <p class="text-3xl font-bold mt-2">{{ formatNumber(stats.totalUsers) }}</p>
          </div>
          <div class="p-3 rounded-full bg-primary/10">
            <UsersIcon class="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <!-- New Users Card -->
      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">New Users (7d)</h3>
            <p class="text-3xl font-bold mt-2">{{ formatNumber(stats.newUsers) }}</p>
          </div>
          <div class="p-3 rounded-full bg-success/10">
            <UserPlusIcon class="h-6 w-6 text-success" />
          </div>
        </div>
      </div>

      <!-- Active Users Card -->
      <div class="card bg-base-100 shadow-md rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-base-content/60">Regular Users</h3>
            <p class="text-3xl font-bold mt-2">{{ formatNumber(stats.regularUsers) }}</p>
          </div>
          <div class="p-3 rounded-full bg-info/10">
            <UserGroupIcon class="h-6 w-6 text-info" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Controls Section -->
    <div class="bg-base-100 shadow-md rounded-lg p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <!-- Search Field -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-base-content/60" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="input input-bordered w-full pl-10"
          />
        </div>

        <!-- Filter Controls -->
        <div class="flex items-center gap-3">
          <!-- Filter Button -->
          <button
            @click="toggleFilters"
            class="btn btn-outline flex items-center gap-2"
          >
            <FunnelIcon class="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="bg-base-200 p-4 rounded-lg mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Role Filter -->
          <div>
            <label class="label">
              <span class="label-text">Role</span>
            </label>
            <select v-model="filters.role" class="select select-bordered w-full">
              <option value="">All Roles</option>
              <option v-for="role in roles" :value="role.value">
                {{ role.label }}
              </option>
            </select>
          </div>

          <!-- Date Range Filter -->
          <div>
            <label class="label">
              <span class="label-text">Date Range</span>
            </label>
            <select v-model="selectedDateRange" class="select select-bordered w-full">
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  <tr v-if="loading">
    <td colspan="5" class="text-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
      <p>Loading users...</p>
    </td>
  </tr>

  <tr v-else-if="error">
    <td colspan="5" class="text-center py-8 text-error">
      {{ error }}
      <button @click="fetchUsers" class="btn btn-sm btn-outline mt-2">Retry</button>
    </td>
  </tr>

  <tr v-else-if="paginatedUsers.length === 0">
    <td colspan="5" class="text-center py-8">
      No users found matching your criteria
    </td>
  </tr>

  <tr v-for="user in paginatedUsers" :key="user.id">
    <td>
      <div class="flex items-center gap-3">
        <div class="avatar">
          <div class="w-10 h-10 rounded-full">
            <img :src="user.avatar" :alt="user.name" />
          </div>
        </div>
        <div>
          <div class="font-bold">{{ user.first_name }} {{ user.last_name }}</div>
        </div>
      </div>
    </td>
    <td>{{ user.email }}</td>
    <td>
      <span class="badge" :class="roleBadgeClass(user.role)">
        {{ user.role }}
      </span>
    </td>
    <td>{{ formatDate(user.joinedDate) }}</td>
    <td>
      <div class="flex gap-2">
        <button @click="editUser(user)" class="btn btn-ghost btn-sm">
          <PencilSquareIcon class="h-4 w-4" />
        </button>
        <button @click="viewUser(user)" class="btn btn-ghost btn-sm">
          <EyeIcon class="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
</tbody>
        </table>


      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6">
        <div class="join">
          <button class="join-item btn" :disabled="currentPage === 1" @click="prevPage">
            «
          </button>
          <button class="join-item btn" v-for="page in visiblePages" :key="page"
            @click="goToPage(page)" :class="{ 'btn-active': page === currentPage }">
            {{ page }}
          </button>
          <button class="join-item btn" :disabled="currentPage === totalPages" @click="nextPage">
            »
          </button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <AddUserModal
      v-if="showAddUserModal"
      @close="closeAddUserModal"
      @save="handleAddUser"
    />

    <!-- Role Management Modal -->
    <RoleManagementModal
      v-if="showRoleManagementModal"
      @close="closeRoleManagementModal"
    />

    <!-- 2FA Settings Modal -->
    <TwoFASettingsModal
      v-if="show2FASettingsModal"
      @close="close2FASettingsModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  UsersIcon,
  UserPlusIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  PencilSquareIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import AddUserModal from '../../components/admin/AddUserModal.vue'
import RoleManagementModal from '../../components/admin/RoleManagementModal.vue'
import TwoFASettingsModal from '../../components/admin/TwoFASettingsModal.vue'
import { getUsers } from '@/api/user'

// Stats data
const stats = ref({
  totalUsers: 0,
  newUsers: 0,
  regularUsers: 0
})

// Users data
const users = ref([])
const loading = ref(false)
const error = ref(null)

// Filter controls
const showFilters = ref(false)
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// Date range filter
const selectedDateRange = ref('all')

// Search query
const searchQuery = ref('')

// Filters
const filters = ref({
  role: ''
})

// Sample filter options
const roles = ref([
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' }
])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Modal controls
const showAddUserModal = ref(false)
const showRoleManagementModal = ref(false)
const show2FASettingsModal = ref(false)

// Fetch users function
const fetchUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await getUsers()
    users.value = response.data.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      joinedDate: user.join_date,
      avatar: user.image ? `${import.meta.env.VITE_STORAGE_URL}/public/${user.image}` : ''
    }))

    // Update stats with proper calculations
    updateUserStats()
  } catch (err) {
    error.value = err.message || 'Failed to fetch users'
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const updateUserStats = () => {
  const now = new Date()

  // Calculate new users (joined in last 7 days)
  stats.value.newUsers = users.value.filter(user => {
    const joinDate = new Date(user.joinedDate)
    const diffTime = now - joinDate
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }).length

  // Calculate regular users (role === 'user')
  stats.value.regularUsers = users.value.filter(
    user => user.role === 'user'
  ).length

  // Total users
  stats.value.totalUsers = users.value.length
}



// Computed properties
const filteredUsers = computed(() => {
  if (!users.value) return []

  return users.value.filter(user => {
    // Search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Date range filter
    const matchesDateRange = checkDateRange(user.joinedDate)

    // Other filters
    const matchesRole = !filters.value.role || user.role === filters.value.role

    return matchesSearch && matchesDateRange && matchesRole
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
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

// Methods
const checkDateRange = (dateString) => {
  if (selectedDateRange.value === 'all') return true

  const now = new Date()
  const date = new Date(dateString)
  const diffTime = now - date
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  switch (selectedDateRange.value) {
    case '7d': return diffDays <= 7
    case '30d': return diffDays <= 30
    case '90d': return diffDays <= 90
    default: return true
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const roleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'badge-primary'
    case 'moderator': return 'badge-secondary'
    case 'user': return 'badge-accent'
    default: return 'badge-ghost'
  }
}

// Pagination methods
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

// Modal methods
const openAddUserModal = () => {
  showAddUserModal.value = true
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
}

const handleAddUser = (newUser) => {
  users.value.unshift({
    ...newUser,
    id: Math.max(...users.value.map(u => u.id)) + 1,
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'active',
    image: 'default.png'
  })
  closeAddUserModal()
}

const openRoleManagement = () => {
  showRoleManagementModal.value = true
}

const closeRoleManagementModal = () => {
  showRoleManagementModal.value = false
}

const open2FASettings = () => {
  show2FASettingsModal.value = true
}

const close2FASettingsModal = () => {
  show2FASettingsModal.value = false
}

// User actions
const editUser = (user) => {
  console.log('Edit user:', user)
  // Implement edit functionality
}

const viewUser = (user) => {
  console.log('View user:', user)
  // Implement view functionality
}

// Fetch data on mount
onMounted(() => {
  fetchUsers()
})
</script>
<style scoped>
.user-management-container {
  max-width: 100%;
  overflow-x: hidden;
}

.table {
  --tw-bg-opacity: 1;
  background-color: hsl(var(--b1)/var(--tw-bg-opacity));
}

.table th {
  background-color: hsl(var(--b2)/var(--tw-bg-opacity));
}

.badge {
  @apply capitalize;
}
</style>
