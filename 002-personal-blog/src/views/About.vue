<template>
  <div class="about-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">
          <span class="page-icon">👤</span>
          关于我
        </h1>
      </div>
    </div>
    
    <div class="container page-container">
      <div class="main-column">
        <div class="about-section">
          <div class="profile-card">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=blogger" 
              alt="Avatar" 
              class="profile-avatar"
            />
            <h2 class="profile-name">技术爱好者</h2>
            <p class="profile-title">全栈开发者 / 技术博主</p>
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-number">{{ totalPosts }}</span>
                <span class="stat-label">文章</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ totalCategories }}</span>
                <span class="stat-label">分类</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ totalTags }}</span>
                <span class="stat-label">标签</span>
              </div>
            </div>
          </div>
          
          <div class="bio-section">
            <h3 class="section-title">📝 关于本站</h3>
            <div class="bio-content">
              <p>
                欢迎来到我的个人博客！这里是我分享技术心得、学习笔记和生活感悟的地方。
              </p>
              <p>
                我是一名热爱编程的全栈开发者，专注于 Web 开发领域。
                我相信技术可以改变世界，也希望通过分享自己的知识来帮助更多人。
              </p>
            </div>
          </div>
          
          <div class="skills-section">
            <h3 class="section-title">💻 技术栈</h3>
            <div class="skills-grid">
              <div class="skill-category">
                <h4>前端开发</h4>
                <div class="skill-tags">
                  <span class="skill-tag">Vue 3</span>
                  <span class="skill-tag">React</span>
                  <span class="skill-tag">TypeScript</span>
                  <span class="skill-tag">Vite</span>
                  <span class="skill-tag">Tailwind CSS</span>
                </div>
              </div>
              <div class="skill-category">
                <h4>后端开发</h4>
                <div class="skill-tags">
                  <span class="skill-tag">Node.js</span>
                  <span class="skill-tag">Python</span>
                  <span class="skill-tag">MySQL</span>
                  <span class="skill-tag">MongoDB</span>
                  <span class="skill-tag">Redis</span>
                </div>
              </div>
              <div class="skill-category">
                <h4>开发工具</h4>
                <div class="skill-tags">
                  <span class="skill-tag">Git</span>
                  <span class="skill-tag">Docker</span>
                  <span class="skill-tag">Webpack</span>
                  <span class="skill-tag">VS Code</span>
                  <span class="skill-tag">Linux</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="contact-section">
            <h3 class="section-title">📬 联系方式</h3>
            <div class="contact-links">
              <a href="#" class="contact-link">
                <span class="contact-icon">📦</span>
                <span class="contact-text">GitHub</span>
              </a>
              <a href="#" class="contact-link">
                <span class="contact-icon">🐦</span>
                <span class="contact-text">Twitter</span>
              </a>
              <a href="#" class="contact-link">
                <span class="contact-icon">📧</span>
                <span class="contact-text">Email</span>
              </a>
              <a href="#" class="contact-link">
                <span class="contact-icon">💬</span>
                <span class="contact-text">微信</span>
              </a>
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
import { computed } from 'vue'
import { useBlogStore } from '@/store/blog'
import Sidebar from '@/components/Sidebar.vue'

const blogStore = useBlogStore()

const totalPosts = computed(() => blogStore.publishedPosts.length)
const totalCategories = computed(() => blogStore.allCategories.length)
const totalTags = computed(() => blogStore.allTags.length)
</script>

<style scoped>
.about-page {
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
}

.page-icon {
  font-size: 32px;
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

.about-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-card {
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--primary-color);
  margin-bottom: 20px;
}

.profile-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
}

.profile-title {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 14px;
  color: var(--text-light);
}

.bio-section,
.skills-section,
.contact-section {
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 30px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-color);
}

.bio-content {
  color: var(--text-secondary);
  line-height: 1.8;
}

.bio-content p {
  margin-bottom: 16px;
}

.bio-content p:last-child {
  margin-bottom: 0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.skill-category h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.contact-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.contact-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  color: var(--text-secondary);
  transition: var(--transition);
}

.contact-link:hover {
  text-decoration: none;
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.contact-icon {
  font-size: 28px;
}

.contact-text {
  font-size: 14px;
  font-weight: 500;
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
  
  .profile-card {
    padding: 30px 20px;
  }
  
  .profile-name {
    font-size: 24px;
  }
  
  .profile-stats {
    gap: 24px;
  }
  
  .bio-section,
  .skills-section,
  .contact-section {
    padding: 20px;
  }
}
</style>
