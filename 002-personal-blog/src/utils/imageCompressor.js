import axios from 'axios'

// 使用 TinyPNG API 压缩图片
export async function compressImage(imageUrl) {
  try {
    // 这里使用 TinyPNG 的 API 进行压缩
    // 注意：实际使用时需要替换为真实的 API key
    const apiKey = 'YOUR_TINYPNG_API_KEY'
    
    const response = await axios.post(
      'https://api.tinify.com/shrink',
      { source: { url: imageUrl } },
      {
        headers: {
          'Authorization': `Basic ${btoa(`api:${apiKey}`)}`
        }
      }
    )
    
    if (response.data.output && response.data.output.url) {
      return response.data.output.url
    }
    return imageUrl
  } catch (error) {
    console.error('Error compressing image:', error)
    return imageUrl
  }
}

// 本地压缩图片（前端压缩）
export function compressImageLocally(file) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = function() {
      // 设置压缩后的尺寸
      const maxWidth = 1200
      const maxHeight = 800
      let width = img.width
      let height = img.height
      
      if (width > maxWidth) {
        height = height * (maxWidth / width)
        width = maxWidth
      }
      if (height > maxHeight) {
        width = width * (maxHeight / height)
        height = maxHeight
      }
      
      canvas.width = width
      canvas.height = height
      
      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height)
      
      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 创建临时 URL
            const compressedUrl = URL.createObjectURL(blob)
            resolve(compressedUrl)
          } else {
            resolve(URL.createObjectURL(file))
          }
        },
        'image/jpeg',
        0.8 // 压缩质量
      )
    }
    
    img.onerror = function() {
      resolve(URL.createObjectURL(file))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// 检查图片是否需要压缩
export function shouldCompressImage(file) {
  const maxSize = 1024 * 1024 // 1MB
  return file && file.size > maxSize
}

// 获取图片信息
export function getImageInfo(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = function() {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      })
    }
    img.onerror = function() {
      resolve(null)
    }
    img.src = imageUrl
  })
}
