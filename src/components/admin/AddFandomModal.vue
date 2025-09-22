<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Add New Fandom</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <div class="space-y-4">
        <!-- Loading and Messages -->
        <div v-if="loading" class="flex justify-center items-center mb-2">
          <span class="loading loading-spinner loading-md"></span>
        </div>
        <div v-if="errorMsg" class="alert alert-error mb-2">
          {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="alert alert-success mb-2">
          {{ successMsg }}
        </div>
        <!-- Fandom Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Fandom Name</span>
          </label>
          <input
            v-model="newFandom.name"
            type="text"
            placeholder="Enter fandom name"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Fandom Cover Photo Upload -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Fandom Cover Photo</span>
          </label>
          <input
            type="file"
            @change="handleCoverUpload"
            class="file-input file-input-bordered w-full"
          />
        </div>

        <!-- Fandom Image Upload -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Fandom Image (Logo)</span>
          </label>
          <input
            type="file"
            @change="handleImageUpload"
            class="file-input file-input-bordered w-full"
          />
        </div>

        <!-- Category -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Category</span>
          </label>
          <select
            v-model="newFandom.categoryId"
            class="select select-bordered w-full"
          >
            <option disabled selected>Select a category</option>
            <option v-for="category in categories" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Subcategory -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Subcategory (Optional)</span>
          </label>
          <select
            v-model="newFandom.subcategoryId"
            class="select select-bordered w-full"
            :disabled="!newFandom.categoryId"
          >
            <option value="">None</option>
            <option
              v-for="subcategory in filteredSubcategories"
              :value="subcategory.id"
            >
              {{ subcategory.name }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Description</span>
          </label>
          <textarea
            v-model="newFandom.description"
            class="textarea textarea-bordered h-24"
            placeholder="Enter fandom description"
          ></textarea>
        </div>
      </div>

      <div class="modal-action">
        <button @click="close" class="btn btn-ghost">Cancel</button>
        <button @click="save" class="btn btn-primary" :disabled="!isFormValid">
          Create Fandom
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createFandom } from '@/api/fandoms'
import { getCategories, getSubCategories } from '@/api/categoryAndSubCat'
import { useAuthStore } from '@/stores/auth'




const emit = defineEmits(['close', 'save'])
const auth = useAuthStore()
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const newFandom = ref({
  name: '',
  categoryId: '',
  subcategoryId: '',
  description: '',
  imageFile: null,
  coverFile: null
})

const categories = ref([])
const subcategories = ref([])

const filteredSubcategories = computed(() => {
  if (!newFandom.value.categoryId) return []
  return subcategories.value.filter(sub => sub.category_id == newFandom.value.categoryId)
})
const fetchCategoriesAndSubcategories = async () => {
  try {
    const [catRes, subRes] = await Promise.all([
      getCategories(auth.token),
      getSubCategories(auth.token)
    ])
    categories.value = Array.isArray(catRes) ? catRes : []
    subcategories.value = Array.isArray(subRes) ? subRes : []
  } catch (e) {
    categories.value = []
    subcategories.value = []
    console.error('Failed to fetch categories or subcategories', e)
  }
}

onMounted(() => {
  fetchCategoriesAndSubcategories()
})

const isFormValid = computed(() => {
  return newFandom.value.name.trim() !== '' && newFandom.value.categoryId !== ''
})

const close = () => {
  emit('close')
}

const save = async () => {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const formData = new FormData()
    formData.append('name', newFandom.value.name)
    formData.append('description', newFandom.value.description)
    formData.append('category_id', newFandom.value.categoryId)
    if (newFandom.value.subcategoryId) {
      formData.append('subcategory_id', newFandom.value.subcategoryId)
    }
    if (newFandom.value.imageFile) {
      formData.append('logo_image', newFandom.value.imageFile)
    }
    if (newFandom.value.coverFile) {
      formData.append('cover_image', newFandom.value.coverFile)
    }
    const res = await createFandom(formData, auth.token)
    emit('save', res.data?.fandom || {})
    successMsg.value = 'Fandom created successfully.'
    // Reset form
    newFandom.value = {
      name: '',
      categoryId: '',
      subcategoryId: '',
      description: '',
      imageFile: null,
      coverFile: null
    }
    setTimeout(() => {
      successMsg.value = ''
      close()
    }, 1200)
  } catch (e) {
    errorMsg.value = e?.message || 'Failed to create fandom.'
  } finally {
    loading.value = false
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newFandom.value.imageFile = file
  }
}

const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newFandom.value.coverFile = file
  }
}
</script>
