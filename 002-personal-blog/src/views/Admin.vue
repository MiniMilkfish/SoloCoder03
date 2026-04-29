<template>
  <div class="admin-page">
    <div class="container">
      <div class="admin-header">
        <h1 class="admin-title">📝 博客管理</h1>
        <button class="add-post-btn" @click="openAddPostModal">
          ➕ 新增文章
        </button>
      </div>
      
      <div class="admin-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="admin-content">
        <div v-show="activeTab === 'posts'" class="posts-section">
          <div class="posts-controls">
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="搜索文章..."
              />
            </div>
            <select v-model="filterStatus" class="filter-select">
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          
          <div class="posts-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>标题</th>
                  <th>分类</th>
                  <th>标签</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in filteredPosts" :key="post.id">
                  <td>{{ post.id }}</td>
                  <td>{{ post.title }}</td>
                  <td>{{ getCategoryName(post.categoryId) }}</td>
                  <td>{{ getTagNames(post.tagIds).join(', ') }}</td>
                  <td>
                    <span :class="['status-badge', post.isDraft ? 'draft' : 'published']">
                      {{ post.isDraft ? '草稿' : '已发布' }}
                    </span>
                    <span v-if="post.isPinned" class="pin-badge">置顶</span>
                  </td>
                  <td>{{ post.createdAt }}</td>
                  <td class="actions">
                    <button class="action-btn view" @click="viewPost(post)">
                      👁️
                    </button>
                    <button class="action-btn edit" @click="editPost(post)">
                      ✏️
                    </button>
                    <button class="action-btn delete" @click="deletePost(post)">
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-show="activeTab === 'categories'" class="categories-section">
          <h3>分类管理</h3>
          <!-- 分类管理内容 -->
        </div>
        
        <div v-show="activeTab === 'tags'" class="tags-section">
          <h3>标签管理</h3>
          <!-- 标签管理内容 -->
        </div>
      </div>
    </div>
    
    <!-- 新增/编辑文章模态框 -->
    <div v-if="showPostModal" class="modal-overlay" @click="closePostModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingPost ? '编辑文章' : '新增文章' }}</h2>
          <button class="close-btn" @click="closePostModal">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="savePost">
            <div class="form-group">
              <label>标题</label>
              <input 
                type="text" 
                v-model="postForm.title"
                required
                placeholder="请输入文章标题"
              />
            </div>
            <div class="form-group">
              <label>Slug</label>
              <input 
                type="text" 
                v-model="postForm.slug"
                required
                placeholder="请输入文章链接"
              />
            </div>
            <div class="form-group">
              <label>摘要</label>
              <textarea 
                v-model="postForm.excerpt"
                placeholder="请输入文章摘要"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>内容</label>
              <textarea 
                v-model="postForm.content"
                placeholder="请输入文章内容（支持 Markdown）"
                rows="10"
              ></textarea>
            </div>
            <div class="form-group">
              <label>分类</label>
              <select v-model="postForm.categoryId">
                <option v-for="category in allCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>标签</label>
              <select v-model="postForm.tagIds" multiple>
                <option v-for="tag in allTags" :key="tag.id" :value="tag.id">
                  {{ tag.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>封面图</label>
              <input 
                type="text" 
                v-model="postForm.coverImage"
                placeholder="请输入封面图 URL"
              />
              <input 
                type="file" 
                accept="image/*"
                @change="handleImageUpload"
                style="margin-top: 8px"
              />
              <p v-if="imageUploading" class="upload-status">
                图片上传中...
              </p>
              <p v-if="imageUploadError" class="upload-error">
                {{ imageUploadError }}
              </p>
            </div>
            <div class="form-group checkboxes">
              <label>
                <input type="checkbox" v-model="postForm.isPinned" />
                置顶
              </label>
              <label>
                <input type="checkbox" v-model="postForm.isDraft" />
                草稿
              </label>
            </div>
            <div class="form-group">
              <label>排序</label>
              <input 
                type="number" 
                v-model.number="postForm.sortOrder"
                min="0"
              />
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closePostModal">
                取消
              </button>
              <button type="submit" class="save-btn">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import { compressImageLocally, shouldCompressImage } from '@/utils/imageCompressor'

const router = useRouter()
const blogStore = useBlogStore()

const activeTab = ref('posts')
const searchQuery = ref('')
const filterStatus = ref('all')
const showPostModal = ref(false)
const editingPost = ref(null)

const postForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  categoryId: 1,
  tagIds: [],
  coverImage: '',
  isPinned: false,
  isDraft: false,
  sortOrder: 0
})

const imageUploading = ref(false)
const imageUploadError = ref('')

const tabs = [
  { key: 'posts', label: '文章管理' },
  { key: 'categories', label: '分类管理' },
  { key: 'tags', label: '标签管理' }
]

