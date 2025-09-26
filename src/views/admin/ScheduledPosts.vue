<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Scheduled Posts</h1>
    <div class="card bg-base-100 shadow p-4">
      <div v-if="loading" class="flex justify-center items-center h-32">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <div v-else-if="error" class="alert alert-error mb-4">{{ error }}</div>
      <div v-else>
        <table class="table w-full">
          <thead>
            <tr class="bg-base-200">
              <th>Post</th>
              <th>Fandom</th>
              <th>Category</th>
              <th>Scheduled Date</th>
              <th>User</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in scheduledPosts" :key="post.id">
              <td>
                <div class="flex items-center gap-3">
                  <img :src="post.image" alt="post.title" class="w-12 h-12 rounded object-cover" />
                  <div>
                    <div class="font-bold">{{ post.title }}</div>
                    <div class="text-sm text-base-content/60 line-clamp-1">{{ post.excerpt }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge badge-primary">{{ post.fandom }}</span>
              </td>
              <td>
                <span class="badge badge-secondary">{{ post.category }}</span>
              </td>
              <td>
                <span class="text-sm">{{ post.scheduledAt }}</span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <img :src="post.user.avatar" alt="post.user.name" class="w-8 h-8 rounded-full" />
                  <span>{{ post.user.name }}</span>
                </div>
              </td>
              <td>
                <span class="badge badge-info">Scheduled</span>
              </td>
              <td>
                <button
                  @click="deletePost(post.id)"
                  class="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                  :disabled="loading"
                >
                  <TrashIcon />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="scheduledPosts.length === 0 && !loading" class="text-center py-8 text-base-content/60">
          No scheduled posts found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getScheduledPosts, deletePostById } from '@/api/posts'
import { useAuthStore } from '@/stores/auth'
import TrashIcon from '@/icons/TrashIcon.vue'

const auth = useAuthStore()
const scheduledPosts = ref([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

// Helper function to resolve image URLs
const resolveImageUrl = (imagePath) => {
  if (!imagePath) return '/public/images/test_logo.png'
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  return `${import.meta.env.VITE_STORAGE_URL}/storage/${imagePath}`
}

const fetchScheduledPosts = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const res = await getScheduledPosts(page, auth.token)
    const postsData = res?.data?.data || []

    scheduledPosts.value = postsData.map(post => {
      // Get user name
      const userName = post.user ? `${post.user.first_name || ''} ${post.user.last_name || ''}`.trim() : 'Unknown User'

      // Get user avatar
      let avatar = '/public/images/test_logo.png'
      if (post.user && post.user.profile_image) {
        avatar = post.user.profile_image.startsWith('http')
          ? post.user.profile_image
          : resolveImageUrl(post.user.profile_image)
      }

      // Get post image from medias
      let image = '/public/images/test_logo.png'
      if (post.medias && post.medias.length > 0) {
        image = resolveImageUrl(post.medias[0].file_path)
      }

      return {
        id: post.id,
        title: post.description ? post.description.slice(0, 50) + (post.description.length > 50 ? '...' : '') : 'Untitled Post',
        excerpt: post.description || 'No description available',
        image,
        fandom: 'General', // Default since fandom_id is null in response
        category: post.subcategory_id ? 'Categorized' : 'General',
        scheduledAt: post.schedule_at ? new Date(post.schedule_at).toLocaleDateString() : 'Not scheduled',
        user: {
          name: userName,
          avatar
        }
      }
    })

    currentPage.value = res?.data?.current_page || 1
    totalPages.value = res?.data?.last_page || 1
  } catch (e) {
    error.value = e?.message || 'Failed to load scheduled posts'
    console.error('Failed to fetch scheduled posts:', e)
  } finally {
    loading.value = false
  }
}

const deletePost = async (postId) => {
  // Show confirmation dialog
  const confirmed = confirm('Are you sure you want to delete this scheduled post? This action cannot be undone.')

  if (!confirmed) {
    return
  }

  try {
    loading.value = true
    await deletePostById(postId, auth.token)

    // Remove the post from the local array
    scheduledPosts.value = scheduledPosts.value.filter(post => post.id !== postId)

    // Show success message
    alert('Post deleted successfully!')
  } catch (e) {
    console.error('Failed to delete post:', e)
    alert('Failed to delete post. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchScheduledPosts()
})
</script>
