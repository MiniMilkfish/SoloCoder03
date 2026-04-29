<template>
  <div class="archive-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">
          <span class="page-icon">🏷️</span>
          标签：{{ tag?.name }}
        </h1>
        <p class="page-desc" v-if="tag">
          包含此标签的文章
          <span class="post-count">共 {{ posts.length }} 篇文章</span>
        </p>
      </div>
    </div>
    
    <div class="container page-container">
      <div class="main-column">
        <div v-if="posts.length > 0" class="posts-list">
          <PostCard v-for="post in paginatedPosts" :key="post.id" :post="post" />
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>暂无文章</h3>
          <p>该标签下还没有文章</p>
          <router-link to="/" class="go-home">返回首页</router-link>
        </div>
        
        <Pagination 
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="handlePageChange"
        />
      </div>
      
      <div class="sidebar-column">
        <div class="sidebar-widget tags-widget">
          <h3 class="widget-title">🏷️ 所有标签</h3>
          <div class="tag-cloud">
            <router-link 
              v-for="t in allTags" 
              :key="t.id"
              :to="`/tag/${t.slug}`"
              class="tag-item"
              :class="{ 'active': t.id === tag?.id }"
              :style="{ fontSize: getTagFontSize(t.count) + 'px' }"
            >
              {{ t.name }}
              <span class="tag-count">({{ t.count }})</span>
            </router-link>
          </div>
        </div>
        
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import PostCard from '@/components/PostCard.vue'
import Pagination from '@/components/Pagination.vue'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const blogStore = useBlogStore()

const tag = ref(null)
const posts = ref([])
const currentPage = ref(1)
const pageSize = 10

const allTags = computed(() => blogStore.allTags)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return posts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(posts.value.length / pageSize)
})

function loadTag() {
  const slug = route.params.slug
  tag.value = blogStore.allTags.find(t => t.slug === slug)
  
  if (tag.value) {
    posts.value = blogStore.getPostsByTag(slug)
    currentPage.value = 1
  }
}

function getTagFontSize(count) {
  const minSize = 12
  const maxSize = 18
  const minCount = Math.min(...blogStore.allTags.map(t => t.count))
  const maxCount = Math.max(...blogStore.allTags.map(t => t.count))
  
  if (maxCount === minCount) return (minSize + maxSize) / 2
  
  return minSize + (count - minCount) * (maxSize - minSize) / (maxCount - minCount)
}

function handlePageChange(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadTag()
})

watch(() => route.params.slug, () => {
  loadTag()
}, { immediate: true })
</script>

<style scoped>
.archive-page {
  min-height: 100%;
}

.page-header {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-color));
  padding: 40px 0;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.page-icon {
  font-size: 32px;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 15px;
}

.post-count {
  margin-left: 12px;
  padding: 2px 10px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  font-size: 13px;
}

.page-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
  padding: 30px 0;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-color);
  border-radius: var(--radius);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: var(--text-color);
  margin-bottom: 12px;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.go-home {
  display: inline-block;
  padding: 10px 24px;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  font-size: 14px;
}

.go-home:hover {
  text-decoration: none;
  opacity: 0.9;
}

.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tags-widget {
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 20px;
  transition: var(--transition);
}

.tag-item:hover {
  text-decoration: none;
  background: var(--primary-color);
  color: white;
}

.tag-item.active {
  background: var(--primary-color);
  color: white;
  font-weight: 500;
}

.tag-count {
  font-size: 11px;
  opacity: 0.7;
}

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar-column {
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 30px 0;
  }
  
  .page-title {
    font-size: 22px;
  }
}
</style>
