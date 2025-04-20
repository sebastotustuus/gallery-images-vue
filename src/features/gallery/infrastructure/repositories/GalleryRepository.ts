// Infrastructure: GalleryRepository for Picsum API
import type { ImageProps } from '../../domain/entities/Image'

export interface GalleryRepository {
  fetchImages(limit: number): Promise<ImageProps[]>;
}

export class PicsumGalleryRepository implements GalleryRepository {
  async fetchImages(limit: number): Promise<ImageProps[]> {
    const res = await fetch(`https://picsum.photos/v2/list?limit=${limit}`)
    if (!res.ok) throw new Error('Failed to fetch images')
    return await res.json()
  }
}
