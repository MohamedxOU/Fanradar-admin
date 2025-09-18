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
        <button v-if="user.id !== currentUserId" @click="confirmDeleteUser(user)" class="btn btn-ghost btn-sm text-error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
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

    <!-- Edit User Modal (role/image only) -->
    <div v-if="showEditUserModal" class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg mb-4">Edit User</h3>
        <div class="form-control mb-4">
          <label class="label">Role</label>
          <select v-model="userToEdit.role" class="select select-bordered w-full">
            <option v-for="role in roles" :value="role.value">{{ role.label }}</option>
          </select>
        </div>
        <div class="form-control mb-4">
          <label class="label">Profile Image</label>
          <input type="file" accept="image/*" @change="e => onEditImageChange(e)" class="file-input file-input-bordered w-full" />
          <div v-if="userToEdit.avatar" class="mt-2"><img :src="userToEdit.avatar" alt="avatar" class="w-16 h-16 rounded-full" /></div>
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeEditUserModal">Cancel</button>
          <button class="btn btn-primary" @click="saveEditUser(userToEdit)">Save</button>
        </div>
      </div>
    </div>

    <!-- View User Modal -->
    <div v-if="showViewUserModal" class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg mb-4">User Details</h3>
        <div class="flex flex-col items-center mb-4">
          <img :src="userToView.avatar" alt="avatar" class="w-20 h-20 rounded-full mb-2" />
          <div class="font-bold text-xl">{{ userToView.name }}</div>
          <div class="text-base-content/60">{{ userToView.email }}</div>
        </div>
        <div class="mb-2"><b>Role:</b> {{ userToView.role }}</div>
        <div class="mb-2"><b>Joined:</b> {{ formatDate(userToView.joinedDate) }}</div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeViewUserModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Delete User Modal -->
    <div v-if="showDeleteUserModal" class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg mb-4 text-error">Delete User</h3>
        <p>Are you sure you want to delete <b>{{ userToDelete?.name }}</b>? This action cannot be undone.</p>
        <div v-if="deleteError" class="alert alert-error mt-2">{{ deleteError }}</div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeDeleteUserModal">Cancel</button>
          <button class="btn btn-error" :disabled="deleteLoading" @click="deleteUserConfirmed">
            <span v-if="deleteLoading" class="loading loading-spinner loading-xs mr-2"></span>
            Delete
          </button>
        </div>
      </div>
    </div>

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
import { getUsers, deleteUser, updateUser } from '@/api/user'
import { useAuthStore } from '@/stores/auth'

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
const showEditUserModal = ref(false)
const showViewUserModal = ref(false)
const showDeleteUserModal = ref(false)
const userToEdit = ref(null)
const userToView = ref(null)
const userToDelete = ref(null)
const deleteLoading = ref(false)
const deleteError = ref('')

// Get current user id from auth store
const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

// Fetch users function
const fetchUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const token = authStore.token
    const response = await getUsers(token)

    users.value = response.data.map(user => {
      // Prefer profile_image, fallback to image
      const img = user.profile_image || user.image || ''
      let avatar = ''
      if (img.startsWith('http://') || img.startsWith('https://')) {
        avatar = img
      } else if (img) {
        avatar = `${import.meta.env.VITE_STORAGE_URL}/${img}`
      }
      return {
        id: user.id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        joinedDate: user.created_at || user.joinedDate || '',
        avatar
      }
    })

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
    // Defensive: fallback to empty string if property is missing
    const name = (user.name || `${user.first_name || ''} ${user.last_name || ''}`).trim()
    const email = user.email || ''
    const matchesSearch =
      name.toLowerCase().includes((searchQuery.value || '').toLowerCase()) ||
      email.toLowerCase().includes((searchQuery.value || '').toLowerCase())

    // Date range filter
    const matchesDateRange = checkDateRange(user.joinedDate || user.created_at || '')

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

const editUser = (user) => {
  userToEdit.value = { ...user }
  showEditUserModal.value = true
}

const closeEditUserModal = () => {
  showEditUserModal.value = false
  userToEdit.value = null
}

const saveEditUser = async (updatedUser) => {
  try {
    // Prepare form data for update (role and avatar)
    const formData = new FormData()
    formData.append('role', updatedUser.role)
    // If avatar is a new file, you would append it here
    // For demo, we only update role
    const token = authStore.token
    await updateUser(updatedUser.id, formData, token)
    // Update local list
    const idx = users.value.findIndex(u => u.id === updatedUser.id)
    if (idx !== -1) {
      users.value[idx].role = updatedUser.role
      users.value[idx].avatar = updatedUser.avatar
    }
    closeEditUserModal()
  } catch (e) {
    // Optionally show error
    console.error('Failed to update user', e)
  }
}

const viewUser = (user) => {
  userToView.value = { ...user }
  showViewUserModal.value = true
}

const closeViewUserModal = () => {
  showViewUserModal.value = false
  userToView.value = null
}

const confirmDeleteUser = (user) => {
  userToDelete.value = user
  showDeleteUserModal.value = true
  deleteError.value = ''
}

const closeDeleteUserModal = () => {
  showDeleteUserModal.value = false
  userToDelete.value = null
  deleteError.value = ''
}

const deleteUserConfirmed = async () => {
  if (!userToDelete.value) return
  deleteLoading.value = true
  deleteError.value = ''
  try {
    const token = authStore.token
    await deleteUser(userToDelete.value.id, token)
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    closeDeleteUserModal()
  } catch (e) {
    deleteError.value = e?.message || 'Failed to delete user.'
  } finally {
    deleteLoading.value = false

    // Update stats after deletion
    updateUserStats()
  }


}

// Handle image change in edit modal
const onEditImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      // Optionally show error
      return
    }
    // For demo, use local URL. In real app, upload to server and get URL.
    userToEdit.value.avatar = URL.createObjectURL(file)
  }
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
