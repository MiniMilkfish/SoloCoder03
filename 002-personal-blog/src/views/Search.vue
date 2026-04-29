<template>
  <div class="search-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">
          <span class="page-icon">🔍</span>
          搜索
        </h1>
        <div class="search-box-large">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="输入关键词搜索文章..."
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            搜索
          </button>
        </div>
      </div>
    </div>
    
    <div class="container page-container">
      <div class="main-column">
        <div v-if="hasSearched">
          <div class="search-result-info">
            <template v-if="results.length > 0">
              找到 <span class="result-count">{{ results.length }}</span> 篇关于 
              <span class="search-keyword">"{{ searchKeyword }}"</span> 的文章
            </template>
            <template v-else>
              没有找到关于 
              <span class="search-keyword">"{{ searchKeyword }}"</span> 的文章
            </template>
          </div>
          
          <div v-if="results.length > 0" class="posts-list">
            <PostCard v-for="post in paginatedResults" :key="post.id" :post="post" />
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>没有找到相关文章</h3>
            <p>请尝试其他关键词</p>
            <div class="suggested-tags">
              <span class="suggest-label">热门搜索：</span>
              <router-link 
                v-for="tag in hotTags" 
                :key="tag.id"
                :to="`/tag/${tag.slug}`"
                class="suggest-tag"
              >
                {{ tag.name }}
              </router-link>
            </div>
          </div>
          
          <Pagination 
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="handlePageChange"
          />
        </div>
        
        <div v-else class="search-placeholder">
          <div class="placeholder-icon">📚</div>
          <h3>开始搜索</h3>
          <p>输入关键词搜索文章，或浏览热门标签</p>
          
          <div class="popular-searches">
            <h4>热门标签</h4>
            <div class="tags-cloud">
              <router-link 
                v-for="tag in hotTags" 
                :key="tag.id"
                :to="`/tag/${tag.slug}`"
                class="tag-item"
              >
                {{ tag.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div class="sidebar-column">
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import PostCard from '@/components/PostCard.vue'
import Pagination from '@/components/Pagination.vue'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const searchQuery = ref('')
const searchKeyword = ref('')
const results = ref([])
const hasSearched = ref(false)
const currentPage = ref(1)
const pageSize = 10

const hotTags = computed(() => {
  return [...blogStore.allTags]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return results.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(results.value.length / pageSize)
})

function handleSearch() {
  const query = searchQuery.value.trim()
  if (!query) return
  
  searchKeyword.value = query
  results.value = blogStore.searchPosts(query)
  hasSearched.value = true
  currentPage.value = 1
  
  router.replace({
    path: '/search',
    query: { q: query }
  })
}

function handlePageChange(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  const q = route.query.q
  if (q) {
    searchQuery.value = q
    handleSearch()
  }
})

watch(() => route.query.q, (newQ) => {
  if (newQ && newQ !== searchQuery.value) {
    searchQuery.value = newQ
    handleSearch()
  }
})
</script>

<style scoped>
.search-page {
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
  margin-bottom: 24px;
}

.page-icon {
  font-size: 32px;
}

.search-box-large {
  display: flex;
  max-width: 600px;
}

.search-box-large input {
  flex: 1;
  padding: 14px 20px;
  font-size: 16px;
  border: 2px solid var(--border-color);
  border-right: none;
  border-radius: var(--radius) 0 0 var(--radius);
  background: var(--bg-color);
  color: var(--text-color);
  transition: var(--transition);
}

.search-box-large input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-box-large .search-btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 0 var(--radius) var(--radius) 0;
  transition: var(--transition);
}

.search-box-large .search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.search-result-info {
  padding: 16px 20px;
  background: var(--bg-color);
  border-radius: var(--radius);
  color: var(--text-secondary);
}

.result-count,
.search-keyword {
  color: var(--primary-color);
  font-weight: 600;
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

.suggested-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.suggest-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.suggest-tag {
  padding: 6px 14px;
  background: var(--bg-secondary);
  color: var(--primary-color);
  border-radius: 20px;
  font-size: 13px;
}

.suggest-tag:hover {
  text-decoration: none;
  background: var(--primary-color);
  color: white;
}

.search-placeholder {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-color);
  border-radius: var(--radius);
}

.placeholder-icon {
  font-size: 72px;
  margin-bottom: 24px;
}

.search-placeholder h3 {
  font-size: 24px;
  color: var(--text-color);
  margin-bottom: 12px;
}

.search-placeholder p {
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.popular-searches {
  max-width: 500px;
  margin: 0 auto;
}

.popular-searches h4 {
  font-size: 16px;
  color: var(--text-color);
  margin-bottom: 16px;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.tag-item {
  display: inline-block;
  padding: 8px 18px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 14px;
  transition: var(--transition);
}

.tag-item:hover {
  text-decoration: none;
  background: var(--primary-color);
  color: white;
}

.sidebar-column {
  position: sticky;
  top: calc(var(--header-height) + 30px);
  height: fit-content;
}

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar-column {
    order: -1;
    position: static;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 30px 0;
  }
  
  .page-title {
    font-size: 22px;
  }
  
  .search-box-large {
    flex-direction: column;
  }
  
  .search-box-large input,
  .search-box-large .search-btn {
    border-radius: var(--radius);
  }
  
  .search-box-large input {
    border: 2px solid var(--border-color);
    border-bottom: none;
  }
}
</style>
