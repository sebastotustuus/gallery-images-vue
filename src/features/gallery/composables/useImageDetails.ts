import { computed, type Ref } from 'vue'
import type { ImageProps } from '../domain/entities/Image'
import { useImageAuthor } from './useImageAuthor'
import { useImageDimensions } from './useImageDimensions'

export function useImageDetails(image: Ref<ImageProps>) {
  const authorInitials = computed(() => {
    return useImageAuthor(image.value).authorInitials.value
  })

  const dimensions = computed(() => {
    return useImageDimensions(image.value).dimensions.value
  })

  const ratioInfo = computed(() => {
    return useImageDimensions(image.value).ratioInfo.value
  })

  return {
    authorInitials,
    dimensions,
    ratioInfo
  }
}
