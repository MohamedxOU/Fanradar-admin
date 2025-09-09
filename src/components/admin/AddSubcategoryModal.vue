<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Add New Subcategory</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <div class="space-y-4">


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
          :disabled="!newSubcategory.name.trim() || (!props.categoryId && !newSubcategory.categoryId)"
        >
          Add Subcategory
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categoryId: {
    type: [String, Number],
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['close', 'save'])

const newSubcategory = ref({
  categoryId: props.categoryId || '',
  name: ''
})

// If categoryId prop changes, update the form
watch(() => props.categoryId, (val) => {
  newSubcategory.value.categoryId = val || ''
})

const close = () => {
  emit('close')
}

const save = () => {
  emit('save', {
    name: newSubcategory.value.name.trim()
  })
  newSubcategory.value = {
    categoryId: props.categoryId || '',
    name: ''
  }
  close()
}
</script>
