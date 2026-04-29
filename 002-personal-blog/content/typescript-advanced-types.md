---
id: 7
title: 'TypeScript 高级类型技巧'
slug: 'typescript-advanced-types'
excerpt: 'TypeScript 的类型系统非常强大，掌握高级类型技巧可以让你的代码更加健壮和可维护。本文将深入探讨条件类型、映射类型、模板字面量类型等高级特性。'
categoryId: 1
tagIds: [1, 4]
coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=typescript%20code%20blue%20dark%20theme%20type%20system%20tech%20blog&image_size=landscape_16_9'
isPinned: false
isDraft: false
sortOrder: 7
views: 456
likes: 35
createdAt: '2024-02-20'
updatedAt: '2024-03-01'
comments: []
---

# TypeScript 高级类型技巧

## 条件类型

### 基本语法

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

### 分布式条件类型

```typescript
type ToArray<T> = T extends any ? T[] : never

type StringOrNumberArray = ToArray<string | number>
// string[] | number[]
```

### infer 关键字

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any

type Func = () => string
type Result = ReturnType<Func>  // string
```

## 映射类型

### 基本映射

```typescript
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
```

### 映射类型修饰符

```typescript
// 移除 readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

// 移除可选
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

### 键重映射

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
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
```

## 模板字面量类型

### 基本用法

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`

type ClickEvent = EventName<'click'>  // 'onClick'
type ChangeEvent = EventName<'change'>  // 'onChange'
```

### 字符串操作类型

```typescript
type S1 = Uppercase<'hello'>  // 'HELLO'
type S2 = Lowercase<'HELLO'>  // 'hello'
type S3 = Capitalize<'hello'>  // 'Hello'
type S4 = Uncapitalize<'Hello'>  // 'hello'
```

### 高级用法

```typescript
type CSSProperties = 'margin' | 'padding'

type CSSProperty<T extends string> =
  T extends `${infer P}` ?
    P | `${P}Top` | `${P}Right` | `${P}Bottom` | `${P}Left` :
    never

type MarginProperties = CSSProperty<'margin'>
// 'margin' | 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft'
```

## 递归类型

### 深度只读

```typescript
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
```

### 元组转联合类型

```typescript
type TupleToUnion<T extends readonly any[]> = T[number]

type Colors = ['red', 'green', 'blue']
type Color = TupleToUnion<Colors>  // 'red' | 'green' | 'blue'
```

## 类型体操实战

### 实现 Pick

```typescript
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
```

### 实现 Omit

```typescript
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
```

### 实现 Promise 解包

```typescript
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

type P1 = Promise<number>
type R1 = Awaited<P1>  // number

type P2 = Promise<Promise<string>>
type R2 = Awaited<P2>  // string
```

## 总结

TypeScript 高级类型技巧：

1. **条件类型** - 根据类型关系选择不同类型
2. **映射类型** - 基于已有类型创建新类型
3. **模板字面量类型** - 操作字符串类型
4. **递归类型** - 处理嵌套结构
5. **类型体操** - 综合运用各种类型技巧

掌握这些高级技巧，你将能写出更类型安全、更优雅的 TypeScript 代码！