import { createRouter, createWebHashHistory } from 'vue-router'
import { useBlogStore } from '@/store/blog'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/post/:slug',
    name: 'PostDetail',
    component: () => import('@/views/PostDetail.vue'),
    meta: { title: '文章详情' }
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: () => import('@/views/Category.vue'),
    meta: { title: '分类' }
  },
  {
    path: '/tag/:slug',
    name: 'Tag',
    component: () => import('@/views/Tag.vue'),
    meta: { title: '标签' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: { title: '搜索' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于我' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { title: '管理后台' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404 - 页面未找到' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const blogStore = useBlogStore()
  blogStore.setLoading(true)
  
  if (to.meta.title) {
    document.title = `${to.meta.title} - 个人博客`
  }
  
  next()
})

router.afterEach(() => {
  const blogStore = useBlogStore()
  setTimeout(() => {
    blogStore.setLoading(false)
  }, 300)
})

export default router
