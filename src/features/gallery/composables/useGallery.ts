// Composable to fetch and cache gallery images using Vue Query
import { useQuery } from '@tanstack/vue-query'
import { FetchGalleryImages } from '../application/use-cases/FetchGalleryImages'
import { PicsumGalleryRepository } from '../infrastructure/repositories/GalleryRepository'

const repo = new PicsumGalleryRepository()
const fetchGalleryImages = new FetchGalleryImages(repo)

export function useGallery(limit = 100) {
  return useQuery({
    queryKey: ['gallery-images', limit],
    queryFn: () => fetchGalleryImages.execute(limit),
    staleTime: 1000 * 60 * 5, // 5 min
    retry: 2,
  })
}
