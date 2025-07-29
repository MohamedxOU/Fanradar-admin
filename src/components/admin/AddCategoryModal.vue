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

      <div class="modal-action">
        <button @click="close" class="btn btn-ghost">Cancel</button>
        <button @click="save" class="btn btn-primary" :disabled="!newCategory.name.trim()">
          Add Category
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'save'])

const newCategory = ref({
  name: ''
})

const close = () => {
  emit('close')
}

const save = () => {
  emit('save', {
    name: newCategory.value.name.trim()
  })
  newCategory.value.name = ''
  close()
}
</script>
