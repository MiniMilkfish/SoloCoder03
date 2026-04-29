<template>
  <div class="post-detail-page" v-if="post">
    <div class="post-hero">
      <div class="container">
        <div class="post-header">
          <div class="post-breadcrumb">
            <router-link to="/">首页</router-link>
            <span class="separator">›</span>
            <router-link :to="`/category/${category?.slug}`">
              {{ category?.name }}
            </router-link>
            <span class="separator">›</span>
            <span>{{ post.title }}</span>
          </div>
          
          <h1 class="post-title">{{ post.title }}</h1>
          
          <div class="post-meta-info">
            <div class="meta-left">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=blogger" 
                alt="Author" 
                class="author-avatar"
              />
              <div class="author-info">
                <span class="author-name">技术爱好者</span>
                <span class="post-time">
                  <span>📅 {{ post.createdAt }}</span>
                  <span v-if="post.updatedAt !== post.createdAt">
                    (更新于 {{ post.updatedAt }})
                  </span>
                </span>
              </div>
            </div>
            
            <div class="meta-right">
              <span class="meta-item">👁️ {{ post.views }} 阅读</span>
              <span class="meta-item">❤️ {{ post.likes }} 点赞</span>
              <span class="meta-item">💬 {{ post.comments.length }} 评论</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container page-container">
      <div class="main-column">
        <article class="post-content">
          <div 
            class="markdown-body"
            v-html="renderedContent"
          ></div>
          
          <div class="post-tags-section">
            <span class="tags-label">🏷️ 标签：</span>
            <router-link 
              v-for="tag in tags" 
              :key="tag.id"
              :to="`/tag/${tag.slug}`"
              class="post-tag"
            >
              {{ tag.name }}
            </router-link>
          </div>
          
          <div class="post-actions">
            <button 
              class="action-btn like-btn"
              :class="{ 'liked': hasLiked }"
              @click="handleLike"
            >
              <span class="action-icon">{{ hasLiked ? '❤️' : '🤍' }}</span>
              <span class="action-text">{{ hasLiked ? '已点赞' : '点赞' }}</span>
              <span class="action-count">{{ post.likes }}</span>
            </button>
            
            <button class="action-btn share-btn" @click="handleShare">
              <span class="action-icon">🔗</span>
              <span class="action-text">分享</span>
            </button>
          </div>
        </article>
        
        <section v-if="relatedPosts.length > 0" class="related-section">
          <h3 class="section-title">📚 相关推荐</h3>
          <div class="related-posts">
            <router-link 
              v-for="relatedPost in relatedPosts" 
              :key="relatedPost.id"
              :to="`/post/${relatedPost.slug}`"
              class="related-post-card"
            >
              <img :src="relatedPost.coverImage" :alt="relatedPost.title" />
              <div class="related-post-info">
                <h4>{{ relatedPost.title }}</h4>
                <p class="related-post-meta">
                  <span>👁️ {{ relatedPost.views }}</span>
                  <span>📅 {{ relatedPost.createdAt }}</span>
                </p>
              </div>
            </router-link>
          </div>
        </section>
        
        <section class="comments-section">
          <h3 class="section-title">💬 评论 ({{ post.comments.length }})</h3>
          
          <div class="comment-form">
            <div class="form-row">
              <div class="form-group">
                <label>昵称</label>
                <input 
                  type="text" 
                  v-model="newComment.author"
                  placeholder="请输入您的昵称"
                />
              </div>
              <div class="form-group">
                <label>邮箱 (不公开)</label>
                <input 
                  type="email" 
                  v-model="newComment.email"
                  placeholder="请输入您的邮箱"
                />
              </div>
            </div>
            <div class="form-group">
              <label>评论内容</label>
              <textarea 
                v-model="newComment.content"
                placeholder="写下您的评论..."
                rows="4"
              ></textarea>
            </div>
            <button class="submit-btn" @click="submitComment">
              发表评论
            </button>
          </div>
          
          <div class="comments-list">
            <div v-if="post.comments.length === 0" class="no-comments">
              暂无评论，快来抢沙发吧！
            </div>
            
            <div 
              v-for="comment in post.comments" 
              :key="comment.id"
              class="comment-item"
            >
              <img 
                :src="comment.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`"
                :alt="comment.author"
                class="comment-avatar"
              />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-date">{{ comment.createdAt }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <div class="comment-footer">
                  <button class="comment-like">
                    <span>👍</span>
                    <span>{{ comment.likes }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <div class="sidebar-column">
        <div class="toc-widget" v-if="toc.length > 0">
          <h3 class="widget-title">📑 文章目录</h3>
          <nav class="toc-nav">
            <ul class="toc-list">
              <li 
                v-for="item in toc" 
                :key="item.id"
                class="toc-item"
                :class="{ 'level-2': item.level === 2, 'level-3': item.level === 3 }"
              >
                <a :href="`#${item.id}`">{{ item.text }}</a>
              </li>
            </ul>
          </nav>
        </div>
        
        <Sidebar />
      </div>
    </div>
  </div>
  
  <div class="not-found-page" v-else>
    <h1>文章不存在</h1>
    <router-link to="/" class="go-home">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import { renderMarkdown, extractTOC } from '@/utils/markdown'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const blogStore = useBlogStore()

const post = ref(null)
const renderedContent = ref('')
const toc = ref([])
const hasLiked = ref(false)
const newComment = ref({
  author: '',
  email: '',
  content: ''
})

const category = computed(() => {
  return post.value ? blogStore.getCategoryById(post.value.categoryId) : null
})

const tags = computed(() => {
  return post.value ? blogStore.getTagsByIds(post.value.tagIds) : []
})

const relatedPosts = computed(() => {
  return post.value ? blogStore.getRelatedPosts(post.value.id) : []
})

function loadPost() {
  const slug = route.params.slug
  post.value = blogStore.getPostBySlug(slug)
  
  if (post.value) {
    blogStore.incrementViews(post.value.id)
    renderedContent.value = renderMarkdown(post.value.content)
    toc.value = extractTOC(post.value.content)
    
    nextTick(() => {
      setupCodeCopy()
      setupHeadings()
    })
  }
}

function setupCodeCopy() {
  const codeBlocks = document.querySelectorAll('.code-block')
  codeBlocks.forEach(block => {
    const wrapper = document.createElement('div')
    wrapper.className = 'code-wrapper'
    block.parentNode.insertBefore(wrapper, block)
    wrapper.appendChild(block)
    
    const copyBtn = document.createElement('button')
    copyBtn.className = 'copy-btn'
    copyBtn.innerHTML = '📋 复制代码'
    copyBtn.onclick = () => {
      const code = block.querySelector('code')?.textContent || ''
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.innerHTML = '✅ 已复制!'
        setTimeout(() => {
          copyBtn.innerHTML = '📋 复制代码'
        }, 2000)
      })
    }
    wrapper.appendChild(copyBtn)
  })
}

