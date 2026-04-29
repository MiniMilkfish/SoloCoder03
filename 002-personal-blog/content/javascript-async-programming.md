---
id: 2
title: 'JavaScript 异步编程详解：从回调到 async/await'
slug: 'javascript-async-programming'
excerpt: '异步编程是 JavaScript 的核心概念之一。本文将带你回顾从回调函数到 Promise，再到 async/await 的演进历程，深入理解每种方案的原理和最佳实践。'
categoryId: 1
tagIds: [1, 4]
coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=javascript%20async%20programming%20code%20dark%20theme%20tech%20blog&image_size=landscape_16_9'
isPinned: true
isDraft: false
sortOrder: 2
views: 987
likes: 67
createdAt: '2024-02-01'
updatedAt: '2024-03-05'
comments:
  - id: 1
    author: '王五'
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu'
    content: 'async/await 真的是太香了！'
    createdAt: '2024-02-02'
    likes: 15
---

# JavaScript 异步编程详解

## 异步编程的演进历程

JavaScript 异步编程经历了三个主要阶段：

1. **回调函数** - 最早的异步处理方式
2. **Promise** - ES6 引入的标准方案
3. **async/await** - ES2017 引入的语法糖

## 回调函数

### 基本概念

回调函数是一种通过参数传递给其他函数，并在特定时机执行的函数。

```javascript
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
```

### 回调地狱

当嵌套多层回调时，代码会变得难以维护，这就是所谓的"回调地狱"：

```javascript
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
```

## Promise

### 基本用法

Promise 提供了一种更优雅的方式来处理异步操作：

```javascript
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
```

### Promise 链式调用

```javascript
getUser(userId)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err))
```

## async/await

### 基本概念

async/await 是基于 Promise 的语法糖，让异步代码看起来像同步代码：

```javascript
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
```

### 并行执行

使用 `Promise.all` 并行执行多个异步操作：

```javascript
async function getAllData() {
  const [user, posts, comments] = await Promise.all([
    getUser(userId),
    getPosts(userId),
    getComments(postId)
  ])
  
  console.log(user, posts, comments)
}
```

## 总结

| 方案 | 优点 | 缺点 |
|------|------|------|
| 回调函数 | 简单直接 | 回调地狱、难以维护 |
| Promise | 链式调用、状态管理 | 仍有 .then() 嵌套 |
| async/await | 代码简洁、像同步代码 | 需要理解 Promise 基础 |

在现代 JavaScript 开发中，推荐使用 **async/await** 配合 **Promise** 来处理异步操作。