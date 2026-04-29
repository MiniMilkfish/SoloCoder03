import { marked } from 'marked'
import hljs from 'highlight.js'

const renderer = new marked.Renderer()

const originalCode = renderer.code.bind(renderer)
renderer.code = function(code, lang) {
  const validLang = hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = hljs.highlight(code, { language: validLang }).value
  return `<pre class="code-block" data-lang="${validLang}"><code class="hljs language-${validLang}">${highlighted}</code></pre>`
}

const originalHeading = renderer.heading.bind(renderer)
renderer.heading = function(text, level, raw) {
  const id = raw.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '')
  return `<h${level} id="${id}" class="heading-${level}">${text}</h${level}>`
}

renderer.link = function(href, title, text) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')
  if (isExternal) {
    return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`
  }
  return `<a href="${href}" title="${title || ''}">${text}</a>`
}

renderer.image = function(href, title, text) {
  return `<img src="${href}" alt="${text}" title="${title || ''}" loading="lazy" class="article-image"/>`
}

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true
})

export function renderMarkdown(content) {
  return marked.parse(content)
}

export function extractTOC(content) {
  const headings = []
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '')
    
    headings.push({
      level,
      text,
      id
    })
  }
  
  return headings
}

export function buildTOCStructure(headings) {
  const toc = []
  const stack = []
  
  headings.forEach(heading => {
    const item = { ...heading, children: [] }
    
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      toc.push(item)
    } else {
      stack[stack.length - 1].children.push(item)
    }
    
    stack.push(item)
  })
  
  return toc
}
