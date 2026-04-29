<template>
  <article class="post-card" :class="{ 'pinned': post.isPinned }">
    <router-link :to="`/post/${post.slug}`" class="post-cover">
      <img :src="post.coverImage" :alt="post.title" loading="lazy" />
      <span v-if="post.isPinned" class="pinned-badge">📌 置顶</span>
    </router-link>
    
    <div class="post-content">
      <div class="post-meta">
        <router-link 
          :to="`/category/${category?.slug}`" 
          class="post-category"
        >
          {{ category?.icon }} {{ category?.name }}
        </router-link>
        <span class="post-date">{{ post.createdAt }}</span>
      </div>
      
      <router-link :to="`/post/${post.slug}`" class="post-title">
        <h2>{{ post.title }}</h2>
      </router-link>
      
      <p class="post-excerpt">{{ post.excerpt }}</p>
      
      <div class="post-footer">
        <div class="post-tags">
          <router-link 
            v-for="tag in tags" 
            :key="tag.id"
            :to="`/tag/${tag.slug}`"
            class="post-tag"
          >
            #{{ tag.name }}
          </router-link>
        </div>
        
        <div class="post-stats">
          <span class="stat">
            <span class="stat-icon">👁️</span>
            <span class="stat-value">{{ post.views }}</span>
          </span>
          <span class="stat">
            <span class="stat-icon">❤️</span>
            <span class="stat-value">{{ post.likes }}</span>
          </span>
          <span class="stat">
            <span class="stat-icon">💬</span>
            <span class="stat-value">{{ post.comments?.length || 0 }}</span>
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useBlogStore } from '@/store/blog'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const blogStore = useBlogStore()

const category = computed(() => {
  return blogStore.getCategoryById(props.post.categoryId)
})

const tags = computed(() => {
  return blogStore.getTagsByIds(props.post.tagIds)
})
</script>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.post-card.pinned {
  border: 2px solid var(--primary-color);
}

.post-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-cover:hover {
  text-decoration: none;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-cover img {
  transform: scale(1.05);
}

.pinned-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
}

.post-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.post-category {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  border-radius: 4px;
}

.post-category:hover {
  text-decoration: none;
  color: var(--primary-color);
}

.post-date {
  font-size: 13px;
  color: var(--text-light);
}

.post-title {
  display: block;
  margin-bottom: 12px;
}

.post-title:hover {
  text-decoration: none;
}

.post-title h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  margin: 0;
  transition: color 0.3s ease;
}

.post-card:hover .post-title h2 {
  color: var(--primary-color);
}

.post-excerpt {
  flex: 1;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-tag {
  font-size: 12px;
  color: var(--primary-color);
  opacity: 0.8;
}

.post-tag:hover {
  opacity: 1;
  text-decoration: none;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-light);
}

.stat-icon {
  font-size: 14px;
}

@media (max-width: 768px) {
  .post-cover {
    height: 160px;
  }
  
  .post-content {
    padding: 16px;
  }
  
  .post-title h2 {
    font-size: 16px;
  }
  
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
