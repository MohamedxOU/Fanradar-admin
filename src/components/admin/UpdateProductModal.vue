<template>
  <dialog ref="modalRef" class="modal" :class="{ 'modal-open': open }">
    <form method="dialog" class="modal-box w-full max-w-2xl" @submit.prevent="handleSubmit">
      <h3 class="font-bold text-lg mb-4">Update Product</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label">Product Name <span class="text-error">*</span></label>
          <input v-model="form.product_name" type="text" class="input input-bordered w-full" maxlength="255" required />
        </div>
        <div>
          <label class="label">Price <span class="text-error">*</span></label>
          <input v-model.number="form.price" type="number" class="input input-bordered w-full" min="0" step="0.01" required />
        </div>
        <div>
          <label class="label">Stock <span class="text-error">*</span></label>
          <input v-model.number="form.stock" type="number" class="input input-bordered w-full" min="0" required />
        </div>
        <div>
          <label class="label">Promotion (%)</label>
          <input v-model.number="form.promotion" type="number" class="input input-bordered w-full" min="0" max="100" />
        </div>
        <div>
          <label class="label">Sale Start Date</label>
          <input v-model="form.sale_start_date" type="date" class="input input-bordered w-full" />
        </div>
        <div>
          <label class="label">Sale End Date</label>
          <input v-model="form.sale_end_date" type="date" class="input input-bordered w-full" :min="form.sale_start_date" />
        </div>
        <div>
          <label class="label">Status</label>
          <select v-model="form.content_status" class="select select-bordered w-full">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="label">Description</label>
          <textarea v-model="form.description" class="textarea textarea-bordered w-full" rows="2"></textarea>
        </div>
        <div class="md:col-span-2">
          <label class="label">Medias (images/videos)</label>
          <input type="file" class="file-input file-input-bordered w-full" multiple @change="handleFiles" accept="image/*,video/*" />
          <div v-if="form.medias.length" class="mt-2 flex flex-wrap gap-2">
            <span v-for="(file, idx) in form.medias" :key="idx" class="badge badge-outline">{{ file.name }}</span>
          </div>
          <div v-if="existingMedias.length" class="mt-2 flex flex-wrap gap-2">
            <span v-for="(media, idx) in existingMedias" :key="media.id || idx" class="badge badge-info">
              {{ media.name || media.url.split('/').pop() }}
              <button type="button" class="ml-1 text-error" @click="removeExistingMedia(idx)">&times;</button>
            </span>
          </div>
        </div>
      </div>
      <div v-if="error" class="alert alert-error mt-4">{{ error }}</div>
      <div v-if="success" class="alert alert-success mt-4">Product updated successfully!</div>
      <div class="modal-action mt-6 flex justify-between items-center">
        <button type="button" class="btn" @click="closeModal" :disabled="loading">Cancel</button>
        <div class="flex gap-2">
          <button type="button" class="btn btn-error" @click="showDeleteConfirm = true" :disabled="loading">Delete</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
            Save Changes
          </button>
        </div>
      </div>
    </form>
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg mb-4 text-error">Delete Product</h3>
        <p>Are you sure you want to delete <b>{{ form.product_name }}</b>? This action cannot be undone.</p>
        <div v-if="deleteError" class="alert alert-error mt-2">{{ deleteError }}</div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="showDeleteConfirm = false">Cancel</button>
          <button class="btn btn-error" :disabled="deleteLoading" @click="handleDelete">
            <span v-if="deleteLoading" class="loading loading-spinner loading-xs mr-2"></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, reactive, nextTick, defineExpose, defineEmits, watch } from 'vue'
import { updateProduct, deleteProduct } from '@/api/product'

const props = defineProps({
  product: { type: Object, required: true }
})
const emit = defineEmits(['close', 'updated'])

const open = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const modalRef = ref(null)
const showDeleteConfirm = ref(false)
const deleteLoading = ref(false)
const deleteError = ref('')

const form = reactive({
  product_name: '',
  description: '',
  price: '',
  stock: '',
  promotion: '',
  sale_start_date: '',
  sale_end_date: '',
  content_status: 'published',
  medias: []
})
const existingMedias = ref([])

