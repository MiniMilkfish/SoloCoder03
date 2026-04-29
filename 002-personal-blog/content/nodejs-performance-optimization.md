---
id: 4
title: 'Node.js 性能优化实战指南'
slug: 'nodejs-performance-optimization'
excerpt: 'Node.js 应用的性能优化是每个后端开发者必须掌握的技能。本文将从事件循环、内存管理、集群模式、缓存策略等多个角度，带你深入了解如何让你的 Node.js 应用飞起来。'
categoryId: 2
tagIds: [1, 5]
coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nodejs%20server%20performance%20optimization%20dark%20tech%20blog&image_size=landscape_16_9'
isPinned: false
isDraft: false
sortOrder: 4
views: 634
likes: 38
createdAt: '2024-03-01'
updatedAt: '2024-03-12'
comments: []
---

# Node.js 性能优化实战指南

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

```javascript
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
```

## 使用集群模式

```javascript
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  require('./app')
  console.log(`Worker ${process.pid} started`)
}
```

## 内存管理

### 避免内存泄漏

```javascript
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
```

## 数据库优化

### 使用连接池

```javascript
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
```

## 缓存策略

### Redis 缓存

```javascript
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
```

## 性能监控

### 使用 Node.js 内置工具

```javascript
// 内存使用
console.log(process.memoryUsage())

// CPU 使用
console.log(process.cpuUsage())

// 事件循环延迟
const { performance } = require('perf_hooks')
const start = performance.now()

setTimeout(() => {
  const delay = performance.now() - start - 100
  console.log(`Event loop delay: ${delay}ms`)
}, 100)
```

## 总结

Node.js 性能优化的关键点：

1. **理解事件循环** - 避免阻塞主线程
2. **使用集群模式** - 充分利用多核 CPU
3. **优化数据库操作** - 连接池、索引、查询优化
4. **合理使用缓存** - 减少数据库访问
5. **监控和分析** - 定位性能瓶颈
6. **内存管理** - 避免内存泄漏

持续监控和迭代优化是保持应用高性能的关键！