import { renderMarkdown } from './markdown'

const markdownFiles = import.meta.glob('../content/*.md', { as: 'raw' })
console.log('Markdown files found:', Object.keys(markdownFiles))

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
      
      // 确保 comments 是数组
      if (metadata.comments && !Array.isArray(metadata.comments)) {
        try {
          metadata.comments = JSON.parse(metadata.comments);
          if (!Array.isArray(metadata.comments)) {
            metadata.comments = [];
          }
        } catch {
          metadata.comments = [];
        }
      } else if (!metadata.comments) {
        metadata.comments = [];
      }
      
      // 确保 tagIds 是数组
      if (metadata.tagIds && !Array.isArray(metadata.tagIds)) {
        try {
          metadata.tagIds = JSON.parse(metadata.tagIds);
          if (!Array.isArray(metadata.tagIds)) {
            metadata.tagIds = [];
          }
        } catch {
          metadata.tagIds = [];
        }
      } else if (!metadata.tagIds) {
        metadata.tagIds = [];
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


