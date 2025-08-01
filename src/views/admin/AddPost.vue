<template>
  <div class="p-6 space-y-6">
    <!-- Title & Actions -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-base-content">Create New Post</h1>
      <div class="flex gap-3">
        <button class="btn btn-outline">Preview</button>
        <button class="btn btn-primary">Save</button>
      </div>
    </div>

    <!-- Post Editor Card -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body space-y-6">

        <!-- Title Input -->
        <input
          v-model="post.title"
          type="text"
          placeholder="Post Title"
          class="input input-bordered text-xl font-semibold w-full"
        />

        <!-- Rich Text Editor -->
        <div>
          <label class="label font-medium">Content</label>
          <textarea
            v-model="post.content"
            class="textarea textarea-bordered w-full h-32"
            placeholder="Write your content here..."
          ></textarea>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="label font-medium">Image</label>
          <div class="border border-dashed border-base-300 p-4 rounded-lg">
            <input type="file" class="file-input w-full max-w-xs" @change="handleImageUpload" />
            <input type="text" v-model="post.caption" placeholder="Caption" class="input input-bordered mt-2 w-full" />
          </div>
        </div>

        <!-- Add More Blocks -->
        <div>
          <button class="btn btn-outline btn-sm">+ Add Block</button>
        </div>
      </div>
    </div>

    <!-- Sidebar: Meta Info -->
    <div class="card bg-base-100 shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Author -->
        <div>
          <label class="label font-medium">Author</label>
          <select v-model="post.author" class="select select-bordered w-full">
            <option value="David Clarke">David Clarke</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <!-- Date & Time -->
        <div>
          <label class="label font-medium">Post Date</label>
          <input type="datetime-local" v-model="post.date" class="input input-bordered w-full" />
        </div>

        <!-- Category -->
        <div>
          <label class="label font-medium">Category</label>
          <input type="text" v-model="post.category" placeholder="e.g. Big Data" class="input input-bordered w-full" />
        </div>

        <!-- Tags -->
        <div>
          <label class="label font-medium">Tags</label>
          <input type="text" v-model="post.tags" placeholder="e.g. Big Data, AI" class="input input-bordered w-full" />
        </div>

        <!-- Toggles -->
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">Published Globally</span>
            <input type="checkbox" v-model="post.global" class="toggle toggle-primary" />
          </label>
          <label class="cursor-pointer label mt-2">
            <span class="label-text">Published in English</span>
            <input type="checkbox" v-model="post.english" class="toggle toggle-primary" />
          </label>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const post = ref({
  title: '',
  content: '',
  caption: '',
  image: null,
  author: 'David Clarke',
  date: new Date().toISOString().slice(0, 16), // default to now
  category: 'Big Data',
  tags: 'Big Data',
  global: true,
  english: true
})

function handleImageUpload(event) {
  const file = event.target.files[0]
  post.value.image = file
}
</script>
