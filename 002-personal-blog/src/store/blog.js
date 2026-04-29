import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { loadPosts } from '@/utils/postLoader'
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
  
  onMounted(async () => {
    isLoading.value = true
    try {
      const loadedPosts = await loadPosts()
      allPosts.value = loadedPosts
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      isLoading.value = false
    }
  })

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
    addComment
  }
})
