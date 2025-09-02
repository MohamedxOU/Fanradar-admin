<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Add New User</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <div v-if="rolesLoading" class="flex justify-center items-center mb-4">
        <span class="loading loading-spinner loading-md"></span>
        <span class="ml-2">Loading roles...</span>
      </div>
      <div v-if="rolesError" class="alert alert-error mb-4">{{ rolesError }}</div>
      <div v-if="successMessage" class="alert alert-success mb-4">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-error mb-4">{{ errorMessage }}</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">First Name</span>
          </label>
          <input
            v-model="newUser.first_name"
            type="text"
            placeholder="First Name"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Last Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Last Name</span>
          </label>
          <input
            v-model="newUser.last_name"
            type="text"
            placeholder="Last Name"
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

        <!-- Password -->
        <div class="form-control md:col-span-2">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            v-model="newUser.password"
            type="password"
            placeholder="Password"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Profile Image -->
        <div class="form-control md:col-span-2">
          <label class="label">
            <span class="label-text">Profile Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            @change="onImageChange"
            class="file-input file-input-bordered w-full"
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
        <button @click="save" class="btn btn-primary" :disabled="!isFormValid || loading">
          <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
          <span v-else>Save User</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { register } from '@/api/auth'
import { getRoles } from '@/api/roles_permessions'

const emit = defineEmits(['close', 'save'])

const roles = ref([])
const rolesLoading = ref(false)
const rolesError = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const loadRoles = async () => {
  rolesLoading.value = true
  rolesError.value = ''
  try {
    const response = await getRoles()
    roles.value = response.data.map(role => ({
      value: role.name,
      label: role.name.charAt(0).toUpperCase() + role.name.slice(1)
    }))
  } catch (e) {
    roles.value = []
    rolesError.value = 'Failed to load roles.'
    console.error('Failed to load roles', e)
  } finally {
    rolesLoading.value = false
  }
}

onMounted(() => {
  loadRoles()
})

const newUser = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: '',
  profile_image: null
})

const isFormValid = computed(() => {
  return (
    newUser.value.first_name.trim() !== '' &&
    newUser.value.last_name.trim() !== '' &&
    newUser.value.email.trim() !== '' &&
    newUser.value.password.trim() !== '' &&
    newUser.value.role !== ''
  )
})

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      errorMessage.value = 'Profile image must be a JPG or PNG file.'
      newUser.value.profile_image = null
      e.target.value = ''
      return
    }
    newUser.value.profile_image = file
    errorMessage.value = ''
  }
}

const close = () => {
  emit('close')
}

const save = async () => {
  if (!isFormValid.value) return
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const formData = new FormData()
    formData.append('first_name', newUser.value.first_name)
    formData.append('last_name', newUser.value.last_name)
    formData.append('email', newUser.value.email)
    formData.append('password', newUser.value.password)
    if (newUser.value.profile_image) {
      formData.append('profile_image', newUser.value.profile_image)
    }
    await register(formData)
    successMessage.value = 'User registered successfully.'
    emit('save', { ...newUser.value })
    setTimeout(() => {
      close()
    }, 1200)
  } catch (e) {
    errorMessage.value = e?.message || 'Failed to register user.'
    console.error('Failed to register user', e)
  } finally {
    loading.value = false
  }
}
</script>
