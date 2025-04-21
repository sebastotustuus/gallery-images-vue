import { ref, computed, watch, type Ref } from 'vue'
import type { ImageProps } from '../domain/entities/Image'


export function useImageNavigation(
  initialImage: ImageProps,
  images: ImageProps[] | Ref<ImageProps[]>
) {
  const getImages = () => Array.isArray(images) ? images : images.value
  const currentIndex = ref(0)
  const currentImage = ref<ImageProps>(initialImage)

  const hasPrevious = computed(() => currentIndex.value > 0)
  const hasNext = computed(() => currentIndex.value < getImages().length - 1)

  watch(() => initialImage, (newImage) => {
    const index = getImages().findIndex(img => img.id === newImage.id)
    if (index !== -1) {
      currentIndex.value = index
      currentImage.value = getImages()[index]
    }
  }, { immediate: true })

  function goToPrevious() {
    if (hasPrevious.value) {
      currentIndex.value--
      currentImage.value = getImages()[currentIndex.value]
    }
  }

  function goToNext() {
    if (hasNext.value) {
      currentIndex.value++
      currentImage.value = getImages()[currentIndex.value]
    }
  }

  return {
    currentIndex,
    currentImage,
    hasPrevious,
    hasNext,
    goToPrevious,
    goToNext
  }
}
