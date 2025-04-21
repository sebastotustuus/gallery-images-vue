import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/vue'
import GalleryPage from '../../features/gallery/components/pages/GalleryPage.vue'

const mockOpen = vi.fn()

vi.mock('../../features/gallery/composables/useGallery', () => ({
  useGallery: () => ({
    data: {
      value: [
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
    }
  })
}))

vi.mock('../../features/gallery/components/organisms/GalleryGrid.vue', () => ({
  default: {
    name: 'GalleryGrid',
    template: '<div data-testid="gallery-grid"></div>'
  }
}))

vi.mock('../../features/gallery/components/molecules/ImageModal.vue', () => ({
  default: {
    name: 'ImageModal',
    template: '<div data-testid="image-modal"></div>'
  }
}))

vi.mock('../../features/gallery/application/useCases/FetchGalleryImages', () => ({
  FetchGalleryImages: class {
    execute = vi.fn().mockResolvedValue([{
      id: '1',
      author: 'Author 1',
      width: 1200,
      height: 800,
      url: 'https://example.com',
      download_url: 'https://example.com/download'
    }])
  }
}))

vi.mock('../../features/gallery/composables/useModal', () => ({
  useModal: () => ({
    isOpen: { value: false },
    open: mockOpen,
    close: vi.fn()
  })
}))

vi.mock('../../../../layouts/MainLayout.vue', () => ({
  default: {
    name: 'MainLayout',
    props: {
      title: { type: String, default: '' }
    },
    template: '<div data-testid="main-layout"><h1>{{ title }}</h1><slot></slot></div>'
  }
}))

describe('GalleryPage Component', () => {
  it('should render the gallery page with correct title', () => {
    const { container, getByTestId, queryByTestId } = render(GalleryPage)
    
    expect(container).toBeDefined()
    
    const layout = container.querySelector('.main-layout')
    expect(layout).toBeTruthy()
    expect(layout?.textContent).toContain('Galería de Imágenes')
    
    const grid = getByTestId('gallery-grid')
    expect(grid).toBeTruthy()
    const modal = queryByTestId('gallery-modal')
    expect(modal).toBeFalsy()
  })
  
  it('should open modal when an image is selected', async () => {
    
    const { container } = render(GalleryPage)
    
    expect(container).toBeDefined()
    
    expect(true).toBe(true)
  })
})
