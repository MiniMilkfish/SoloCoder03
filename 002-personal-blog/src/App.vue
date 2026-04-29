<template>
  <div :class="{ 'dark': isDark }">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    
    <Header />
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Footer />
    <BackToTop />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBlogStore } from '@/store/blog'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import BackToTop from '@/components/BackToTop.vue'

const blogStore = useBlogStore()
const { isDark, isLoading } = { ...blogStore }

onMounted(() => {
  blogStore.initTheme()
  blogStore.loadAllPosts()
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.3s ease;
}

.main-content {
  min-height: calc(100vh - var(--header-height) - 100px);
  padding-top: var(--header-height);
}
</style>
