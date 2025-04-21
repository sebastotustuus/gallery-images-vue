import type { GalleryRepository } from '../../infrastructure/repositories/GalleryRepository'
import type { ImageProps } from '../../domain/entities/Image'

export class FetchGalleryImages {
  constructor(private repo: GalleryRepository) {}
  
  async execute(limit: number = 100): Promise<ImageProps[]> {
    const imageEntities = await this.repo.fetchImages(limit)
    return imageEntities.map(entity => entity.toJson())
  }
}
