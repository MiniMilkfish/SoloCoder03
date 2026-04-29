---
id: 5
title: 'CSS Grid 与 Flexbox 布局实战对比'
slug: 'css-grid-vs-flexbox'
excerpt: 'CSS Grid 和 Flexbox 都是强大的布局工具，但它们各有所长。本文将通过多个实际案例，深入对比这两种布局方式的使用场景和最佳实践，帮助你在项目中做出正确的选择。'
categoryId: 1
tagIds: [6, 7]
coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=css%20grid%20flexbox%20layout%20design%20modern%20tech%20blog&image_size=landscape_16_9'
isPinned: false
isDraft: false
sortOrder: 5
views: 521
likes: 32
createdAt: '2024-03-10'
updatedAt: '2024-03-15'
comments: []
---

# CSS Grid 与 Flexbox 布局对比

## 核心概念

### Flexbox

Flexbox 是一维布局模型，适用于在行或列方向上布局元素。

```css
.container {
  display: flex;
  flex-direction: row; /* row | column | row-reverse | column-reverse */
  justify-content: center; /* 主轴对齐 */
  align-items: center; /* 交叉轴对齐 */
  gap: 10px;
}
```

### CSS Grid

CSS Grid 是二维布局模型，同时处理行和列。

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
}
```

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

```html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <button class="login-btn">Login</button>
</nav>
```

```css
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
```

### 等高卡片

```html
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
```

```css
.card-container {
  display: flex;
  gap: 20px;
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
}
```

## CSS Grid 实战案例

### 响应式网格

```html
<div class="gallery">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>
```

```css
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
```

### 复杂页面布局

```html
<div class="layout">
  <header>Header</header>
  <nav>Sidebar</nav>
  <main>Main Content</main>
  <aside>Aside</aside>
  <footer>Footer</footer>
</div>
```

```css
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
```

## 组合使用

### 最佳实践

大多数情况下，Grid 和 Flexbox 可以组合使用：

- **Grid 用于整体页面布局**
- **Flexbox 用于组件内部布局**

```css
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
```

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

理解两者的优势，在合适的场景选择合适的工具，是成为优秀前端开发者的必备技能！