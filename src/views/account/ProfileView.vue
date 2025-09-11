<template>
  <div class="profile-container max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">My Profile</h1>
    <div class="card bg-base-100 shadow-md rounded-lg p-6 flex flex-col items-center">
      <div class="avatar mb-4">
        <div class="w-24 h-24 rounded-full overflow-hidden border border-base-200">
          <img :src="profileImageUrl" :alt="fullName" class="object-cover w-full h-full" />
        </div>
      </div>
      <form @submit.prevent="saveProfile" class="w-full max-w-md">
        <div class="form-control mb-4">
          <label class="label">Email</label>
          <input v-model="form.email" type="email" class="input input-bordered w-full" disabled />
        </div>
        <div class="form-control mb-4">
          <label class="label">First Name</label>
          <input v-model="form.first_name" type="text" class="input input-bordered w-full" :disabled="!editable" />
        </div>
        <div class="form-control mb-4">
          <label class="label">Last Name</label>
          <input v-model="form.last_name" type="text" class="input input-bordered w-full" :disabled="!editable" />
        </div>
        <div class="form-control mb-4">
          <label class="label">Join Date</label>
          <input :value="formatDate(form.joinedDate)" type="text" class="input input-bordered w-full" disabled />
        </div>
        <div class="form-control mb-4">
          <label class="label">Profile Image</label>
          <input type="file" accept="image/*" @change="onImageChange" class="file-input file-input-bordered w-full" :disabled="!editable" />
        </div>
        <div class="flex gap-2 mt-6">
          <button v-if="!editable" type="button" class="btn btn-primary" @click="editable = true">Edit</button>
          <button v-else type="submit" class="btn btn-success" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
            Save
          </button>
          <button v-if="editable" type="button" class="btn btn-ghost" @click="cancelEdit" :disabled="loading">Cancel</button>
        </div>
        <div v-if="successMessage" class="alert alert-success mt-4">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-error mt-4">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
// import { updateProfile } from '@/api/user' // Uncomment and implement as needed

const authStore = useAuthStore()
const user = computed(() => authStore.user || {})

const form = reactive({
  email: '',
  first_name: '',
  last_name: '',
  joinedDate: '',
  profile_image: ''
})

const editable = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const fullName = computed(() => `${form.first_name} ${form.last_name}`.trim())

const profileImageUrl = computed(() => {
  if (!form.profile_image) return '/default-avatar.png'
  if (form.profile_image.startsWith('http://') || form.profile_image.startsWith('https://')) return form.profile_image
  // Otherwise treat as storage path
  return `${import.meta.env.VITE_STORAGE_URL}/public/${form.profile_image}`
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      errorMessage.value = 'Profile image must be a JPG or PNG file.'
      return
    }
    // For demo: convert to base64. In real app, upload to server and use returned path.
    const reader = new FileReader()
    reader.onload = (event) => {
      form.profile_image = event.target.result // base64 string
    }
    reader.onerror = () => {
      errorMessage.value = 'Failed to read image file.'
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    // await updateProfile(form) // Uncomment and implement API call
    // For demo, just show success
    successMessage.value = 'Profile updated successfully.'
    editable.value = false
    // Optionally update authStore.user here
  } catch (e) {
    errorMessage.value = e?.message || 'Failed to update profile.'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  // Reset form to original user data
  form.email = user.value.email || ''
  form.first_name = user.value.first_name || ''
  form.last_name = user.value.last_name || ''
  form.joinedDate = user.value.created_at || user.value.joinedDate || ''
  form.profile_image = user.value.image || user.value.profile_image || ''
  editable.value = false
  errorMessage.value = ''
  successMessage.value = ''
}

onMounted(() => {
  cancelEdit()
})
</script>

<style scoped>
.profile-container {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
