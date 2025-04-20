import { ref } from 'vue'
import type { Dimension } from './types'
import type { ImageProps } from '../domain/entities/Image'

export function useImagePreloader() {
  const itemsLoaded = ref(0)
  const itemDimensions = new Map<string, Dimension>()

  const preloadImages = (images: ImageProps[]): Promise<Map<string, Dimension>> => {
    return new Promise<Map<string, Dimension>>((resolve) => {
      if (images.length === 0) {
        resolve(new Map())
        return
      }

      let loadedImages = 0
      itemsLoaded.value = 0

      images.forEach((img) => {
        const imgLoader = new Image()

        imgLoader.onload = () => {
          const realWidth = imgLoader.naturalWidth
          const realHeight = imgLoader.naturalHeight

          itemDimensions.set(img.id.toString(), { width: realWidth, height: realHeight })

          loadedImages++
          itemsLoaded.value = loadedImages

          if (loadedImages === images.length) {
            resolve(itemDimensions)
          }
        }

        imgLoader.onerror = () => {
          itemDimensions.set(img.id.toString(), { width: 300, height: 200 })
          
          loadedImages++
          itemsLoaded.value = loadedImages
          if (loadedImages === images.length) {
            resolve(itemDimensions)
          }
        }
        imgLoader.src = img.download_url
      })
    })
  }

  return {
    preloadImages,
    itemsLoaded
  }
}
