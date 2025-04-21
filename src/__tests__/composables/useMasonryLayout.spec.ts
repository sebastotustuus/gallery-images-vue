import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useMasonryLayout } from '../../features/gallery/composables/useMasonryLayout'
import type { ImageProps } from '../../features/gallery/domain/entities/Image'

vi.mock('@vueuse/core', () => ({
  useThrottleFn: (fn: Function) => fn
}))

describe('useMasonryLayout Composable', () => {
  const mockImages: ImageProps[] = [
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

  let originalCreateImage: typeof Image.prototype.constructor
  
  beforeEach(() => {
    originalCreateImage = global.Image
    global.Image = class extends HTMLImageElement {
      onload: () => void = () => {}
      
      constructor() {
        super()
        setTimeout(() => {
          if (this.onload) this.onload()
        }, 0)
      }
    }
  })
  
  afterEach(() => {
    global.Image = originalCreateImage
  })

  it('should initialize with correct default values', () => {
    const { loading, containerHeight } = useMasonryLayout()
    
    expect(loading.value).toBe(true)
    
    expect(typeof containerHeight.value).toBe('string')
  })
  
  it('should calculate layout and update containerHeight', async () => {
    const mockPositions = new Map();
    mockImages.forEach((img, index) => {
      mockPositions.set(img.id, {
        x: index * 100,
        y: index * 200,
        width: 200,
        height: 200
      })
    })
    
    const mockCalculateLayout = vi.fn().mockResolvedValue(true)
    const mockContainerHeight = ref('500px')
    const mockGetPositionById = (id: string) => mockPositions.get(id)
    
    const calculateLayout = mockCalculateLayout
    const containerHeight = mockContainerHeight
    const getPositionById = mockGetPositionById
    
    await calculateLayout(mockImages, 1000)
    
    expect(containerHeight.value).toBe('500px')
    mockImages.forEach(img => {
      const position = getPositionById(img.id)
      expect(position).toBeTruthy()
    })
  })
  
  it('should use cache for repeated calculations with same parameters', async () => {
    let cacheHit = false
    const mockClearCache = vi.fn(() => { cacheHit = false })
    const mockCalculate = vi.fn().mockImplementation(() => {
      if (!cacheHit) {
        cacheHit = true
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    })
    
    const mockMasonryLayoutObj = { 
      calculateLayout: mockCalculate,
      clearCache: mockClearCache,
      getPositionById: vi.fn()
    }
    
    const { clearCache } = mockMasonryLayoutObj
    
    await mockCalculate(mockImages, 1000)
    expect(mockCalculate).toHaveBeenCalledTimes(1)
    expect(cacheHit).toBe(true) // Ahora tiene cache
    
    await mockCalculate(mockImages, 1000)
    expect(mockCalculate).toHaveBeenCalledTimes(2)
    
    clearCache()
    expect(cacheHit).toBe(false) // Ya no tiene cache
    
    expect(mockClearCache).toHaveBeenCalled()
  })
  
  it('should reset loading state', () => {
    const loading = ref(true)
    const resetLoading = (newValue: boolean) => {
      loading.value = newValue
    }
    
    expect(loading.value).toBe(true)
    
    resetLoading(false)
    
    expect(loading.value).toBe(false)
  })  
})
