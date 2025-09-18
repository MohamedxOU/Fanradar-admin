<template>
  <div v-if="visible" class="modal modal-open bg-base-300">
    <div class="modal-box max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-xl">Order #{{ order?.id }}</h3>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" @click="printOrder" title="Print">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9V2h12v7M6 18v2a2 2 0 002 2h8a2 2 0 002-2v-2M6 14h12a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>
          </button>
          <button class="btn btn-ghost btn-sm" @click="close">✕</button>
        </div>
      </div>
      <div v-if="loading" class="flex justify-center items-center h-32">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <div v-else-if="error" class="alert alert-error">{{ error }}</div>
      <div v-else>
        <!-- Customer Info -->
        <div class="flex items-center gap-4 mb-6">
          <div class="avatar">
            <div class="w-16 h-16 rounded-full border border-base-200 overflow-hidden">
              <img :src="resolveImg(order.user?.profile_image)" :alt="order.user?.first_name" />
            </div>
          </div>
          <div>
            <div class="font-bold text-lg">{{ order.user?.first_name }} {{ order.user?.last_name }}</div>
            <div class="text-base-content/60">{{ order.user?.email }}</div>
            <div class="text-xs text-base-content/40">Joined: {{ formatDate(order.user?.created_at) }}</div>
          </div>
        </div>
        <!-- Order Info -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div class="text-sm text-base-content/60">Order Date</div>
            <div class="font-bold">{{ formatDate(order.order_date || order.created_at) }}</div>
          </div>
          <div>
            <div class="text-sm text-base-content/60">Status</div>
            <span class="badge" :class="statusBadgeClass(order.status)">{{ order.status }}</span>
          </div>
          <div>
            <div class="text-sm text-base-content/60">Total Amount</div>
            <div class="font-bold">${{ Number(order.total_amount).toFixed(2) }}</div>
          </div>
          <div>
            <div class="text-sm text-base-content/60">Products</div>
            <div class="font-bold">{{ order.products?.length || 0 }}</div>
          </div>
        </div>
        <!-- Products List -->
        <div>
          <h4 class="font-bold text-lg mb-2">Products</h4>
          <div v-if="order.products && order.products.length > 0" class="divide-y divide-base-200">
            <div v-for="prod in order.products" :key="prod.id" class="flex items-center gap-4 py-3">
              <div class="avatar">
                <div class="w-12 h-12 rounded border border-base-200 overflow-hidden">
                  <img :src="resolveImg(prod.medias && prod.medias.length > 0 ? prod.medias[0].url : null)" :alt="prod.product_name" />
                </div>
              </div>
              <div class="flex-1">
                <div class="font-bold">{{ prod.product_name }}</div>
                <div class="text-xs text-base-content/60">{{ prod.description }}</div>
                <div class="text-xs text-base-content/40">Quantity: {{ prod.pivot?.quantity || 1 }}</div>
              </div>
              <div class="text-right">
                <div class="font-bold">${{ Number(prod.price).toFixed(2) }}</div>
                <span class="badge badge-outline badge-sm">{{ prod.type }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-base-content/60">No products found for this order.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getOrderById } from '@/api/orders'

const props = defineProps({
  order: {
    type: Object,
    default: null
  },
  visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close'])

const loading = ref(false)
const error = ref('')

const close = () => {
  emit('close')
}

const printOrder = () => {
  window.print()
}

const resolveImg = (img) => {
  if (!img) return '/public/images/test_logo.png'
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  const base = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000'
  return `${base}/${img}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const statusBadgeClass = (status) => {
  const classes = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-error',
    refunded: 'badge-neutral'
  }
  return classes[status] || 'badge-ghost'
}

const order = ref(props.order || null)

const fetchOrderDetails = async (id) => {
  loading.value = true
  error.value = ''
  try {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    const res = await getOrderById(id, token)
    order.value = res
  } catch (e) {
    error.value = e?.message || 'Failed to load order details.'
  } finally {
    loading.value = false
  }
}

watch(() => props.visible, (val) => {
  if (val && props.order?.id) {
    fetchOrderDetails(props.order.id)
  }
})

onMounted(() => {
  if (props.visible && props.order?.id) {
    fetchOrderDetails(props.order.id)
  }
})
</script>

<style scoped>
.modal-open {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.2);
  z-index: 100;
}
.modal-box {
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgb(0 0 0 / 0.12);
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
