<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-4xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Manage Roles & Permissions</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <!-- Add New Role -->
      <div class="bg-base-200 p-4 rounded-lg mb-6">
        <h4 class="font-medium mb-3">Add New Role</h4>
        <div class="flex gap-2">
          <input
            v-model="newRoleName"
            type="text"
            placeholder="Role name"
            class="input input-bordered flex-1"
          />
          <button @click="addRole" class="btn btn-primary" :disabled="!newRoleName.trim()">
            Add Role
          </button>
        </div>
      </div>

      <!-- Roles List -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
              <th>Users</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id">
              <td>
                <span class="font-medium">{{ role.name }}</span>
                <span v-if="role.isDefault" class="badge badge-sm badge-ghost ml-2">Default</span>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="permission in role.permissions"
                    :key="permission"
                    class="badge badge-sm"
                  >
                    {{ permission }}
                  </span>
                </div>
              </td>
              <td>{{ role.userCount }}</td>
              <td>
                <div class="flex gap-2">
                  <button @click="editRole(role)" class="btn btn-xs btn-ghost">
                    Edit
                  </button>
                  <button
                    @click="deleteRole(role)"
                    class="btn btn-xs btn-ghost text-error"
                    :disabled="role.isDefault"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-action">
        <button @click="close" class="btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRoles } from '@/api/roles_permessions'


const emit = defineEmits(['close'])

const newRoleName = ref('')

const roles = ref([])

const fetchRoles = async () => {
  try {
    const response = await getRoles()
    // Map API response to table structure
    roles.value = response.data.map(role => ({
      id: role.id,
      name: role.name,
      isDefault: false, // You can adjust this logic as needed
      permissions: role.permissions_array || [],
      userCount: 0 // You may want to fetch user count separately if needed
    }))
  } catch (e) {
    // Handle error (optional)
    roles.value = []
    console.error('Failed to fetch roles:', e)
  }
}

onMounted(() => {
  fetchRoles()
})

const close = () => {
  emit('close')
}

const addRole = () => {
  if (!newRoleName.value.trim()) return

  roles.value.push({
    id: Date.now(),
    name: newRoleName.value.trim(),
    isDefault: false,
    permissions: [],
    userCount: 0
  })


}

const deleteRole = (role) => {
  if (role.isDefault) return

  if (confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
    roles.value = roles.value.filter(r => r.id !== role.id)

  }
}
</script>
