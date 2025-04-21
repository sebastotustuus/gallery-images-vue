import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { ref } from 'vue'
import GalleryGrid from '../../features/gallery/components/organisms/GalleryGrid.vue'
import type { ImageProps } from '../../features/gallery/domain/entities/Image'

vi.mock('../../features/gallery/composables/useMasonryLayout', () => ({
  useMasonryLayout: () => ({
    loading: ref(false),
    containerHeight: ref('1000px'),
    calculateLayout: vi.fn().mockResolvedValue(undefined),
    throttledCalculateLayout: vi.fn(),
    getPositionById: (id: string) => ({
      x: parseInt(id) * 100, 
      y: parseInt(id) * 100,
      width: 200,
      height: 200
    }),
    resetLoading: vi.fn(),
    clearCache: vi.fn()
  })
}))

vi.mock('../../features/gallery/composables/useResizeObserver', () => ({
  useResizeObserver: () => ({
    observeElement: vi.fn()
  })
}))

vi.mock('../../features/gallery/composables/useVirtualScroll', () => ({
  useVirtualScroll: () => ({
    scrollContainerRef: ref({ offsetWidth: 1000 }),
    isItemInViewport: () => true,
    handleScroll: vi.fn(),
    resetVirtualizer: vi.fn()
  })
}))

describe('GalleryGrid Component', () => {
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

  beforeEach(() => {
    const el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should render the grid with images', async () => {
    const { queryAllByRole } = render(GalleryGrid, {
      props: {
        images: mockImages
      }
    } as any)

    const images = queryAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('should emit select event when an image is clicked', async () => {
    const { queryAllByRole, emitted } = render(GalleryGrid, {
      props: {
        images: mockImages
      }
    } as any)

    const images = queryAllByRole('img')
    await fireEvent.click(images[0])

    const selectEvents = (emitted() as any).select
    expect(selectEvents).toBeTruthy()
    expect(selectEvents[0][0]).toEqual(mockImages[0])
  })

  it('should not show any images when array is empty', async () => {
    const { queryAllByRole } = render(GalleryGrid, {
      props: {
        images: []
      }
    } as any)

    const images = queryAllByRole('img')
    expect(images.length).toBe(0)
  })

  it('should recalculate layout when images prop changes', async () => {
    const masonryModule = await import('../../features/gallery/composables/useMasonryLayout')
    const calculateLayoutSpy = vi.fn()
    const resetLoadingSpy = vi.fn()
    const clearCacheSpy = vi.fn()
    
    vi.spyOn(masonryModule, 'useMasonryLayout').mockImplementation(() => ({
      loading: ref(false),
      containerWidth: ref(1000),
      containerHeight: ref('1000px'),
      itemsLoaded: ref(0),
      calculateLayout: calculateLayoutSpy,
      throttledCalculateLayout: vi.fn(),
      getPositionById: () => ({ x: 0, y: 0, width: 200, height: 200 }),
      resetLoading: resetLoadingSpy,
      clearCache: clearCacheSpy
    }) as any)

    const { rerender } = render(GalleryGrid, {
      props: {
        images: mockImages
      }
    } as any)

    await rerender({ images: [mockImages[0]] })

    expect(resetLoadingSpy).toHaveBeenCalled()
    expect(clearCacheSpy).toHaveBeenCalled()
    expect(calculateLayoutSpy).toHaveBeenCalled()
  })
})
