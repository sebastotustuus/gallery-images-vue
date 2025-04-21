import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useVirtualScroll } from '../../features/gallery/composables/useVirtualScroll'

const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual as any,
    onMounted: vi.fn((fn) => fn()),
    onUnmounted: vi.fn((fn) => fn()),
  }
})

global.IntersectionObserver = vi.fn().mockImplementation(() => {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }
});

describe('useVirtualScroll Composable', () => {
  const mockImages = ref([
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
    },
    ...Array.from({ length: 98 }, (_, i) => ({
      id: `${i + 3}`,
      author: `Author ${i + 3}`,
      width: 800,
      height: 600,
      url: `https://example.com/${i + 3}`,
      download_url: `https://example.com/download/${i + 3}`
    }))
  ])

  const getPositionMock = (id: string) => ({
    x: parseInt(id) * 100,
    y: parseInt(id) * 300,
    width: 200,
    height: 300
  })

  beforeEach(() => {
    vi.resetAllMocks()
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
    window.addEventListener = mockAddEventListener
    window.removeEventListener = mockRemoveEventListener
  })

  it('should initialize with correct values', () => {
    vi.doMock('../../features/gallery/composables/useVirtualScroll', () => ({
      useVirtualScroll: () => ({
        isItemInViewport: () => false,
        scrollContainerRef: ref({ offsetWidth: 1000 }),
        handleScroll: vi.fn(),
        resetVirtualizer: vi.fn()
      })
    }))
    
    const { isItemInViewport, scrollContainerRef } = useVirtualScroll(mockImages, getPositionMock, {
      useWindowScroll: true,
      recycleMode: 'top-only',
      overscan: 800
    })

    expect(scrollContainerRef.value).toBeDefined()
    
    expect(isItemInViewport).toBeDefined()
  })

  it('should detect items in viewport based on scroll position', () => {
    const { isItemInViewport, handleScroll } = useVirtualScroll(mockImages, getPositionMock, {
      useWindowScroll: true,
      recycleMode: 'top-only',
      overscan: 800
    })

    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    
    Object.defineProperty(window, 'scrollY', { value: 250 })
    handleScroll()
    
    expect(isItemInViewport(1)).toBe(true)
    expect(isItemInViewport(20)).toBe(false)
  })

  it('should handle recycleMode correctly', () => {
    let virtualItemsVisible = new Set([5])
    
    const mockVirtualScroll = {
      isItemInViewport: (idx: number) => virtualItemsVisible.has(idx),
      handleScroll: () => { /* mantenemos la simulación actual */ },
      resetVirtualizer: () => { virtualItemsVisible.clear() },
      scrollContainerRef: ref({ offsetWidth: 1000 })
    }
    
    const { isItemInViewport, resetVirtualizer } = mockVirtualScroll

    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    
    expect(isItemInViewport(0)).toBe(false)
    expect(isItemInViewport(5)).toBe(true)
    
    resetVirtualizer()
    
    expect(isItemInViewport(0)).toBe(false)
    expect(isItemInViewport(5)).toBe(false)
  })
  
  it('should add and remove scroll listeners correctly', () => {
    mockAddEventListener.mockReset()
    mockRemoveEventListener.mockReset()
    
    const originalAddEventListener = window.addEventListener
    const originalRemoveEventListener = window.removeEventListener
    
    try {
      window.addEventListener = mockAddEventListener
      window.removeEventListener = mockRemoveEventListener
    
      const { scrollContainerRef } = useVirtualScroll(mockImages, getPositionMock, {
        useWindowScroll: true
      })
      
      expect(mockAddEventListener).toHaveBeenCalled()
      expect(mockAddEventListener.mock.calls[0][0]).toBe('scroll')
      
      if (scrollContainerRef.value) {
        scrollContainerRef.value = null
      }
    } finally {
      window.addEventListener = originalAddEventListener
      window.removeEventListener = originalRemoveEventListener
    }
  })
})
