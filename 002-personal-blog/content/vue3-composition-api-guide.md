---
id: 1
title: 'Vue 3 Composition API 完全指南'
slug: 'vue3-composition-api-guide'
excerpt: '本文将深入探讨 Vue 3 的 Composition API，包括 setup 函数、响应式数据、生命周期钩子等核心概念，帮助你更好地理解和使用这个强大的新特性。'
categoryId: 1
tagIds: [1, 2, 4]
coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vue%203%20javascript%20code%20editor%20modern%20minimal%20tech%20blog&image_size=landscape_16_9'
isPinned: true
isDraft: false
sortOrder: 1
views: 1256
likes: 89
createdAt: '2024-01-15'
updatedAt: '2024-03-10'
comments:
  - id: 1
    author: '张三'
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan'
    content: '写得非常详细，学到了很多！'
    createdAt: '2024-01-16'
    likes: 12
  - id: 2
    author: '李四'
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi'
    content: 'Composition API 确实比 Options API 更灵活，代码组织更清晰了。'
    createdAt: '2024-01-17'
    likes: 8
---

# Vue 3 Composition API 完全指南

## 什么是 Composition API？

Vue 3 引入了 Composition API，这是一种新的编写组件逻辑的方式。与 Options API 不同，Composition API 允许我们按逻辑关注点组织代码，而不是按选项类型。

### 核心概念

1. **setup 函数**：Composition API 的入口点
2. **响应式数据**：使用 `ref` 和 `reactive`
3. **计算属性**：使用 `computed`
4. **监听器**：使用 `watch` 和 `watchEffect`
5. **生命周期钩子**：使用 `onMounted`, `onUpdated` 等

## 基本用法

### setup 函数

```javascript
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
```

### 使用 `<script setup>`

在 Vue 3.2+ 中，你可以使用更简洁的语法：

```vue
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
```

## 响应式数据

### ref vs reactive

| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 基本类型 + 对象 | 对象 |
| 访问方式 | 需要 .value | 直接访问 |
| 解构保持响应 | 否 | 否（需要 toRefs） |

### 示例

```javascript
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
```

## 总结

Composition API 提供了一种更灵活的方式来组织组件逻辑，特别适合大型项目。它允许我们：

- 按逻辑关注点组织代码
- 更好地重用逻辑（通过组合函数）
- 更好的 TypeScript 支持

希望这篇指南能帮助你更好地理解 Vue 3 的 Composition API！