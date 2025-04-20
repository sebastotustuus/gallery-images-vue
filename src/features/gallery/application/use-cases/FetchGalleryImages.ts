// Application: Use-case to fetch images
import type { GalleryRepository } from '../../infrastructure/repositories/GalleryRepository'
import type { ImageProps } from '../../domain/entities/Image'

export class FetchGalleryImages {
  constructor(private repo: GalleryRepository) {}
  async execute(limit: number = 100): Promise<ImageProps[]> {
    return this.repo.fetchImages(limit)
  }
}
