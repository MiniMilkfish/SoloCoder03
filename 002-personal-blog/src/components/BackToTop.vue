<template>
  <transition name="fade">
    <button 
      v-if="visible"
      class="back-to-top"
      @click="scrollToTop"
      :title="`返回顶部 (已滚动 ${scrollY}px)`"
    >
      <span class="arrow">↑</span>
      <span class="progress-ring">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="45" :style="dashArrayStyle" />
        </svg>
      </span>
    </button>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const scrollY = ref(0)
const windowHeight = ref(0)
const documentHeight = ref(0)

const progress = computed(() => {
  const maxScroll = documentHeight.value - windowHeight.value
  if (maxScroll <= 0) return 0
  return Math.min(scrollY.value / maxScroll, 1)
})

const dashArrayStyle = computed(() => {
  const circumference = 2 * Math.PI * 45
  const offset = circumference * (1 - progress.value)
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset
  }
})

function updateScroll() {
  scrollY.value = window.scrollY
  documentHeight.value = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  )
  windowHeight.value = window.innerHeight
  visible.value = scrollY.value > 300
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  updateScroll()
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('resize', updateScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('resize', updateScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  z-index: 100;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.arrow {
  position: relative;
  z-index: 2;
  font-weight: bold;
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.progress-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring circle {
  fill: none;
  stroke-width: 3;
}

.progress-ring circle:first-child {
  stroke: rgba(255, 255, 255, 0.2);
}

.progress-ring circle:last-child {
  stroke: white;
  transition: stroke-dashoffset 0.3s ease;
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
}
</style>