function setupHeadings() {
  const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6')
  headings.forEach(heading => {
    if (!heading.querySelector('.anchor-link')) {
      const anchor = document.createElement('a')
      anchor.className = 'anchor-link'
      anchor.href = `#${heading.id}`
      anchor.innerHTML = '#'
      heading.appendChild(anchor)
    }
  })
}

function handleLike() {
  if (post.value && !hasLiked.value) {
    blogStore.toggleLike(post.value.id)
    hasLiked.value = true
  }
}

function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: post.value?.title,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('链接已复制到剪贴板')
    })
  }
}

function submitComment() {
  if (!newComment.value.author.trim() || !newComment.value.content.trim()) {
    alert('请填写昵称和评论内容')
    return
  }
  
  if (post.value) {
    const avatar = newComment.value.email 
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${newComment.value.email}`
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${newComment.value.author}`
    
    blogStore.addComment(post.value.id, {
      author: newComment.value.author,
      email: newComment.value.email,
      content: newComment.value.content,
      avatar
    })
    
    newComment.value = { author: '', email: '', content: '' }
    alert('评论发表成功！')
  }
}

onMounted(() => {
  loadPost()
})

watch(() => route.params.slug, () => {
  loadPost()
}, { immediate: true })
</script>

<style scoped>
.post-detail-page {
  min-height: 100%;
}

.post-hero {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 40px 0;
  margin-bottom: 30px;
}

.post-breadcrumb {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.post-breadcrumb a {
  color: white;
  opacity: 0.8;
}

.post-breadcrumb a:hover {
  opacity: 1;
  text-decoration: underline;
}

.post-breadcrumb .separator {
  margin: 0 8px;
  opacity: 0.6;
}

.post-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 24px;
}

.post-meta-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-weight: 600;
}

.post-time {
  font-size: 13px;
  opacity: 0.8;
}

.meta-right {
  display: flex;
  gap: 20px;
  font-size: 14px;
  opacity: 0.9;
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
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.toc-widget {
  position: sticky;
  top: calc(var(--header-height) + 30px);
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.toc-nav {
  max-height: 60vh;
  overflow-y: auto;
}

.toc-list {
  list-style: none;
}

.toc-item {
  margin-bottom: 8px;
}

.toc-item a {
  display: block;
  padding: 6px 12px;
  color: var(--text-secondary);
  font-size: 14px;
  border-radius: 4px;
  transition: var(--transition);
}

.toc-item a:hover {
  color: var(--primary-color);
  background: var(--bg-secondary);
  text-decoration: none;
}

.toc-item.level-2 {
  padding-left: 0;
}

.toc-item.level-3 {
  padding-left: 16px;
}

.post-content {
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 30px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.markdown-body {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-color);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  position: relative;
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-color);
  scroll-margin-top: calc(var(--header-height) + 20px);
}

.markdown-body :deep(h1) { font-size: 28px; }
.markdown-body :deep(h2) { font-size: 24px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color); }
.markdown-body :deep(h3) { font-size: 20px; }
.markdown-body :deep(h4) { font-size: 18px; }