watch(() => props.product, (val) => {
  if (val) {
    form.product_name = val.product_name || ''
    form.description = val.description || ''
    form.price = val.price || ''
    form.stock = val.stock || ''
    form.promotion = val.promotion || ''
    form.sale_start_date = val.sale_start_date ? val.sale_start_date.split('T')[0] : ''
    form.sale_end_date = val.sale_end_date ? val.sale_end_date.split('T')[0] : ''
    form.content_status = val.content_status || 'published'
    form.medias = []
    existingMedias.value = Array.isArray(val.medias) ? val.medias : []
    error.value = ''
    success.value = false
  }
}, { immediate: true })



async function openModal() {
  open.value = true
  await nextTick()
  if (modalRef.value) {
    if (typeof modalRef.value.showModal === 'function') {
      modalRef.value.showModal()
    } else {
      modalRef.value.open = true
    }
  }
}

function closeModal() {
  open.value = false
  error.value = ''
  success.value = false
  if (modalRef.value) modalRef.value.close?.()
  emit('close')
}

function handleFiles(e) {
  form.medias = Array.from(e.target.files)
}

function removeExistingMedia(idx) {
  existingMedias.value.splice(idx, 1)
}

function validateForm() {
  if (!form.product_name || form.product_name.length > 255) {
    error.value = 'Product name is required and must be less than 255 characters.'
    return false
  }
  if (form.price === '' || isNaN(form.price) || Number(form.price) < 0) {
    error.value = 'Price is required and must be a non-negative number.'
    return false
  }
  if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0) {
    error.value = 'Stock is required and must be a non-negative integer.'
    return false
  }
  if (form.promotion !== '' && (isNaN(form.promotion) || form.promotion < 0 || form.promotion > 100)) {
    error.value = 'Promotion must be between 0 and 100.'
    return false
  }
  if (form.sale_start_date && form.sale_end_date && form.sale_end_date < form.sale_start_date) {
    error.value = 'Sale end date must be after or equal to sale start date.'
    return false
  }
  return true
}



async function handleSubmit() {
  if (!validateForm()) return
  loading.value = true
  error.value = ''
  success.value = false
  try {
    const data = new FormData()
        // Always send required fields, fallback to original if empty
    data.append('product_name', form.product_name !== '' ? form.product_name : props.product.product_name)
    data.append('price', form.price !== '' ? form.price : props.product.price)
    data.append('stock', form.stock !== '' ? form.stock : props.product.stock)
    // Optional fields
    data.append('description', form.description !== '' ? form.description : (props.product.description || ''))
    if (form.promotion !== '') data.append('promotion', form.promotion)
    if (form.sale_start_date) data.append('sale_start_date', form.sale_start_date)
    if (form.sale_end_date) data.append('sale_end_date', form.sale_end_date)
    data.append('content_status', form.content_status)
    // Attach new medias
    for (let i = 0; i < form.medias.length; i++) {
      data.append('medias[]', form.medias[i])
    }
    // Optionally send existing media IDs to keep
    if (existingMedias.value.length) {
      const ids = existingMedias.value.map(m => m.id).filter(Boolean)
      if (ids.length) data.append('keep_media_ids', JSON.stringify(ids))
    }

    //console log

      //console log
      console.log('Submitting product update:', Object.fromEntries(data.entries()))
    await updateProduct(props.product.id, data, sessionStorage.getItem('token') || localStorage.getItem('token'))
    success.value = true
    setTimeout(() => {
      closeModal()
      emit('updated')
    }, 1200)
  } catch (err) {
    error.value = err.message || 'Failed to update product.'
    console.error('Failed to update product', err)
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  deleteLoading.value = true
  deleteError.value = ''
  try {
    await deleteProduct(props.product.id, sessionStorage.getItem('token') || localStorage.getItem('token'))
    showDeleteConfirm.value = false
    closeModal()
    emit('updated')
  } catch (err) {
    deleteError.value = err.message || 'Failed to delete product.'
  } finally {
    deleteLoading.value = false
  }
}

defineExpose({ openModal, closeModal })
</script>
