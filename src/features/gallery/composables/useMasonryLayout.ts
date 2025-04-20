import { ref, reactive } from 'vue'
import type { Position } from './types'
import type { ImageProps } from '../domain/entities/Image'
import { useImagePreloader } from './useImagePreloader'
import { useThrottle } from './useThrottle'

export function useMasonryLayout() {
  const loading = ref(true)
  const containerWidth = ref(0)
  const containerHeight = ref('auto')
  const positions = reactive(new Map<string, Position>())
  
  type LayoutCacheMap = Map<string, Map<string, Position>>
  const layoutCache = reactive(new Map<string, Map<string, Position>>() as LayoutCacheMap)
  
  const { preloadImages, itemsLoaded } = useImagePreloader()

  const getColumnsCount = (width: number) => {
    if (width < 600) return 1
    if (width < 900) return 2
    if (width < 1200) return 3
    return 4
  }

  const calculateLayout = async (images: ImageProps[], width: number): Promise<void> => {
    if (width === 0) return
    
    containerWidth.value = width
    
    const columnsCount = getColumnsCount(width)
    
    const cacheKey = `${width}_${columnsCount}_${images.length}`
    if (layoutCache.has(cacheKey)) {
      const cachedPositions = layoutCache.get(cacheKey)
      if (cachedPositions) {
        positions.clear()
        cachedPositions.forEach((pos, id) => {
          positions.set(id, pos)
        })
        
        let maxY = 0
        cachedPositions.forEach(pos => {
          const bottomY = pos.y + pos.height
          if (bottomY > maxY) maxY = bottomY
        })
        containerHeight.value = `${maxY}px`
        
        setTimeout(() => {
          loading.value = false
        }, 100)
        
        return
      }
    }
    
    const itemDimensions = await preloadImages(images)
    
    const columnHeights = Array(columnsCount).fill(0)
    
    const gap = 20
    const totalGapWidth = gap * (columnsCount - 1)
    const columnWidth = (width - totalGapWidth) / columnsCount
    
    positions.clear()
    const newPositions = new Map<string, Position>()
    
    for (const img of images) {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights))
      
      const dimensions = itemDimensions.get(img.id.toString())
      if (!dimensions) continue
      
      const aspectRatio = dimensions.width / dimensions.height
      const scaledHeight = columnWidth / aspectRatio
      
      const x = shortestColumn * (columnWidth + gap)
      const y = columnHeights[shortestColumn]
      
      const position = {
        x,
        y,
        width: columnWidth,
        height: scaledHeight,
      }
      
      positions.set(img.id.toString(), position)
      newPositions.set(img.id.toString(), position)
      
      columnHeights[shortestColumn] += scaledHeight + gap
    }
    
    const maxColumnHeight = Math.max(...columnHeights)
    containerHeight.value = `${maxColumnHeight}px`
    
    layoutCache.set(cacheKey, newPositions)
    
    if (layoutCache.size > 10) {
      const firstKey = layoutCache.keys().next().value
      layoutCache.delete(firstKey ?? '')
    }
    
    setTimeout(() => {
      loading.value = false
    }, 100)
  }

  const throttledCalculateLayout = useThrottle(calculateLayout, 200)

  const resetLoading = () => {
    loading.value = true
  }

  const clearCache = () => {
    layoutCache.clear()
  }

  const getPositionById = (id: string): Position | undefined => {
    return positions.get(id.toString())
  }

  return {
    loading,
    containerWidth,
    containerHeight,
    itemsLoaded,
    calculateLayout,
    throttledCalculateLayout,
    getPositionById,
    resetLoading,
    clearCache
  }
}
