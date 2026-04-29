<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于本站</h3>
          <p>这是一个基于 Vue 3 + Vite 构建的个人博客系统，支持 Markdown 写作、代码高亮、响应式布局等特性。</p>
          <div class="social-links">
            <a href="#" class="social-link" title="GitHub">📦 GitHub</a>
            <a href="#" class="social-link" title="Twitter">🐦 Twitter</a>
            <a href="#" class="social-link" title="Email">📧 Email</a>
          </div>
        </div>
        
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul class="footer-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/category/frontend">前端开发</router-link></li>
            <li><router-link to="/category/backend">后端开发</router-link></li>
            <li><router-link to="/about">关于我</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>热门标签</h3>
          <div class="tag-cloud">
            <router-link 
              v-for="tag in hotTags" 
              :key="tag.id"
              :to="`/tag/${tag.slug}`"
              class="footer-tag"
            >
              {{ tag.name }}
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2024 个人博客. All rights reserved.</p>
        <p>Powered by Vue 3 + Vite</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useBlogStore } from '@/store/blog'

const blogStore = useBlogStore()

const hotTags = computed(() => {
  return blogStore.allTags
    .filter(tag => tag.count > 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
})
</script>

<style scoped>
.footer {
  background: var(--bg-color);
  border-top: 1px solid var(--border-color);
  padding: 40px 0 20px;
  margin-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h3 {
  font-size: 16px;
  margin-bottom: 16px;
  color: var(--text-color);
}

.footer-section p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 16px;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-size: 13px;
}

.social-link:hover {
  text-decoration: none;
  color: var(--primary-color);
  background: var(--border-color);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: var(--text-secondary);
}

.footer-links a:hover {
  color: var(--primary-color);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-tag {
  display: inline-block;
  padding: 4px 12px;
  background: var(--bg-secondary);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary);
}

.footer-tag:hover {
  text-decoration: none;
  color: var(--primary-color);
  background: var(--border-color);
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-light);
  font-size: 13px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>
