<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Add New Category</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Category Name</span>
        </label>
        <input
          v-model="newCategory.name"
          type="text"
          placeholder="Enter category name"
          class="input input-bordered w-full"
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Description</span>
        </label>
        <textarea
          v-model="newCategory.description"
          placeholder="Enter category description"
          class="textarea textarea-bordered w-full"
          rows="3"
        ></textarea>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Category Image</span>
        </label>
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          @change="handleImageChange"
          class="file-input file-input-bordered w-full"
        />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" alt="Preview" class="w-24 h-24 object-cover rounded" />
        </div>
      </div>

      <div v-if="error" class="alert alert-error mb-4">
        {{ error }}
      </div>

      <div class="modal-action">
        <button @click="close" class="btn btn-ghost" :disabled="loading">Cancel</button>
        <button @click="save" class="btn btn-primary" :disabled="!newCategory.name.trim() || loading">
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          {{ loading ? 'Creating...' : 'Add Category' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createCategory } from '@/api/categoryAndSubCat'

const emit = defineEmits(['close', 'save'])

const newCategory = ref({
  name: '',
  description: ''
})

const imageInput = ref(null)
const imagePreview = ref('')
const selectedImage = ref(null)

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    selectedImage.value = null
    imagePreview.value = ''
  }
}

const loading = ref(false)
const error = ref('')

const close = () => {
  newCategory.value.name = ''
  newCategory.value.description = ''
  selectedImage.value = null
  imagePreview.value = ''
  error.value = ''
  if (imageInput.value) imageInput.value.value = ''
  emit('close')
}

const save = async () => {
  loading.value = true
  error.value = ''

  try {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('name', newCategory.value.name.trim())

    if (newCategory.value.description.trim()) {
      formData.append('description', newCategory.value.description.trim())
    }

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    // Debug: Log FormData contents
    console.log('FormData contents:')
    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }

    const result = await createCategory(formData, token)
    console.log('Category creation success:', result)
    emit('save', result)
    close()
  } catch (err) {
    console.error('Category creation error:', err)
    // Check if the response contains success data despite the 500 status
    if (err?.response?.data && (err.response.data.category || err.response.data.message?.includes('succès') || err.response.data.message?.includes('success'))) {
      console.log('Category created successfully despite 500 status')
      emit('save', err.response.data)
      close()
    } else {
      error.value = err?.message || err?.response?.data?.message || 'Failed to create category'
    }
  } finally {
    loading.value = false
  }
}
</script>
