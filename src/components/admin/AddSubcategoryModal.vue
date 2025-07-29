<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Add New Subcategory</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <div class="space-y-4">
        <!-- Category -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Parent Category</span>
          </label>
          <select
            v-model="newSubcategory.categoryId"
            class="select select-bordered w-full"
          >
            <option disabled selected>Select a category</option>
            <option v-for="category in categories" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Subcategory Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Subcategory Name</span>
          </label>
          <input
            v-model="newSubcategory.name"
            type="text"
            placeholder="Enter subcategory name"
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <div class="modal-action">
        <button @click="close" class="btn btn-ghost">Cancel</button>
        <button
          @click="save"
          class="btn btn-primary"
          :disabled="!newSubcategory.name.trim() || !newSubcategory.categoryId"
        >
          Add Subcategory
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'



const emit = defineEmits(['close', 'save'])

const newSubcategory = ref({
  categoryId: '',
  name: ''
})

const close = () => {
  emit('close')
}

const save = () => {
  emit('save', {
    categoryId: newSubcategory.value.categoryId,
    name: newSubcategory.value.name.trim()
  })
  newSubcategory.value = {
    categoryId: '',
    name: ''
  }
  close()
}
</script>
