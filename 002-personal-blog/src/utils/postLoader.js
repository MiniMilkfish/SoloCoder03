import { renderMarkdown } from './markdown'

const markdownFiles = import.meta.glob('../content/*.md', { as: 'raw' })

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
  
  let currentKey = '';
  let currentValue = '';
  let inList = false;
  let listItems = [];
  
  lines.forEach(line => {
    line = line.trim();
    
    if (line === '') return;
    
    if (line.startsWith('-') && inList) {
      listItems.push(line.replace('- ', ''));
    } else if (line.includes(':')) {
      if (inList) {
        metadata[currentKey] = listItems;
        inList = false;
        listItems = [];
      }
      
      const colonIndex = line.indexOf(':');
      currentKey = line.substring(0, colonIndex).trim();
      currentValue = line.substring(colonIndex + 1).trim();
      
      if (currentValue === '') {
        inList = true;
      } else if (currentValue === 'true') {
        metadata[currentKey] = true;
      } else if (currentValue === 'false') {
        metadata[currentKey] = false;
      } else if (!isNaN(currentValue) && currentValue !== '') {
        metadata[currentKey] = Number(currentValue);
      } else if (currentValue.startsWith('[') && currentValue.endsWith(']')) {
        try {
          metadata[currentKey] = JSON.parse(currentValue);
        } catch {
          metadata[currentKey] = currentValue;
        }
      } else if (currentValue.startsWith('{') && currentValue.endsWith('}')) {
        try {
          metadata[currentKey] = JSON.parse(currentValue);
        } catch {
          metadata[currentKey] = currentValue;
        }
      } else if (currentValue.startsWith('\'')) {
        metadata[currentKey] = currentValue.substring(1, currentValue.length - 1);
      } else if (currentValue.startsWith('"')) {
        metadata[currentKey] = currentValue.substring(1, currentValue.length - 1);
      } else {
        metadata[currentKey] = currentValue;
      }
    }
  });
  
  if (inList) {
    metadata[currentKey] = listItems;
  }
  
  return { metadata, content: markdownContent };
}

function parseComments(commentsStr) {
  if (!commentsStr) return [];
  
  try {
    const comments = JSON.parse(commentsStr);
    return Array.isArray(comments) ? comments : [];
  } catch {
    return [];
  }
}

export async function loadPosts() {
  const posts = [];
  
  for (const [path, loadFile] of Object.entries(markdownFiles)) {
    try {
      const content = await loadFile();
      const { metadata, content: markdownContent } = parseYAMLFrontMatter(content);
      
      // 解析评论
      if (metadata.comments && typeof metadata.comments === 'string') {
        metadata.comments = parseComments(metadata.comments);
      }
      
      // 解析标签ID
      if (metadata.tagIds && typeof metadata.tagIds === 'string') {
        try {
          metadata.tagIds = JSON.parse(metadata.tagIds);
        } catch {
          metadata.tagIds = [];
        }
      }
      
      posts.push({
        ...metadata,
        content: markdownContent
      });
    } catch (error) {
      console.error(`Error loading post: ${path}`, error);
    }
  }
  
  // 按排序和发布时间排序
  return posts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}


