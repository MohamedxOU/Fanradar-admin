<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-base-100 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
      <button class="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost" @click="closeModal">
        ✕
      </button>
      <h2 class="text-xl font-bold mb-4">Edit Product</h2>
      <div v-if="loading" class="flex justify-center items-center h-32">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <div v-else-if="error" class="alert alert-error mb-4">{{ error }}</div>
      <form v-else @submit.prevent="submitEdit">
        <div class="mb-4">
          <label class="block mb-1 font-medium">Product Name</label>
          <input v-model="form.product_name" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Price</label>
          <input v-model.number="form.price" type="number" min="0" step="0.01" class="input input-bordered w-full" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Type</label>
          <select v-model="form.type" class="select select-bordered w-full">
            <option value="item">Item</option>
            <option value="service">Service</option>
            <option value="drop">Drop</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Status</label>
          <select v-model="form.content_status" class="select select-bordered w-full">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" class="btn btn-ghost" @click="closeModal">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue'
import { getProductById, updateProduct } from '@/api/product'

const emit = defineEmits(['close', 'updated'])

const visible = ref(false)
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const form = reactive({
  product_name: '',
  price: 0,
  type: 'item',
  content_status: 'draft'
})
let currentId = null

function openModal(id) {
  visible.value = true
  error.value = ''
  currentId = id
  fetchProduct(id)
}

function closeModal() {
  visible.value = false
  emit('close')
}

async function fetchProduct(id) {
  loading.value = true
  error.value = ''
  try {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    const res = await getProductById(id, token)
    Object.assign(form, {
      product_name: res.product_name || '',
      price: res.price || 0,
      type: res.type || 'item',
      content_status: res.content_status || 'draft'
    })
  } catch (e) {
    error.value = e?.message || 'Failed to load product.'
  } finally {
    loading.value = false
  }
}

async function submitEdit() {
  submitting.value = true
  error.value = ''
  try {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    await updateProduct(currentId, { ...form }, token)
    emit('updated')
    closeModal()
  } catch (e) {
    error.value = e?.message || 'Failed to update product.'
  } finally {
    submitting.value = false
  }
}

defineExpose({ openModal })
</script>

<style scoped>
.loading-spinner {
  display: inline-block;
}
</style>
