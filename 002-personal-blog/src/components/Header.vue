<template>
  <header class="header">
    <div class="container header-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">📝</span>
        <span class="logo-text">个人博客</span>
      </router-link>
      
      <nav class="nav-menu" :class="{ 'active': mobileMenuOpen }">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="nav-link"
          @click="closeMobileMenu"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      
      <div class="header-actions">
        <div class="search-box" :class="{ 'active': searchFocused }">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索文章..."
            @focus="searchFocused = true"
            @blur="searchFocused = false"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            🔍
          </button>
        </div>
        
        <button class="theme-toggle" @click="toggleDarkMode">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span v-if="!mobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'

const router = useRouter()
const blogStore = useBlogStore()
const { isDark, toggleDarkMode } = { ...blogStore }

const searchQuery = ref('')
const searchFocused = ref(false)
const mobileMenuOpen = ref(false)

const navItems = computed(() => [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/category/frontend', label: '分类', icon: '📂' },
  { path: '/tag/javascript', label: '标签', icon: '🏷️' },
  { path: '/about', label: '关于', icon: '👤' }
])

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    closeMobileMenu()
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
}

.logo:hover {
  text-decoration: none;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: var(--text-secondary);
  border-radius: var(--radius);
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
  background: var(--bg-secondary);
}

.nav-link:hover {
  text-decoration: none;
}

.nav-icon {
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box input {
  width: 0;
  padding: 8px 0;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 14px;
  transition: width 0.3s ease, padding 0.3s ease;
  outline: none;
}

.search-box.active input,
.search-box:focus-within input {
  width: 200px;
  padding: 8px 12px;
  padding-right: 36px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
}

.search-btn {
  position: absolute;
  right: 4px;
  padding: 4px 8px;
  color: var(--text-secondary);
  font-size: 16px;
}

.theme-toggle,
.mobile-menu-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: var(--bg-secondary);
  font-size: 18px;
}

.theme-toggle:hover,
.mobile-menu-btn:hover {
  background: var(--border-color);
}

.mobile-menu-btn {
  display: none;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    padding: 20px;
    background: var(--bg-color);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .nav-menu.active {
    transform: translateX(0);
  }
  
  .nav-link {
    padding: 16px;
    font-size: 16px;
  }
  
  .search-box {
    flex: 1;
  }
  
  .search-box input,
  .search-box.active input,
  .search-box:focus-within input {
    width: 100%;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
}
</style>
