import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PicsumGalleryRepository } from '../../features/gallery/infrastructure/repositories/GalleryRepository'
import { Image } from '../../features/gallery/domain/entities/Image'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('PicsumGalleryRepository', () => {
  let repository: PicsumGalleryRepository
  
  const mockImagesData = [
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
    mockFetch.mockReset()
    repository = new PicsumGalleryRepository()
  })
  
  it('should fetch images and transform them into Image entities', async () => {
    // Mock de respuesta exitosa
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockImagesData)
    })
    
    const result = await repository.fetchImages(2)
    
    expect(mockFetch).toHaveBeenCalledWith('https://picsum.photos/v2/list?limit=2')
    
    expect(result.length).toBe(2)
    expect(result[0]).toBeInstanceOf(Image)
    expect(result[1]).toBeInstanceOf(Image)
    
    expect(result[0].id).toBe('1')
    expect(result[0].author).toBe('Author 1')
    expect(result[1].id).toBe('2')
    expect(result[1].author).toBe('Author 2')
  })
  
  it('should return an empty array if the API response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false
    })
    
    const result = await repository.fetchImages(10)
    
    expect(mockFetch).toHaveBeenCalledWith('https://picsum.photos/v2/list?limit=10')
    
    expect(result).toEqual([])
    expect(result.length).toBe(0)
  })
  
  it('should return an empty array and log error if fetch throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    mockFetch.mockRejectedValue(new Error('Network error'))
    
    const result = await repository.fetchImages(5)
    
    expect(mockFetch).toHaveBeenCalledWith('https://picsum.photos/v2/list?limit=5')
    
    expect(result).toEqual([])
    expect(result.length).toBe(0)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching gallery images:',
      expect.any(Error)
    )
    consoleSpy.mockRestore()
  })
})
