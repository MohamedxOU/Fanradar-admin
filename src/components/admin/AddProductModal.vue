<template>
	<dialog ref="modalRef" class="modal" :class="{ 'modal-open': open }">
		<form method="dialog" class="modal-box w-full max-w-2xl" @submit.prevent="handleSubmit">
			<h3 class="font-bold text-lg mb-4">Add Product</h3>
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
				</div>
			</div>
			<div v-if="error" class="alert alert-error mt-4">{{ error }}</div>
			<div v-if="success" class="alert alert-success mt-4">Product added successfully!</div>
			<div class="modal-action mt-6 flex justify-between items-center">
				<button type="button" class="btn" @click="closeModal" :disabled="loading">Cancel</button>
				<button type="submit" class="btn btn-primary" :disabled="loading">
					<span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
					Add Product
				</button>
			</div>
		</form>
	</dialog>
</template>

<script setup>
import { ref, reactive, nextTick, defineExpose, defineEmits } from 'vue'
import { createProduct } from '@/api/product'

const emit = defineEmits(['product-added'])

const open = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const modalRef = ref(null)

const form = reactive({
	product_name: '',
	description: '',
	price: '',
	stock: '',
	promotion: '',
	user_id: '',
	sale_start_date: '',
	sale_end_date: '',
    content_status: 'published',
	medias: []
})

function resetForm() {
	form.product_name = ''
	form.description = ''
	form.price = ''
	form.stock = ''
	form.promotion = ''
	 let user = null
  if (typeof window !== 'undefined') {
    user = sessionStorage.getItem('user') || localStorage.getItem('user')
    if (user) {
      try {
        user = JSON.parse(user)
        form.user_id = user.id
      } catch (e) {
        form.user_id = ''
        console.error('Failed to parse user from storage', e)
      }
    } else {
      form.user_id = ''
    }
  } else {
    form.user_id = ''
  }
	form.sale_start_date = ''
	form.sale_end_date = ''
    form.content_status = 'published'
	form.medias = []
	error.value = ''
	success.value = false
}

async function openModal() {
	open.value = true
	resetForm()
	await nextTick()
	// Try both .showModal() and .open = true for compatibility
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
}

function handleFiles(e) {
	form.medias = Array.from(e.target.files)
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
		data.append('product_name', form.product_name)
		data.append('description', form.description)
		data.append('price', form.price)
		data.append('stock', form.stock)
		if (form.promotion !== '') data.append('promotion', form.promotion)
		data.append('user_id', form.user_id)
		if (form.sale_start_date) data.append('sale_start_date', form.sale_start_date)
		if (form.sale_end_date) data.append('sale_end_date', form.sale_end_date),
    data.append('content_status', form.content_status.toLocaleLowerCase)
		for (let i = 0; i < form.medias.length; i++) {
			data.append('medias[]', form.medias[i])
		}
		await createProduct(data, sessionStorage.getItem('token') || localStorage.getItem('token'))
		success.value = true
		setTimeout(() => {
			closeModal()
			// Emit event to parent to refresh products
			emit('product-added')
		}, 1200)
	} catch (err) {
		error.value = err.message || 'Failed to add product.'
	} finally {
		loading.value = false
	}
}

defineExpose({ openModal, closeModal })
</script>
