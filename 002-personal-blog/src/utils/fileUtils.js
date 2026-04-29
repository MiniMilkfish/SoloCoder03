import { marked } from 'marked'

// 浏览器环境中不使用 fs 模块
let readFileSync, writeFileSync, unlinkSync, existsSync, join
let contentDir

if (typeof window === 'undefined') {
  // Node.js 环境
  const fs = require('fs')
  const path = require('path')
  readFileSync = fs.readFileSync
  writeFileSync = fs.writeFileSync
  unlinkSync = fs.unlinkSync
  existsSync = fs.existsSync
  join = path.join
  contentDir = join(process.cwd(), 'content')
} else {
  // 浏览器环境
  contentDir = '/content'
  // 浏览器环境下的模拟实现
  readFileSync = () => ''
  writeFileSync = () => {}
  unlinkSync = () => {}
  existsSync = () => false
  join = (a, b) => `${a}/${b}`
}

function parseYAMLFrontMatter(content) {
  const yamlRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(yamlRegex);
  
  if (!match) {
    return { metadata: {}, content: content };
  }
  
  const yamlContent = match[1];
  const markdownContent = content.replace(yamlRegex, '');
  
  const metadata = {};
  const lines = yamlContent.split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    if (line === '') return;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if (!isNaN(value) && value !== '') {
      value = Number(value);
    } else if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value);
      } catch {
        // 保持原值
      }
    } else if (value.startsWith('{') && value.endsWith('}')) {
      try {
        value = JSON.parse(value);
      } catch {
        // 保持原值
      }
    } else if (value.startsWith('\'')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    
    metadata[key] = value;
  });
  
  return { metadata, content: markdownContent };
}

function generateYAMLFrontMatter(metadata) {
  let yaml = '---\n';
  
  Object.entries(metadata).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    
    if (Array.isArray(value)) {
      yaml += `${key}: ${JSON.stringify(value)}\n`;
    } else if (typeof value === 'object') {
      yaml += `${key}: ${JSON.stringify(value)}\n`;
    } else if (typeof value === 'string') {
      yaml += `${key}: '${value}'\n`;
    } else {
      yaml += `${key}: ${value}\n`;
    }
  });
  
  yaml += '---\n\n';
  return yaml;
}

export function getPostFilePath(slug) {
  return join(contentDir, `${slug}.md`);
}

export function readPost(slug) {
  const filePath = getPostFilePath(slug);
  if (!existsSync(filePath)) {
    return null;
  }
  
  try {
    const content = readFileSync(filePath, 'utf8');
    const { metadata, content: markdownContent } = parseYAMLFrontMatter(content);
    return {
      ...metadata,
      content: markdownContent
    };
  } catch (error) {
    console.error('Error reading post:', error);
    return null;
  }
}

export function writePost(post) {
  try {
    const { content, ...metadata } = post;
    const yaml = generateYAMLFrontMatter(metadata);
    const fullContent = yaml + content;
    const filePath = getPostFilePath(post.slug);
    
    writeFileSync(filePath, fullContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing post:', error);
    return false;
  }
}

export function deletePost(slug) {
  try {
    const filePath = getPostFilePath(slug);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

export function listPosts() {
  try {
    const fs = require('fs');
    const files = fs.readdirSync(contentDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const posts = [];
    for (const file of mdFiles) {
      const slug = file.replace('.md', '');
      const post = readPost(slug);
      if (post) {
        posts.push(post);
      }
    }
    
    return posts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } catch (error) {
    console.error('Error listing posts:', error);
    return [];
  }
}

export function updatePost(slug, updates) {
  const post = readPost(slug);
  if (!post) return false;
  
  const updatedPost = {
    ...post,
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  return writePost(updatedPost);
}
