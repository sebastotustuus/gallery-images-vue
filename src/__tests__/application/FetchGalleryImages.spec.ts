import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FetchGalleryImages } from '../../features/gallery/application/use-cases/FetchGalleryImages'
import { Image } from '../../features/gallery/domain/entities/Image'
import type { GalleryRepository } from '../../features/gallery/infrastructure/repositories/GalleryRepository'
import type { ImageProps } from '../../features/gallery/domain/entities/Image'

describe('FetchGalleryImages Use Case', () => {
  const mockRepo: GalleryRepository = {
    fetchImages: vi.fn()
  }
  
  let fetchGalleryImages: FetchGalleryImages
  
  const mockImageData: ImageProps[] = [
    {
      id: '1',
      author: 'Author 1',
      width: 1200,
      height: 800,
      url: 'https://example.com/1',
      download_url: 'https://example.com/download/1'
    },
    {
      id: '2',
      author: 'Author 2',
      width: 900,
      height: 600,
      url: 'https://example.com/2',
      download_url: 'https://example.com/download/2'
    }
  ]
  
  beforeEach(() => {
    vi.resetAllMocks()
    fetchGalleryImages = new FetchGalleryImages(mockRepo)
  })
  
  it('should fetch images from the repository and transform them to plain objects', async () => {
    mockRepo.fetchImages = vi.fn().mockResolvedValue(
      mockImageData.map(data => new Image(data))
    )
    
    const result = await fetchGalleryImages.execute(2)
    
    expect(mockRepo.fetchImages).toHaveBeenCalledWith(2)
    expect(mockRepo.fetchImages).toHaveBeenCalledTimes(1)
    
    expect(result).toEqual(mockImageData)
    expect(result.length).toBe(2)
    
    result.forEach((item, index) => {
      expect(item.id).toBe(mockImageData[index].id)
      expect(item.author).toBe(mockImageData[index].author)
      expect(item.width).toBe(mockImageData[index].width)
      expect(item.height).toBe(mockImageData[index].height)
      expect(item.url).toBe(mockImageData[index].url)
      expect(item.download_url).toBe(mockImageData[index].download_url)
    })
  })
  
  it('should use default limit of 100 if not specified', async () => {
    mockRepo.fetchImages = vi.fn().mockResolvedValue([])
    
    await fetchGalleryImages.execute()
    
    expect(mockRepo.fetchImages).toHaveBeenCalledWith(100)
  })
  
  it('should return an empty array when repository returns empty', async () => {
    mockRepo.fetchImages = vi.fn().mockResolvedValue([])
    
    const result = await fetchGalleryImages.execute()
    
    expect(result).toEqual([])
    expect(result.length).toBe(0)
  })
})