.markdown-body :deep(.anchor-link) {
  position: absolute;
  left: -24px;
  opacity: 0;
  transition: opacity 0.3s;
  color: var(--primary-color);
  text-decoration: none;
}

.markdown-body :deep(h1:hover .anchor-link),
.markdown-body :deep(h2:hover .anchor-link),
.markdown-body :deep(h3:hover .anchor-link),
.markdown-body :deep(h4:hover .anchor-link) {
  opacity: 1;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(a) {
  color: var(--primary-color);
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius);
  margin: 16px 0;
}

.markdown-body :deep(blockquote) {
  margin: 16px 0;
  padding: 16px 20px;
  border-left: 4px solid var(--primary-color);
  background: var(--bg-secondary);
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--text-secondary);
}

.markdown-body :deep(blockquote p) {
  margin: 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.markdown-body :deep(li) {
  margin-bottom: 8px;
}

.markdown-body :deep(code) {
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: 4px;
  font-size: 14px;
  color: var(--primary-color);
  font-family: 'Fira Code', Consolas, Monaco, monospace;
}

.markdown-body :deep(.code-wrapper) {
  position: relative;
  margin: 16px 0;
}

.markdown-body :deep(.code-block) {
  margin: 0;
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
}

.markdown-body :deep(.code-block::before) {
  content: attr(data-lang);
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 12px;
  color: var(--text-light);
  text-transform: uppercase;
}

.markdown-body :deep(.hljs) {
  padding: 20px;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  overflow-x: auto;
}

.markdown-body :deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 70px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-light);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: var(--transition);
  z-index: 1;
}

.markdown-body :deep(.copy-btn:hover) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.markdown-body :deep(table) {
  width: 100%;
  margin: 16px 0;
  border-collapse: collapse;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
}

.markdown-body :deep(tr:nth-child(even)) {
  background: var(--bg-secondary);
}

.markdown-body :deep(hr) {
  margin: 24px 0;
  border: none;
  border-top: 1px solid var(--border-color);
}

.post-tags-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.tags-label {
  color: var(--text-secondary);
  font-size: 14px;
}

.post-tag {
  display: inline-block;
  padding: 6px 16px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 13px;
  transition: var(--transition);
}

.post-tag:hover {
  background: var(--primary-color);
  color: white;
  text-decoration: none;
}

.post-actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: var(--radius);
  font-size: 14px;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
}

.like-btn {
  color: var(--error-color);
  border-color: var(--error-color);
}

.like-btn:hover,
.like-btn.liked {
  background: var(--error-color);
  color: white;
}

.share-btn {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.share-btn:hover {
  background: var(--primary-color);
  color: white;
}

.related-section,
.comments-section {
  background: var(--bg-color);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary-color);
}

.related-posts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.related-post-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-secondary);
  transition: var(--transition);
}

.related-post-card:hover {
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.related-post-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.related-post-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.related-post-info h4 {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-post-meta {
  margin-top: auto;
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-light);
}

.comment-form {
  margin-bottom: 30px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 14px;
  transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.submit-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.no-comments {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
}

.comment-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: var(--text-color);
}

.comment-date {
  font-size: 13px;
  color: var(--text-light);
}

.comment-text {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
}

.comment-footer {
  display: flex;
  gap: 16px;
}

.comment-like {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: var(--bg-color);
  border-radius: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}

.comment-like:hover {
  color: var(--primary-color);
}

.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.not-found-page h1 {
  font-size: 48px;
  margin-bottom: 20px;
  color: var(--text-color);
}

.go-home {
  padding: 12px 32px;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius);
}

.go-home:hover {
  text-decoration: none;
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .page-container {
    grid-template-columns: 1fr;
  }
  
  .toc-widget {
    position: static;
  }
  
  .related-posts {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .post-hero {
    padding: 30px 0;
  }
  
  .post-title {
    font-size: 24px;
  }
  
  .post-meta-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .meta-right {
    flex-wrap: wrap;
  }
  
  .post-content {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .related-posts {
    grid-template-columns: 1fr;
  }
  
  .comment-item {
    padding: 16px;
  }
}
</style>
