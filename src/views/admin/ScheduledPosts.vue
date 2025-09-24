<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Scheduled Posts</h1>
    <div class="card bg-base-100 shadow p-4">
      <table class="table w-full">
        <thead>
          <tr class="bg-base-200">
            <th>Post</th>
            <th>Fandom</th>
            <th>Category</th>
            <th>Scheduled Date</th>
            <th>User</th>
            <th>Status</th>
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
          </tr>
        </tbody>
      </table>
      <div v-if="scheduledPosts.length === 0" class="text-center py-8 text-base-content/60">
        No scheduled posts found.
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'

const scheduledPosts = ref([
  {
    id: 1,
    title: 'Marvel Phase 5 Announcement',
    excerpt: 'Exciting news about the next phase of the Marvel Cinematic Universe!',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400',
    fandom: 'Marvel',
    category: 'Movies',
    scheduledAt: '2025-09-28',
    user: {
      name: 'Tony Stark',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    id: 2,
    title: 'Star Wars: New Jedi Order',
    excerpt: 'A new era begins for the Jedi in this upcoming Star Wars saga.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400',
    fandom: 'Star Wars',
    category: 'TV Shows',
    scheduledAt: '2025-10-01',
    user: {
      name: 'Leia Organa',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  },
  {
    id: 3,
    title: 'Stranger Things S5 Teaser',
    excerpt: 'Get ready for more Upside Down adventures in the next season!',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400',
    fandom: 'Stranger Things',
    category: 'TV Shows',
    scheduledAt: '2025-10-05',
    user: {
      name: 'Eleven',
      avatar: 'https://randomuser.me/api/portraits/women/11.jpg'
    }
  }
])


</script>
