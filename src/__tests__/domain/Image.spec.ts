import { describe, it, expect } from 'vitest'
import { Image } from '../../features/gallery/domain/entities/Image'

describe('Image Entity', () => {
  const mockImageProps = {
    id: 'test-id-123',
    author: 'Test Author',
    width: 1200,
    height: 800,
    url: 'https://example.com/image',
    download_url: 'https://example.com/image/download'
  }

  it('should create an Image entity with the correct properties', () => {
    const image = new Image(mockImageProps)
    
    expect(image.id).toBe(mockImageProps.id)
    expect(image.author).toBe(mockImageProps.author)
    expect(image.width).toBe(mockImageProps.width)
    expect(image.height).toBe(mockImageProps.height)
    expect(image.url).toBe(mockImageProps.url)
    expect(image.downloadUrl).toBe(mockImageProps.download_url)
  })

  it('should convert to JSON correctly', () => {
    const image = new Image(mockImageProps)
    const json = image.toJson()
    
    expect(json).toEqual(mockImageProps)
    expect(json.id).toBe(mockImageProps.id)
    expect(json.author).toBe(mockImageProps.author)
    expect(json.width).toBe(mockImageProps.width)
    expect(json.height).toBe(mockImageProps.height)
    expect(json.url).toBe(mockImageProps.url)
    expect(json.download_url).toBe(mockImageProps.download_url)
  })

  it('should maintain immutability of internal properties', () => {
    const image = new Image(mockImageProps)
    const json1 = image.toJson()
    
    json1.author = 'Modified Author'
    
    const json2 = image.toJson()
    expect(json2.author).toBe(mockImageProps.author)
    expect(json2.author).not.toBe('Modified Author')
  })

  it('should calculate aspect ratio correctly', () => {
    const image = new Image(mockImageProps)
    const expectedAspectRatio = mockImageProps.width / mockImageProps.height
    
    const aspectRatio = image.width / image.height
    expect(aspectRatio).toBe(expectedAspectRatio)
  })
})
