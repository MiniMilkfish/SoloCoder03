<template>
  <div class="home-page">
    <div class="container page-container">
      <div class="main-column">
        <section v-if="pinnedPosts.length > 0" class="pinned-section">
          <h2 class="section-title">📌 置顶文章</h2>
          <div class="pinned-posts">
            <PostCard v-for="post in pinnedPosts" :key="post.id" :post="post" />
          </div>
        </section>
        
        <section class="latest-section">
          <h2 class="section-title">📝 最新文章</h2>
          <div class="latest-posts">
            <PostCard v-for="post in paginatedPosts" :key="post.id" :post="post" />
          </div>
          
          <Pagination 
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="handlePageChange"
          />
        </section>
      </div>
      
      <div class="sidebar-column">
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useBlogStore } from '@/store/blog'
import PostCard from '@/components/PostCard.vue'
import Pagination from '@/components/Pagination.vue'
import Sidebar from '@/components/Sidebar.vue'

const blogStore = useBlogStore()

const pinnedPosts = computed(() => blogStore.pinnedPosts)
const paginatedPosts = computed(() => blogStore.paginatedPosts)
const totalPages = computed(() => blogStore.totalPages)
const currentPage = computed(() => blogStore.currentPage)

onMounted(() => {
  console.log('All posts:', blogStore.allPosts)
  console.log('Published posts:', blogStore.publishedPosts)
  console.log('Pinned posts:', blogStore.pinnedPosts)
  console.log('Paginated posts:', blogStore.paginatedPosts)
})

function handlePageChange(page) {
  blogStore.setPage(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.home-page {
  min-height: 100%;
  padding: 30px 0;
}

.page-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar-column {
  position: sticky;
  top: calc(var(--header-height) + 30px);
  height: fit-content;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 4px solid var(--primary-color);
  color: var(--text-color);
}

.pinned-section {
  padding: 20px;
  background: var(--bg-color);
  border-radius: var(--radius);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.pinned-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.latest-posts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar-column {
    order: -1;
    position: static;
  }
  
  .pinned-posts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 20px 0;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .pinned-section {
    padding: 16px;
  }
}
</style>
