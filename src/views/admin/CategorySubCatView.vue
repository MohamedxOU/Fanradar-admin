
<template>
	<div class="p-6">
		<div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
			<div class="flex-1">
				<h2 class="text-2xl font-bold mb-6 md:mb-0">Categories & Subcategories</h2>
				<input v-model="search" type="text" placeholder="Search category or subcategory..." class="mt-4 input input-bordered w-full md:w-80" />
			</div>
			<div class="space-x-2 flex-shrink-0">
				<button class="btn btn-primary" @click="showAddCategory = true">Add Category</button>
				<button class="btn btn-error" @click="deleteAllCategories" :disabled="loading || categories.length === 0">Delete All Categories</button>
			</div>

		</div>

		<div v-if="loading" class="flex justify-center items-center h-32">
			<span class="loading loading-spinner loading-lg"></span>
		</div>

		<div v-else>
			<div v-if="filteredCategories.length === 0" class="text-center text-base-content/60 py-8">
				No categories found.
			</div>
			<div v-else class="overflow-x-auto">
				<table class="table w-full table-fixed">
					<thead>
						<tr>
							<th class="w-1/5 truncate">Category</th>
							<th class="w-3/5 truncate">Subcategories</th>
							<th class="w-1/5 truncate">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="category in paginatedCategories" :key="category.id">
							<td class="font-semibold truncate" :title="category.name">{{ category.name }}</td>
							<td>
								<ul>
									<li v-for="sub in category.subcategories" :key="sub.id" class="flex items-center justify-between">
										<span class="truncate" :title="sub.name">{{ sub.name }}</span>
										<button class="btn btn-xs btn-error ml-2 mb-2" @click="deleteSubcategory(sub.id)">Delete subcategory</button>
									</li>
									<li v-if="!category.subcategories || category.subcategories.length === 0" class="text-xs text-base-content/50">No subcategories</li>
								</ul>
							</td>
							<td class="flex gap-2">
								<button class="btn btn-xs btn-accent" @click="openAddSubcategory(category.id)">Add</button>
								<button class="btn btn-xs btn-error" @click="deleteCategoryHandler(category.id)">Delete</button>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- Pagination Controls -->
				<div class="flex justify-center mt-4" v-if="totalPages > 1">
					<button class="btn btn-sm mx-1" :disabled="currentPage === 1" @click="currentPage--">Prev</button>
					<button
						v-for="page in totalPages"
						:key="page"
						class="btn btn-sm mx-1"
						:class="{ 'btn-primary': page === currentPage }"
						@click="goToPage(page)"
					>
						{{ page }}
					</button>
					<button class="btn btn-sm mx-1" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
				</div>
			</div>
		</div>

		<!-- Add Category Modal -->
		<AddCategoryModal v-if="showAddCategory" @close="showAddCategory = false" @save="handleAddCategory" />
		<!-- Add Subcategory Modal -->
		<AddSubcategoryModal
			v-if="showAddSubcategory"
			:category-id="addSubcategoryCategoryId"
			@close="showAddSubcategory = false"
			@save="handleAddSubcategory"
		/>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCategories, getSubCategories, createCategory, deleteCategory, createSubCategory, deleteSubCategory } from '@/api/categoryAndSubCat'
import AddCategoryModal from '@/components/admin/AddCategoryModal.vue'
import AddSubcategoryModal from '@/components/admin/AddSubcategoryModal.vue'
import { useAuthStore } from '@/stores/auth'


const categories = ref([])
const loading = ref(false)
const showAddCategory = ref(false)
const showAddSubcategory = ref(false)
const addSubcategoryCategoryId = ref(null)
const auth = useAuthStore()

// Pagination and search
const search = ref('')
const currentPage = ref(1)
const pageSize = 15

const filteredCategories = computed(() => {
	if (!search.value.trim()) return categories.value
	const q = search.value.trim().toLowerCase()
	return categories.value.filter(cat => {
		if (cat.name.toLowerCase().includes(q)) return true
		if (cat.subcategories.some(sub => sub.name.toLowerCase().includes(q))) return true
		return false
	})
})

// Delete all categories
const deleteAllCategories = async () => {
	if (!categories.value.length) return
	if (!confirm('Are you sure you want to delete ALL categories? This action cannot be undone.')) return
	loading.value = true
	try {
		for (const cat of categories.value) {
			try {
				await deleteCategory(cat.id, auth.token)
			} catch (e) {
				// Optionally handle individual errors
				console.error(`Failed to delete category ${cat.name}`, e)
			}
		}
		alert('All categories deleted successfully')
		await fetchCategories()
	} catch (e) {
		alert('Failed to delete all categories')
		console.error('Failed to delete all categories', e)
	} finally {
		loading.value = false
	}
}

const totalPages = computed(() => Math.ceil(filteredCategories.value.length / pageSize))
const paginatedCategories = computed(() => {
	const start = (currentPage.value - 1) * pageSize
	return filteredCategories.value.slice(start, start + pageSize)
})

function goToPage(page) {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page
	}
}
const deleteCategoryHandler = async (id) => {
	if (!confirm('Are you sure you want to delete this category?')) return
	loading.value = true
	try {
		await deleteCategory(id, auth.token)
		alert('Category deleted successfully')
		await fetchCategories()
	} catch (e) {
		alert('Failed to delete category')
		console.error('Failed to delete category', e)
	} finally {
		loading.value = false
	}
}

const fetchCategories = async () => {
	loading.value = true
	try {
		const [catRes, subRes] = await Promise.all([
			getCategories(),
			getSubCategories()
		])
		const cats = Array.isArray(catRes) ? catRes : []
		const subs = Array.isArray(subRes) ? subRes : []
		const catMap = cats.map(cat => ({ ...cat, subcategories: [] }))
		subs.forEach(sub => {
			const cat = catMap.find(c => c.id === sub.category_id)
			if (cat) {
				cat.subcategories.push(sub)
			}
		})
		categories.value = catMap
		currentPage.value = 1 // Reset to first page on reload
	} catch (e) {
		categories.value = []
		console.error('Failed to fetch categories or subcategories', e)
	} finally {
		loading.value = false
	}
}


const handleAddCategory = async (data) => {
	try {
		loading.value = true
		await createCategory(data, auth.token)
		showAddCategory.value = false
		await fetchCategories()
	} catch (e) {
		console.error('Failed to add category', e)
		alert('Failed to add category')
	} finally {
		loading.value = false
	}
}


const openAddSubcategory = (categoryId) => {
	addSubcategoryCategoryId.value = categoryId
	showAddSubcategory.value = true
}

const handleAddSubcategory = async (data) => {
	try {
		loading.value = true
		await createSubCategory({
			name: data.name,
			category_id: addSubcategoryCategoryId.value
		}, auth.token)
		showAddSubcategory.value = false
		addSubcategoryCategoryId.value = null
		await fetchCategories()
	} catch (e) {
		alert('Failed to add subcategory')
		console.error('Failed to add subcategory', e)
	} finally {
		loading.value = false
	}
}


const deleteSubcategory = async (id) => {
	if (!confirm('Are you sure you want to delete this subcategory?')) return
	try {
		await deleteSubCategory(id, auth.token)
		fetchCategories()
	} catch (e) {
		alert('Failed to delete subcategory')
    console.error('Failed to delete subcategory', e)
	}
}

onMounted(fetchCategories)

// Alias for deleteCategory to avoid shadowing import

</script>
