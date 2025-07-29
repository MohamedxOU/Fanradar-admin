<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Add New User</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Username -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Username</span>
          </label>
          <input
            v-model="newUser.username"
            type="text"
            placeholder="johndoe"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Full Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Full Name</span>
          </label>
          <input
            v-model="newUser.name"
            type="text"
            placeholder="John Doe"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Email -->
        <div class="form-control md:col-span-2">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            v-model="newUser.email"
            type="email"
            placeholder="john@example.com"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Role -->
        <div class="form-control md:col-span-2">
          <label class="label">
            <span class="label-text">Role</span>
          </label>
          <select v-model="newUser.role" class="select select-bordered w-full">
            <option disabled selected>Select a role</option>
            <option v-for="role in roles" :value="role.value">
              {{ role.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="modal-action">
        <button @click="close" class="btn btn-ghost">Cancel</button>
        <button @click="save" class="btn btn-primary" :disabled="!isFormValid">
          Save User
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'


const emit = defineEmits(['close', 'save'])

const roles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'user', label: 'Regular User' },
  { value: 'guest', label: 'Guest' }
]

const newUser = ref({
  username: '',
  name: '',
  email: '',
  role: ''
})

const isFormValid = computed(() => {
  return (
    newUser.value.username.trim() !== '' &&
    newUser.value.name.trim() !== '' &&
    newUser.value.email.trim() !== '' &&
    newUser.value.role !== ''
  )
})

const close = () => {
  emit('close')
}

const save = () => {
  // In a real app, you would validate more thoroughly and call an API
  emit('save', {
    ...newUser.value,
    id: Date.now(), // Temporary ID
    status: 'active',
    joinedDate: new Date().toISOString(),
    avatar: `https://i.pravatar.cc/150?u=${newUser.value.email}`
  })


  close()
}
</script>
