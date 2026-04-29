import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadPosts } from '@/utils/postLoader'
import { writePost, deletePost, updatePost } from '@/utils/fileUtils'
import categories from '@/data/categories'
import tags from '@/data/tags'

export const useBlogStore = defineStore('blog', () => {
  const allPosts = ref([])
  const allCategories = ref([...categories])
  const allTags = ref([...tags])
  const isDark = ref(localStorage.getItem('theme') === 'dark')
  const isLoading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(5)
  
  async function loadAllPosts() {
    isLoading.value = true
    try {
      console.log('Loading posts...')
      const loadedPosts = await loadPosts()
      console.log('Posts loaded:', loadedPosts.length)
      allPosts.value = loadedPosts
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      isLoading.value = false
    }
  }

  const publishedPosts = computed(() => {
    return allPosts.value.filter(post => !post.isDraft)
  })

  const pinnedPosts = computed(() => {
    return publishedPosts.value
      .filter(post => post.isPinned)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  })

  const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return publishedPosts.value.slice(start, end)
  })

  const totalPages = computed(() => {
    return Math.ceil(publishedPosts.value.length / pageSize.value)
  })

  function getPostBySlug(slug) {
    return publishedPosts.value.find(post => post.slug === slug)
  }

  function getPostsByCategory(categorySlug) {
    const category = allCategories.value.find(c => c.slug === categorySlug)
    if (!category) return []
    return publishedPosts.value.filter(post => post.categoryId === category.id)
  }

  function getPostsByTag(tagSlug) {
    const tag = allTags.value.find(t => t.slug === tagSlug)
    if (!tag) return []
    return publishedPosts.value.filter(post => post.tagIds.includes(tag.id))
  }

  function searchPosts(keyword) {
    if (!keyword.trim()) return []
    const lowerKeyword = keyword.toLowerCase()
    return publishedPosts.value.filter(post => 
      post.title.toLowerCase().includes(lowerKeyword) ||
      post.excerpt.toLowerCase().includes(lowerKeyword) ||
      post.content.toLowerCase().includes(lowerKeyword)
    )
  }

  function getCategoryById(id) {
    return allCategories.value.find(c => c.id === id)
  }

  function getTagById(id) {
    return allTags.value.find(t => t.id === id)
  }

  function getTagsByIds(ids) {
    return allTags.value.filter(t => ids.includes(t.id))
  }

  function getRelatedPosts(postId, limit = 3) {
    const currentPost = allPosts.value.find(p => p.id === postId)
    if (!currentPost) return []
    
    return publishedPosts.value
      .filter(post => post.id !== postId)
      .filter(post => {
        if (post.categoryId === currentPost.categoryId) return true
        return post.tagIds.some(tagId => currentPost.tagIds.includes(tagId))
      })
      .slice(0, limit)
  }

  function toggleDarkMode() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  function initTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  function setLoading(status) {
    isLoading.value = status
  }

  function setPage(page) {
    currentPage.value = page
  }

  function incrementViews(postId) {
    const post = allPosts.value.find(p => p.id === postId)
    if (post) {
      post.views++
    }
  }

  function toggleLike(postId) {
    const post = allPosts.value.find(p => p.id === postId)
    if (post) {
      post.likes++
    }
  }

  function addComment(postId, comment) {
    const post = allPosts.value.find(p => p.id === postId)
    if (post) {
      post.comments.push({
        id: Date.now(),
        ...comment,
        createdAt: new Date().toISOString().split('T')[0],
        likes: 0
      })
    }
  }

  async function addPost(postData) {
    const newPost = {
      ...postData,
      id: Date.now(),
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      comments: []
    }
    
    try {
      // 尝试写入文件（仅在 Node.js 环境有效）
      writePost(newPost)
    } catch (error) {
      console.log('Running in browser environment, using local state only')
    }
    
    // 无论环境如何，都更新本地状态
    allPosts.value.push(newPost)
    // 重新排序
    allPosts.value.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    return true
  }

  async function updatePostById(postId, updates) {
    const post = allPosts.value.find(p => p.id === postId)
    if (post) {
      const updatedPost = {
        ...post,
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      
      try {
        // 尝试更新文件（仅在 Node.js 环境有效）
        updatePost(post.slug, updatedPost)
      } catch (error) {
        console.log('Running in browser environment, using local state only')
      }
      
      // 无论环境如何，都更新本地状态
      const index = allPosts.value.findIndex(p => p.id === postId)
      if (index !== -1) {
        allPosts.value[index] = updatedPost
      }
      return true
    }
    return false
  }

  async function deletePostById(postId) {
    const post = allPosts.value.find(p => p.id === postId)
    if (post) {
      try {
        // 尝试删除文件（仅在 Node.js 环境有效）
        deletePost(post.slug)
      } catch (error) {
        console.log('Running in browser environment, using local state only')
      }
      
      // 无论环境如何，都更新本地状态
      allPosts.value = allPosts.value.filter(p => p.id !== postId)
      return true
    }
    return false
  }

  async function refreshPosts() {
    isLoading.value = true
    try {
      const loadedPosts = await loadPosts()
      allPosts.value = loadedPosts
    } catch (error) {
      console.error('Error refreshing posts:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    allPosts,
    allCategories,
    allTags,
    isDark,
    isLoading,
    currentPage,
    pageSize,
    publishedPosts,
    pinnedPosts,
    paginatedPosts,
    totalPages,
    getPostBySlug,
    getPostsByCategory,
    getPostsByTag,
    searchPosts,
    getCategoryById,
    getTagById,
    getTagsByIds,
    getRelatedPosts,
    toggleDarkMode,
    initTheme,
    setLoading,
    setPage,
    incrementViews,
    toggleLike,
    addComment,
    addPost,
    updatePostById,
    deletePostById,
    refreshPosts,
    loadAllPosts
  }
})
