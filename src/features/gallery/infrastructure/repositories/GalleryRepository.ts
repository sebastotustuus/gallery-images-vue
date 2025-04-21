import { Image, type ImageProps } from '../../domain/entities/Image'

export interface GalleryRepository {
  fetchImages(limit: number): Promise<Image[]>;
}

export class PicsumGalleryRepository implements GalleryRepository {
  async fetchImages(limit: number): Promise<Image[]> {
    try {
      const res = await fetch(`https://picsum.photos/v2/list?limit=${limit}`)
      if (!res.ok) return []
      const imagesData = await res.json() as ImageProps[]
      return imagesData.map(imageData => new Image(imageData))
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      return []
    }
  }
}
