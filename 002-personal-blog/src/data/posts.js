import categories from './categories'
import tags from './tags'

const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}

export default [
  {
    id: 1,
    title: 'Vue 3 Composition API 完全指南',
    slug: 'vue3-composition-api-guide',
    excerpt: '本文将深入探讨 Vue 3 的 Composition API，包括 setup 函数、响应式数据、生命周期钩子等核心概念，帮助你更好地理解和使用这个强大的新特性。',
    content: `# Vue 3 Composition API 完全指南

## 什么是 Composition API？

Vue 3 引入了 Composition API，这是一种新的编写组件逻辑的方式。与 Options API 不同，Composition API 允许我们按逻辑关注点组织代码，而不是按选项类型。

### 核心概念

1. **setup 函数**：Composition API 的入口点
2. **响应式数据**：使用 \`ref\` 和 \`reactive\`
3. **计算属性**：使用 \`computed\`
4. **监听器**：使用 \`watch\` 和 \`watchEffect\`
5. **生命周期钩子**：使用 \`onMounted\`, \`onUpdated\` 等

## 基本用法

### setup 函数

\`\`\`javascript
import { ref, reactive, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue',
      version: '3.0'
    })
    
    const doubleCount = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      state,
      doubleCount,
      increment
    }
  }
}
\`\`\`

### 使用 \<script setup\>

在 Vue 3.2+ 中，你可以使用更简洁的语法：

\`\`\`vue
<script setup>
import { ref, reactive, computed } from 'vue'

const count = ref(0)
const state = reactive({
  name: 'Vue',
  version: '3.0'
})

const doubleCount = computed(() => count.value * 2)

const increment = () => {
  count.value++
}
</script>
\`\`\`

## 响应式数据

### ref vs reactive

| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 基本类型 + 对象 | 对象 |
| 访问方式 | 需要 .value | 直接访问 |
| 解构保持响应 | 否 | 否（需要 toRefs） |

### 示例

\`\`\`javascript
// 使用 ref
const message = ref('Hello')
console.log(message.value) // 'Hello'
message.value = 'Hi'

// 使用 reactive
const user = reactive({
  name: 'Alice',
  age: 25
})
console.log(user.name) // 'Alice'
user.age = 26
\`\`\`

## 总结

Composition API 提供了一种更灵活的方式来组织组件逻辑，特别适合大型项目。它允许我们：

- 按逻辑关注点组织代码
- 更好地重用逻辑（通过组合函数）
- 更好的 TypeScript 支持

希望这篇指南能帮助你更好地理解 Vue 3 的 Composition API！`,
    categoryId: 1,
    tagIds: [1, 2, 4],
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vue%203%20javascript%20code%20editor%20modern%20minimal%20tech%20blog&image_size=landscape_16_9',
    isPinned: true,
    isDraft: false,
    sortOrder: 1,
    views: 1256,
    likes: 89,
    createdAt: formatDate(new Date(2024, 0, 15)),
    updatedAt: formatDate(new Date(2024, 2, 10)),
    comments: [
      {
        id: 1,
        author: '张三',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
        content: '写得非常详细，学到了很多！',
        createdAt: formatDate(new Date(2024, 0, 16)),
        likes: 12
      },
      {
        id: 2,
        author: '李四',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
        content: 'Composition API 确实比 Options API 更灵活，代码组织更清晰了。',
        createdAt: formatDate(new Date(2024, 0, 17)),
        likes: 8
      }
    ]
  },
  {
    id: 2,
    title: 'JavaScript 异步编程详解：从回调到 async/await',
    slug: 'javascript-async-programming',
    excerpt: '异步编程是 JavaScript 的核心概念之一。本文将带你回顾从回调函数到 Promise，再到 async/await 的演进历程，深入理解每种方案的原理和最佳实践。',
    content: `# JavaScript 异步编程详解

## 异步编程的演进历程

JavaScript 异步编程经历了三个主要阶段：

1. **回调函数** - 最早的异步处理方式
2. **Promise** - ES6 引入的标准方案
3. **async/await** - ES2017 引入的语法糖

## 回调函数

### 基本概念

回调函数是一种通过参数传递给其他函数，并在特定时机执行的函数。

\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: 'Vue', version: '3.0' }
    callback(null, data)
  }, 1000)
}

fetchData((err, data) => {
  if (err) {
    console.error('Error:', err)
    return
  }
  console.log('Data:', data)
})
\`\`\`

### 回调地狱

当嵌套多层回调时，代码会变得难以维护，这就是所谓的"回调地狱"：

\`\`\`javascript
getUser(userId, (err, user) => {
  if (err) {
    console.error(err)
    return
  }
  getPosts(user.id, (err, posts) => {
    if (err) {
      console.error(err)
      return
    }
    getComments(posts[0].id, (err, comments) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(comments)
    })
  })
})
\`\`\`

## Promise

### 基本用法

Promise 提供了一种更优雅的方式来处理异步操作：

\`\`\`javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true
      if (success) {
        resolve({ name: 'Vue', version: '3.0' })
      } else {
        reject(new Error('Failed to fetch data'))
      }
    }, 1000)
  })
}

fetchData()
  .then(data => console.log('Data:', data))
  .catch(err => console.error('Error:', err))
  .finally(() => console.log('Done'))
\`\`\`

### Promise 链式调用

\`\`\`javascript
getUser(userId)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err))
\`\`\`

## async/await

### 基本概念

async/await 是基于 Promise 的语法糖，让异步代码看起来像同步代码：

\`\`\`javascript
async function getData() {
  try {
    const user = await getUser(userId)
    const posts = await getPosts(user.id)
    const comments = await getComments(posts[0].id)
    console.log(comments)
  } catch (err) {
    console.error(err)
  }
}
\`\`\`

### 并行执行

使用 \`Promise.all\` 并行执行多个异步操作：

\`\`\`javascript
async function getAllData() {
  const [user, posts, comments] = await Promise.all([
    getUser(userId),
    getPosts(userId),
    getComments(postId)
  ])
  
  console.log(user, posts, comments)
}
\`\`\`

## 总结

| 方案 | 优点 | 缺点 |
|------|------|------|
| 回调函数 | 简单直接 | 回调地狱、难以维护 |
| Promise | 链式调用、状态管理 | 仍有 .then() 嵌套 |
| async/await | 代码简洁、像同步代码 | 需要理解 Promise 基础 |

在现代 JavaScript 开发中，推荐使用 **async/await** 配合 **Promise** 来处理异步操作。`,
    categoryId: 1,
    tagIds: [1, 4],
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=javascript%20async%20programming%20code%20dark%20theme%20tech%20blog&image_size=landscape_16_9',
    isPinned: true,
    isDraft: false,
    sortOrder: 2,
    views: 987,
    likes: 67,
    createdAt: formatDate(new Date(2024, 1, 1)),
    updatedAt: formatDate(new Date(2024, 2, 5)),
    comments: [
      {
        id: 1,
        author: '王五',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
        content: 'async/await 真的是太香了！',
        createdAt: formatDate(new Date(2024, 1, 2)),
        likes: 15
      }
    ]
  },
  {
    id: 3,
    title: 'React Hooks 深度解析与最佳实践',
    slug: 'react-hooks-best-practices',
    excerpt: 'React Hooks 彻底改变了我们编写 React 组件的方式。本文将深入探讨 useState、useEffect、useContext、useReducer 等常用 Hook 的原理，以及如何编写高质量的自定义 Hook。',
    content: `# React Hooks 深度解析

## 什么是 Hooks？

Hooks 是 React 16.8 引入的新特性，它让我们可以在函数组件中使用状态和其他 React 特性。

### 核心 Hooks

- **useState**: 状态管理
- **useEffect**: 副作用处理
- **useContext**: 上下文访问
- **useReducer**: 复杂状态管理
- **useCallback**: 回调函数缓存
- **useMemo**: 计算结果缓存
- **useRef**: 引用访问
- **useImperativeHandle**: 自定义暴露值
- **useLayoutEffect**: DOM 读取后同步执行
- **useDebugValue**: 自定义 Hook 标签

## useState 详解

### 基本用法

\`\`\`javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
\`\`\`

### 函数式更新

当新状态依赖于旧状态时，使用函数式更新：

\`\`\`javascript
const [count, setCount] = useState(0)

// 推荐方式
setCount(prevCount => prevCount + 1)

// 不推荐（可能会有闭包问题）
setCount(count + 1)
\`\`\`

## useEffect 详解

### 依赖数组

\`\`\`javascript
useEffect(() => {
  // 副作用逻辑
  console.log('Component mounted or updated')
  
  // 清理函数
  return () => {
    console.log('Component unmounted or updated')
  }
}, [dependencies])
\`\`\`

### 常见模式

\`\`\`javascript
// 只在挂载时执行（componentDidMount）
useEffect(() => {
  console.log('Mounted')
}, [])

// 每次渲染后执行（componentDidMount + componentDidUpdate）
useEffect(() => {
  console.log('Rendered')
})

// 依赖变化时执行
useEffect(() => {
  console.log('Count changed:', count)
}, [count])
\`\`\`

## 自定义 Hook

### 编写自定义 Hook

\`\`\`javascript
import { useState, useEffect } from 'react'

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return windowSize
}

// 使用自定义 Hook
function MyComponent() {
  const { width, height } = useWindowSize()
  
  return (
    <div>
      Window size: {width} x {height}
    </div>
  )
}
\`\`\`

## 最佳实践

1. **只在顶层调用 Hooks** - 不要在循环、条件或嵌套函数中调用
2. **只在 React 函数中调用 Hooks** - 只在函数组件或自定义 Hook 中调用
3. **使用 ESLint 插件** - \`eslint-plugin-react-hooks\` 帮助检查规则
4. **保持依赖数组正确** - 确保所有使用的值都在依赖数组中

## 总结

Hooks 让 React 函数组件拥有了类组件的全部能力，同时代码更简洁、更易于复用。掌握 Hooks 是现代 React 开发的必备技能！`,
    categoryId: 1,
    tagIds: [1, 3, 4],
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=react%20hooks%20code%20blue%20theme%20modern%20tech%20blog&image_size=landscape_16_9',
    isPinned: false,
    isDraft: false,
    sortOrder: 3,
    views: 756,
    likes: 45,
    createdAt: formatDate(new Date(2024, 1, 15)),
    updatedAt: formatDate(new Date(2024, 2, 8)),
    comments: []
  },
  {
    id: 4,
    title: 'Node.js 性能优化实战指南',
    slug: 'nodejs-performance-optimization',
    excerpt: 'Node.js 应用的性能优化是每个后端开发者必须掌握的技能。本文将从事件循环、内存管理、集群模式、缓存策略等多个角度，带你深入了解如何让你的 Node.js 应用飞起来。',
    content: `# Node.js 性能优化实战指南

## 理解 Node.js 事件循环

Node.js 使用单线程事件循环模型，理解它是优化的基础。

### 事件循环阶段

1. **timers**: 执行 setTimeout 和 setInterval 回调
2. **pending callbacks**: 执行延迟到下一个循环的 I/O 回调
3. **idle, prepare**: 内部使用
4. **poll**: 检索新的 I/O 事件
5. **check**: setImmediate 回调
6. **close callbacks**: 关闭事件的回调

## 异步编程优化

### 避免回调地狱

\`\`\`javascript
// 不推荐 - 回调地狱
getUser(id, (err, user) => {
  getProfile(user.id, (err, profile) => {
    getPosts(user.id, (err, posts) => {
      // ...
    })
  })
})

// 推荐 - async/await
async function getUserData(id) {
  const user = await getUser(id)
  const [profile, posts] = await Promise.all([
    getProfile(user.id),
    getPosts(user.id)
  ])
  return { user, profile, posts }
}
\`\`\`

## 使用集群模式

\`\`\`javascript
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`)
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`worker \${worker.process.pid} died\`)
    cluster.fork()
  })
} else {
  require('./app')
  console.log(\`Worker \${process.pid} started\`)
}
\`\`\`

## 内存管理

### 避免内存泄漏

\`\`\`javascript
// 不推荐 - 全局变量导致内存泄漏
const cache = {}

function addToCache(key, value) {
  cache[key] = value
}

// 推荐 - 使用 LRU 缓存
const LRU = require('lru-cache')
const cache = new LRU({
  max: 500,
  maxAge: 1000 * 60 * 60
})

function addToCache(key, value) {
  cache.set(key, value)
}
\`\`\`

## 数据库优化

### 使用连接池

\`\`\`javascript
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function query(sql, params) {
  const [rows] = await pool.execute(sql, params)
  return rows
}
\`\`\`

## 缓存策略

### Redis 缓存

\`\`\`javascript
const redis = require('redis')
const client = redis.createClient()

async function getCachedData(key, fetchFn) {
  const cached = await client.get(key)
  
  if (cached) {
    return JSON.parse(cached)
  }
  
  const data = await fetchFn()
  await client.setex(key, 3600, JSON.stringify(data))
  
  return data
}
\`\`\`

## 性能监控

### 使用 Node.js 内置工具

\`\`\`javascript
// 内存使用
console.log(process.memoryUsage())

// CPU 使用
console.log(process.cpuUsage())

// 事件循环延迟
const { performance } = require('perf_hooks')
const start = performance.now()

setTimeout(() => {
  const delay = performance.now() - start - 100
  console.log(\`Event loop delay: \${delay}ms\`)
}, 100)
\`\`\`

## 总结

Node.js 性能优化的关键点：

1. **理解事件循环** - 避免阻塞主线程
2. **使用集群模式** - 充分利用多核 CPU
3. **优化数据库操作** - 连接池、索引、查询优化
4. **合理使用缓存** - 减少数据库访问
5. **监控和分析** - 定位性能瓶颈
6. **内存管理** - 避免内存泄漏

持续监控和迭代优化是保持应用高性能的关键！`,
    categoryId: 2,
    tagIds: [1, 5],
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nodejs%20server%20performance%20optimization%20dark%20tech%20blog&image_size=landscape_16_9',
    isPinned: false,
    isDraft: false,
    sortOrder: 4,
    views: 634,
    likes: 38,
    createdAt: formatDate(new Date(2024, 2, 1)),
    updatedAt: formatDate(new Date(2024, 2, 12)),
    comments: []
  },
  {
    id: 5,
    title: 'CSS Grid 与 Flexbox 布局实战对比',
    slug: 'css-grid-vs-flexbox',
    excerpt: 'CSS Grid 和 Flexbox 都是强大的布局工具，但它们各有所长。本文将通过多个实际案例，深入对比这两种布局方式的使用场景和最佳实践，帮助你在项目中做出正确的选择。',
    content: `# CSS Grid 与 Flexbox 布局对比

## 核心概念

### Flexbox

Flexbox 是一维布局模型，适用于在行或列方向上布局元素。

\`\`\`css
.container {
  display: flex;
  flex-direction: row; /* row | column | row-reverse | column-reverse */
  justify-content: center; /* 主轴对齐 */
  align-items: center; /* 交叉轴对齐 */
  gap: 10px;
}
\`\`\`

### CSS Grid

CSS Grid 是二维布局模型，同时处理行和列。

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
}
\`\`\`

## 适用场景对比

| 场景 | Flexbox | Grid |
|------|---------|------|
| 一维布局（行或列） | ✅ 推荐 | 可用 |
| 二维布局（行和列） | ❌ 不适用 | ✅ 推荐 |
| 导航栏 | ✅ 推荐 | 可用 |
| 卡片列表 | 可用 | ✅ 推荐 |
| 表单布局 | 可用 | ✅ 推荐 |
| 页面整体布局 | 可用 | ✅ 推荐 |

## Flexbox 实战案例

### 导航栏

\`\`\`html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <button class="login-btn">Login</button>
</nav>
\`\`\`

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}
\`\`\`

### 等高卡片

\`\`\`html
<div class="card-container">
  <div class="card">
    <h3>Title 1</h3>
    <p>Short content</p>
  </div>
  <div class="card">
    <h3>Title 2</h3>
    <p>Longer content that wraps to multiple lines</p>
  </div>
</div>
\`\`\`

\`\`\`css
.card-container {
  display: flex;
  gap: 20px;
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
}
\`\`\`

## CSS Grid 实战案例

### 响应式网格

\`\`\`html
<div class="gallery">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>
\`\`\`

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.item {
  background: #667eea;
  color: white;
  padding: 2rem;
  border-radius: 8px;
}
\`\`\`

### 复杂页面布局

\`\`\`html
<div class="layout">
  <header>Header</header>
  <nav>Sidebar</nav>
  <main>Main Content</main>
  <aside>Aside</aside>
  <footer>Footer</footer>
</div>
\`\`\`

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px 1fr 50px;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  gap: 10px;
  min-height: 100vh;
}

header { grid-area: header; }
nav { grid-area: nav; }
main { grid-area: main; }
aside { grid-area: aside; }
footer { grid-area: footer; }

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
  }
}
\`\`\`

## 组合使用

### 最佳实践

大多数情况下，Grid 和 Flexbox 可以组合使用：

- **Grid 用于整体页面布局**
- **Flexbox 用于组件内部布局**

\`\`\`css
/* 页面布局使用 Grid */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
}

/* 导航栏使用 Flexbox */
.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 卡片列表使用 Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 卡片内部使用 Flexbox */
.card {
  display: flex;
  flex-direction: column;
}

.card-body {
  flex: 1;
}
\`\`\`

## 总结

| 特性 | Flexbox | CSS Grid |
|------|---------|----------|
| 维度 | 一维 | 二维 |
| 内容优先 | ✅ 是 | ❌ 否 |
| 布局优先 | ❌ 否 | ✅ 是 |
| 浏览器支持 | IE11+ | IE11（部分） |
| 学习曲线 | 较低 | 较高 |

**选择建议**：
- 需要一维布局时 → Flexbox
- 需要二维布局时 → CSS Grid
- 复杂页面 → 两者结合使用

理解两者的优势，在合适的场景选择合适的工具，是成为优秀前端开发者的必备技能！`,
    categoryId: 1,
    tagIds: [6, 7],
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=css%20grid%20flexbox%20layout%20design%20modern%20tech%20blog&image_size=landscape_16_9',
    isPinned: false,
    isDraft: false,
    sortOrder: 5,
    views: 521,
    likes: 32,
    createdAt: formatDate(new Date(2024, 2, 10)),
    updatedAt: formatDate(new Date(2024, 2, 15)),
    comments: []
  },
  {
    id: 6,
    title: '我的 2024 年技术学习计划',
    slug: 'my-2024-tech-learning-plan',
    excerpt: '新年伊始，是时候制定新的学习计划了。本文分享我的 2024 年技术学习规划，包括深入学习的技术栈、想要探索的新领域，以及如何保持持续学习的动力。',
    content: `# 我的 2024 年技术学习计划

## 前言

2024 年已经到来，回顾过去一年，虽然学到了很多新技术，但也发现了自己的不少短板。新的一年，我希望能够更有规划地学习，提升自己的技术能力。

## 核心目标

1. **深入前端框架** - Vue 3 生态、React 18 新特性
2. **后端能力提升** - Node.js 性能优化、微服务架构
3. **云原生技术** - Docker、Kubernetes、CI/CD
4. **AI 与机器学习** - 入门机器学习，探索 AI 在开发中的应用

## Q1 计划（1-3 月）

### 前端深入

- [ ] 深入学习 Vue 3 Composition API
- [ ] 掌握 Pinia 状态管理
- [ ] 学习 Vite 插件开发
- [ ] 完成 3 个 Vue 3 实战项目

### 算法与数据结构

- [ ] 每天一道 LeetCode
- [ ] 复习常见数据结构
- [ ] 学习动态规划

## Q2 计划（4-6 月）

### 后端提升

- [ ] 深入 Node.js 底层原理
- [ ] 学习微服务架构
- [ ] 掌握消息队列
- [ ] 学习 GraphQL

### 数据库优化

- [ ] MySQL 性能调优
- [ ] Redis 高级特性
- [ ] 数据库设计与架构

## Q3 计划（7-9 月）

### 云原生

- [ ] Docker 容器化
- [ ] Kubernetes 入门与实践
- [ ] CI/CD 自动化部署
- [ ] 云服务提供商（阿里云/AWS）

### 系统设计

- [ ] 分布式系统设计
- [ ] 高并发架构
- [ ] 缓存设计与优化

## Q4 计划（10-12 月）

### AI 与新技术

- [ ] 机器学习入门
- [ ] AI 辅助开发工具
- [ ] 探索 Web3.0
- [ ] 学习 Rust（可选）

### 总结与分享

- [ ] 写技术博客 50+ 篇
- [ ] 开源项目贡献
- [ ] 技术分享/演讲
- [ ] 年度技术总结

## 学习方法

### 1. 时间管理

- **工作日**：每天早起 1 小时学习
- **午休**：30 分钟阅读技术文章
- **晚上**：2 小时深度学习
- **周末**：一整天做项目或深入学习

### 2. 学习方式

| 方式 | 占比 | 说明 |
|------|------|------|
| 官方文档 | 30% | 最权威的学习资源 |
| 视频课程 | 25% | 快速入门新领域 |
| 书籍阅读 | 20% | 系统性深入学习 |
| 实战项目 | 20% | 学以致用，巩固知识 |
| 技术社区 | 5% | 了解行业动态 |

### 3. 输出倒逼输入

- **技术博客**：每周至少 1 篇
- **开源贡献**：每月至少 1 次 PR
- **笔记整理**：使用 Notion 整理知识体系
- **分享交流**：积极参与技术社区讨论

## 工具推荐

### 学习工具

- **笔记**：Notion、Obsidian
- **代码**：VS Code、GitHub
- **计划**：Todoist、Notion Calendar
- **阅读**：微信读书、Kindle

### 学习资源

- **前端**：Vue.js 官方文档、React 官方文档
- **后端**：Node.js 官方文档、Express.js
- **算法**：LeetCode、牛客网
- **视频**：极客时间、掘金小册、B站

## 激励机制

### 小目标奖励

- 完成月度计划 → 买一本技术书
- 完成季度计划 → 买一个电子产品
- 完成年度计划 → 奖励一次旅行

###  accountability

- 加入学习社群
- 找一个学习伙伴
- 公开学习计划
- 定期复盘总结

## 结语

学习是一个长期的过程，重要的不是速度，而是坚持。2024 年，希望能够保持初心，持续学习，不断成长。

如果你也有类似的学习计划，欢迎在评论区交流，我们一起进步！

---

*本文持续更新中，每月会复盘计划执行情况。*`,
    categoryId: 5,
    tagIds: [1, 2, 5],
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=learning%20plan%20calendar%20tech%20books%20warm%20light%20blog&image_size=landscape_16_9',
    isPinned: false,
    isDraft: false,
    sortOrder: 6,
    views: 345,
    likes: 28,
    createdAt: formatDate(new Date(2024, 0, 1)),
    updatedAt: formatDate(new Date(2024, 0, 5)),
    comments: [
      {
        id: 1,
        author: '技术爱好者',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techfan',
        content: '计划很详细，一起加油！',
        createdAt: formatDate(new Date(2024, 0, 2)),
        likes: 5
      }
    ]
  },
  {
    id: 7,
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    excerpt: 'TypeScript 的类型系统非常强大，掌握高级类型技巧可以让你的代码更加健壮和可维护。本文将深入探讨条件类型、映射类型、模板字面量类型等高级特性。',
    content: `# TypeScript 高级类型技巧

## 条件类型

### 基本语法

\`\`\`typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
\`\`\`

### 分布式条件类型

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never

type StringOrNumberArray = ToArray<string | number>
// string[] | number[]
\`\`\`

### infer 关键字

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any

type Func = () => string
type Result = ReturnType<Func>  // string
\`\`\`

## 映射类型

### 基本映射

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

interface User {
  name: string
  age: number
}

type ReadonlyUser = Readonly<User>
// { readonly name: string; readonly age: number; }

type PartialUser = Partial<User>
// { name?: string; age?: number; }
\`\`\`

### 映射类型修饰符

\`\`\`typescript
// 移除 readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

// 移除可选
type Required<T> = {
  [P in keyof T]-?: T[P]
}
\`\`\`

### 键重映射

\`\`\`typescript
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

interface User {
  name: string
  age: number
}

type UserGetters = Getters<User>
// {
//   getName: () => string;
//   getAge: () => number;
// }
\`\`\`

## 模板字面量类型

### 基本用法

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`

type ClickEvent = EventName<'click'>  // 'onClick'
type ChangeEvent = EventName<'change'>  // 'onChange'
\`\`\`

### 字符串操作类型

\`\`\`typescript
type S1 = Uppercase<'hello'>  // 'HELLO'
type S2 = Lowercase<'HELLO'>  // 'hello'
type S3 = Capitalize<'hello'>  // 'Hello'
type S4 = Uncapitalize<'Hello'>  // 'hello'
\`\`\`

### 高级用法

\`\`\`typescript
type CSSProperties = 'margin' | 'padding'

type CSSProperty<T extends string> =
  T extends \`\${infer P}\` ?
    P | \`\${P}Top\` | \`\${P}Right\` | \`\${P}Bottom\` | \`\${P}Left\` :
    never

type MarginProperties = CSSProperty<'margin'>
// 'margin' | 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'
\`\`\`

## 递归类型

### 深度只读

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

interface NestedObject {
  a: {
    b: {
      c: string
    }
  }
}

type DeepReadonlyNested = DeepReadonly<NestedObject>
// {
//   readonly a: {
//     readonly b: {
//       readonly c: string
//     }
//   }
// }
\`\`\`

### 元组转联合类型

\`\`\`typescript
type TupleToUnion<T extends readonly any[]> = T[number]

type Colors = ['red', 'green', 'blue']
type Color = TupleToUnion<Colors>  // 'red' | 'green' | 'blue'
\`\`\`

## 类型体操实战

### 实现 Pick

\`\`\`typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface User {
  id: number
  name: string
  email: string
}

type UserNameAndEmail = MyPick<User, 'name' | 'email'>
// { name: string; email: string; }
\`\`\`

### 实现 Omit

\`\`\`typescript
type MyOmit<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

interface User {
  id: number
  name: string
  password: string
}

type SafeUser = MyOmit<User, 'password'>
// { id: number; name: string; }
\`\`\`

### 实现 Promise 解包

\`\`\`typescript
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

type P1 = Promise<number>
type R1 = Awaited<P1>  // number

type P2 = Promise<Promise<string>>
type R2 = Awaited<P2>  // string
\`\`\`

## 总结

TypeScript 高级类型技巧：

1. **条件类型** - 根据类型关系选择不同类型
2. **映射类型** - 基于已有类型创建新类型
3. **模板字面量类型** - 操作字符串类型
4. **递归类型** - 处理嵌套结构
5. **类型体操** - 综合运用各种类型技巧

掌握这些高级技巧，你将能写出更类型安全、更优雅的 TypeScript 代码！`,
    categoryId: 1,
    tagIds: [1, 4],
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=typescript%20code%20blue%20dark%20theme%20type%20system%20tech%20blog&image_size=landscape_16_9',
    isPinned: false,
    isDraft: false,
    sortOrder: 7,
    views: 456,
    likes: 35,
    createdAt: formatDate(new Date(2024, 1, 20)),
    updatedAt: formatDate(new Date(2024, 2, 1)),
    comments: []
  }
]
