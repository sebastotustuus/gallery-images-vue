import { computed } from 'vue'

export function useImageDimensions(image: { width?: number; height?: number }) {
  const dimensions = computed(() => {
    if (!image) return { width: 0, height: 0 }
    const { width = 0, height = 0 } = image
    return { width, height }
  })
  const ratioInfo = computed(() => {
    return dimensions.value.height === 0 ? 0 : Math.round((dimensions.value.width / dimensions.value.height) * 10) / 10
  })
  return { dimensions, ratioInfo }
}