const allCategories = computed(() => blogStore.allCategories)
const allTags = computed(() => blogStore.allTags)

const filteredPosts = computed(() => {
  let posts = blogStore.allPosts
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    )
  }
  
  // 状态过滤
  if (filterStatus.value === 'published') {
    posts = posts.filter(post => !post.isDraft)
  } else if (filterStatus.value === 'draft') {
    posts = posts.filter(post => post.isDraft)
  }
  
  // 排序
  return posts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder
    }
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
})

function getCategoryName(categoryId) {
  const category = allCategories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

function getTagNames(tagIds) {
  return tagIds.map(id => {
    const tag = allTags.value.find(t => t.id === id)
    return tag ? tag.name : ''
  }).filter(Boolean)
}

function openAddPostModal() {
  editingPost.value = null
  postForm.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: 1,
    tagIds: [],
    coverImage: '',
    isPinned: false,
    isDraft: false,
    sortOrder: 0
  }
  showPostModal.value = true
}

function closePostModal() {
  showPostModal.value = false
  editingPost.value = null
  imageUploading.value = false
  imageUploadError.value = ''
}

async function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  imageUploading.value = true
  imageUploadError.value = ''
  
  try {
    // 检查是否需要压缩
    if (shouldCompressImage(file)) {
      // 压缩图片
      const compressedUrl = await compressImageLocally(file)
      postForm.value.coverImage = compressedUrl
    } else {
      // 直接使用原图
      postForm.value.coverImage = URL.createObjectURL(file)
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    imageUploadError.value = '图片上传失败，请重试'
  } finally {
    imageUploading.value = false
  }
}

function viewPost(post) {
  router.push(`/post/${post.slug}`)
}

function editPost(post) {
  editingPost.value = post
  postForm.value = {
    ...post
  }
  showPostModal.value = true
}

async function deletePost(post) {
  if (confirm(`确定要删除文章 "${post.title}" 吗？`)) {
    try {
      const success = await blogStore.deletePostById(post.id)
      if (success) {
        alert('文章删除成功！')
      } else {
        alert('文章删除失败，请重试')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('删除失败，请重试')
    }
  }
}

async function savePost() {
  try {
    if (editingPost.value) {
      // 编辑文章
      const success = await blogStore.updatePostById(editingPost.value.id, postForm.value)
      if (success) {
        alert('文章更新成功！')
      } else {
        alert('文章更新失败，请重试')
      }
    } else {
      // 新增文章
      const success = await blogStore.addPost(postForm.value)
      if (success) {
        alert('文章创建成功！')
      } else {
        alert('文章创建失败，请重试')
      }
    }
    closePostModal()
  } catch (error) {
    console.error('Error saving post:', error)
    alert('操作失败，请重试')
  }
}

onMounted(() => {
  // 确保文章已加载
  if (blogStore.allPosts.length === 0) {
    // 触发加载
  }
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 40px 0;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
}

.add-post-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.add-post-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.admin-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--border-color);
}

.admin-tabs button {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.admin-tabs button:hover {
  color: var(--primary-color);
}

.admin-tabs button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  font-weight: 600;
}

.posts-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.search-box input {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 14px;
  width: 300px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 14px;
  background: var(--bg-color);
  color: var(--text-color);
}

.posts-table {
  background: var(--bg-color);
  border-radius: var(--radius);
  box-shadow: 0 2px 8px var(--shadow-color);
  overflow: hidden;
}

.posts-table table {
  width: 100%;
  border-collapse: collapse;
}

.posts-table th,
.posts-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.posts-table th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-color);
}

.posts-table tr:hover {
  background: var(--bg-secondary);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.published {
  background: rgba(82, 196, 26, 0.1);
  color: var(--success-color);
}

.status-badge.draft {
  background: rgba(250, 173, 20, 0.1);
  color: var(--warning-color);
}

.pin-badge {
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(102, 126, 234, 0.1);
  color: var(--primary-color);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.action-btn.view:hover {
  background: rgba(102, 126, 234, 0.1);
  color: var(--primary-color);
}

.action-btn.edit:hover {
  background: rgba(250, 173, 20, 0.1);
  color: var(--warning-color);
}

.action-btn.delete:hover {
  background: rgba(245, 34, 45, 0.1);
  color: var(--error-color);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-color);
  border-radius: var(--radius);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.form-group.checkboxes {
  display: flex;
  gap: 20px;
}

.form-group.checkboxes label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-secondary);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.cancel-btn:hover {
  border-color: var(--text-secondary);
}

.save-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.upload-status {
  margin-top: 8px;
  color: var(--primary-color);
  font-size: 14px;
}

.upload-error {
  margin-top: 8px;
  color: var(--error-color);
  font-size: 14px;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .posts-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .posts-table {
    overflow-x: auto;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
