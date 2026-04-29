<template>
  <aside class="sidebar">
    <div class="sidebar-widget">
      <h3 class="widget-title">📂 文章分类</h3>
      <ul class="category-list">
        <li v-for="category in categories" :key="category.id">
          <router-link :to="`/category/${category.slug}`" class="category-item">
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.count }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    
    <div class="sidebar-widget">
      <h3 class="widget-title">🏷️ 热门标签</h3>
      <div class="tag-cloud">
        <router-link 
          v-for="tag in hotTags" 
          :key="tag.id"
          :to="`/tag/${tag.slug}`"
          class="tag-item"
          :style="{ fontSize: getTagFontSize(tag.count) + 'px' }"
        >
          {{ tag.name }}
        </router-link>
      </div>
    </div>
    
    <div class="sidebar-widget">
      <h3 class="widget-title">🔥 热门文章</h3>
      <ul class="hot-posts">
        <li v-for="(post, index) in hotPosts" :key="post.id">
          <router-link :to="`/post/${post.slug}`" class="hot-post-item">
            <span class="hot-rank" :class="{ 'top': index < 3 }">{{ index + 1 }}</span>
            <span class="hot-post-title">{{ post.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    
    <div class="sidebar-widget author-card">
      <h3 class="widget-title">👤 关于博主</h3>
      <div class="author-info">
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=blogger" 
          alt="Author" 
          class="author-avatar"
        />
        <h4 class="author-name">技术爱好者</h4>
        <p class="author-bio">热爱编程，分享技术。专注于前端开发、全栈架构和最佳实践。</p>
        <div class="author-stats">
          <div class="author-stat">
            <span class="stat-number">{{ totalPosts }}</span>
            <span class="stat-label">文章</span>
          </div>
          <div class="author-stat">
            <span class="stat-number">{{ totalCategories }}</span>
            <span class="stat-label">分类</span>
          </div>
          <div class="author-stat">
            <span class="stat-number">{{ totalTags }}</span>
            <span class="stat-label">标签</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useBlogStore } from '@/store/blog'

const blogStore = useBlogStore()

const categories = computed(() => blogStore.allCategories)
const hotTags = computed(() => {
  return [...blogStore.allTags]
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
})

const hotPosts = computed(() => {
  return [...blogStore.publishedPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
})

const totalPosts = computed(() => blogStore.publishedPosts.length)
const totalCategories = computed(() => blogStore.allCategories.length)
const totalTags = computed(() => blogStore.allTags.length)

function getTagFontSize(count) {
  const minSize = 12
  const maxSize = 20
  const minCount = Math.min(...blogStore.allTags.map(t => t.count))
  const maxCount = Math.max(...blogStore.allTags.map(t => t.count))
  
  if (maxCount === minCount) return (minSize + maxSize) / 2
  
  return minSize + (count - minCount) * (maxSize - minSize) / (maxCount - minCount)
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-widget {
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.widget-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-color);
  color: var(--text-color);
}

.category-list {
  list-style: none;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  color: var(--text-secondary);
  transition: var(--transition);
  border-bottom: 1px dashed var(--border-color);
}

.category-item:hover {
  text-decoration: none;
  color: var(--primary-color);
}

.category-item:last-child {
  border-bottom: none;
}

.category-icon {
  font-size: 18px;
}

.category-name {
  flex: 1;
}

.category-count {
  font-size: 12px;
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: 12px;
  color: var(--text-light);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-block;
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

.hot-posts {
  list-style: none;
}

.hot-post-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  color: var(--text-secondary);
  transition: var(--transition);
  border-bottom: 1px dashed var(--border-color);
}

.hot-post-item:hover {
  text-decoration: none;
  color: var(--primary-color);
}

.hot-post-item:last-child {
  border-bottom: none;
}

.hot-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--bg-secondary);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.hot-rank.top {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.hot-post-title {
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.author-card {
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
  border: 3px solid var(--border-color);
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

.author-bio {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.author-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.author-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
}

@media (max-width: 1024px) {
  .sidebar {
    order: -1;
  }
}
</style>
