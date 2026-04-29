<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">页面未找到</h1>
        <p class="error-desc">
          抱歉，您访问的页面不存在或已被移除。<br />
          请检查您输入的地址是否正确，或返回首页继续浏览。
        </p>
        
        <div class="error-actions">
          <router-link to="/" class="action-btn primary-btn">
            🏠 返回首页
          </router-link>
          <router-link to="/search" class="action-btn secondary-btn">
            🔍 搜索文章
          </router-link>
        </div>
        
        <div class="suggestions">
          <h3>热门文章推荐</h3>
          <div class="suggested-posts">
            <router-link 
              v-for="post in hotPosts" 
              :key="post.id"
              :to="`/post/${post.slug}`"
              class="suggested-post"
            >
              <img :src="post.coverImage" :alt="post.title" />
              <div class="post-info">
                <h4>{{ post.title }}</h4>
                <p>{{ post.excerpt }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBlogStore } from '@/store/blog'

const blogStore = useBlogStore()

const hotPosts = computed(() => {
  return [...blogStore.publishedPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3)
})
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - var(--header-height) - 100px);
  display: flex;
  align-items: center;
  padding: 60px 0;
}

.not-found-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 20px;
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 16px;
}

.error-desc {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 50px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 500;
  transition: var(--transition);
}

.primary-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.primary-btn:hover {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.secondary-btn {
  background: var(--bg-color);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
}

.secondary-btn:hover {
  text-decoration: none;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.suggestions {
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 30px;
  text-align: left;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.suggestions h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-color);
}

.suggested-posts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.suggested-post {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  transition: var(--transition);
}

.suggested-post:hover {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.suggested-post img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.post-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-info p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .not-found-page {
    padding: 40px 0;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 250px;
    justify-content: center;
  }
  
  .suggestions {
    padding: 20px;
  }
  
  .suggested-posts {
    grid-template-columns: 1fr;
  }
  
  .suggested-post {
    flex-direction: row;
  }
  
  .suggested-post img {
    width: 100px;
    height: 80px;
    flex-shrink: 0;
  }
}
</style>
