<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Add New Fandom</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <div class="space-y-4">
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

        <!-- Image Upload -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Fandom Image</span>
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
import { ref, computed } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const newFandom = ref({
  name: '',
  categoryId: '',
  subcategoryId: '',
  description: '',
  image: 'https://via.placeholder.com/300x200?text=New+Fandom'
})

const filteredSubcategories = computed(() => {
  if (!newFandom.value.categoryId) return []
  // In a real app, you would filter subcategories based on selected category
  return []
})

const isFormValid = computed(() => {
  return newFandom.value.name.trim() !== '' && newFandom.value.categoryId !== ''
})

const close = () => {
  emit('close')
}

const save = () => {
  const category = props.categories.find(c => c.id == newFandom.value.categoryId)
  const subcategory = filteredSubcategories.value.find(s => s.id == newFandom.value.subcategoryId)

  emit('save', {
    id: Date.now(),
    name: newFandom.value.name,
    image: newFandom.value.image,
    category: category.name,
    subcategory: subcategory?.name || null,
    memberCount: 0,
    postCount: 0,
    createdAt: new Date().toISOString(),
    description: newFandom.value.description
  })

  // Reset form
  newFandom.value = {
    name: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    image: 'https://via.placeholder.com/300x200?text=New+Fandom'
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // In a real app, you would upload the image to a server
    const reader = new FileReader()
    reader.onload = (e) => {
      newFandom.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>
