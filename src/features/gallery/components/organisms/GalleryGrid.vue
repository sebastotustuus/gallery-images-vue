<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import GalleryImage from '../atoms/GalleryImage.vue'
import type { ImageProps } from '../../domain/entities/Image'

// Interfaces para los tipos
interface Position {
  x: number
  y: number
  width: number
  height: number
}

interface Dimension {
  width: number
  height: number
}

// Funciones de utilidad para throttling y caching
function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: number | null = null
  
  return function(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall
    
    if (timeSinceLastCall >= delay) {
      lastCall = now
      fn(...args)
    } else if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        fn(...args)
      }, delay - timeSinceLastCall)
    }
  }
}

// Propiedades del componente
const props = defineProps<{ images: ImageProps[] }>()
defineEmits<{ select: [image: ImageProps] }>()

// Variables reactivas
const loading = ref(true)
const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref('auto')
const positions = reactive(new Map<string, Position>())
const itemDimensions = reactive(new Map<string, Dimension>())
const itemsLoaded = ref(0)
const columns = ref(3)

// Sistema de cache para layouts calculados
type LayoutCacheMap = Map<string, Map<string, Position>>
const layoutCache = reactive(new Map<string, Map<string, Position>>() as LayoutCacheMap)

// Eliminado getShortestColIndex ya que no se usa

// Precalcular todas las dimensiones y posiciones// Calcular el layout de la grid
const calculateLayout = async () => {
  if (!containerRef.value || containerWidth.value === 0) return

  // Determinar el número de columnas según el ancho del contenedor
  let newColumns = 3
  if (containerWidth.value < 600) {
    newColumns = 1
  } else if (containerWidth.value < 900) {
    newColumns = 2
  } else if (containerWidth.value < 1200) {
    newColumns = 3
  } else {
    newColumns = 4
  }
  
  // Verificar cache - Clave: ancho + columnas + cantidad de imágenes
  const cacheKey = `${containerWidth.value}_${newColumns}_${props.images.length}`
  if (layoutCache.has(cacheKey)) {
    // Usar layout cacheado si existe
    const cachedPositions = layoutCache.get(cacheKey)
    if (cachedPositions) {
      positions.clear()
      cachedPositions.forEach((pos, id) => {
        positions.set(id, pos)
      })
      columns.value = newColumns
      
      // Recuperar altura del contenedor desde el cache
      let maxY = 0
      cachedPositions.forEach(pos => {
        const bottomY = pos.y + pos.height
        if (bottomY > maxY) maxY = bottomY
      })
      containerHeight.value = `${maxY}px`
      
      // Marcar como listo después de un pequeño retraso para permitir la animación
      setTimeout(() => {
        loading.value = false
      }, 200)
      
      return
    }
  }
  
  columns.value = newColumns

  // Esperar a que todas las imágenes se precarguen para calcular sus dimensiones
  await preloadAllImages()

  // Inicializar las alturas de cada columna
  const columnHeights = Array(columns.value).fill(0)

  // Calcular el ancho de cada columna
  const gap = 20 // gap entre columnas en píxeles
  const totalGapWidth = gap * (columns.value - 1)
  const columnWidth = (containerWidth.value - totalGapWidth) / columns.value

  // Calcular la posición de cada imagen
  positions.clear()
  const newPositions = new Map<string, { id: string, x: number, y: number, width: number, height: number }>()

  for (const img of props.images) {
    // Encontrar la columna más corta
    const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights))

    // Obtener las dimensiones de la imagen
    const dimensions = itemDimensions.get(img.id.toString())
    if (!dimensions) continue

    // Calcular el alto proporcional de la imagen en la grid
    const aspectRatio = dimensions.width / dimensions.height
    const scaledHeight = columnWidth / aspectRatio

    // Asignar posición a la imagen
    const x = shortestColumn * (columnWidth + gap)
    const y = columnHeights[shortestColumn]

    const position = {
      id: img.id,
      x,
      y,
      width: columnWidth,
      height: scaledHeight,
    }
    
    positions.set(img.id.toString(), position)
    newPositions.set(img.id.toString(), position)

    // Actualizar la altura de la columna
    columnHeights[shortestColumn] += scaledHeight + gap
  }

  // Calcular la altura del contenedor
  const maxColumnHeight = Math.max(...columnHeights)
  containerHeight.value = `${maxColumnHeight}px`
  
  // Guardar en cache
  layoutCache.set(cacheKey, newPositions)

  // Limitar tamaño del cache (mantener solo los 10 más recientes)
  if (layoutCache.size > 10) {
    const firstKey = layoutCache.keys().next().value
    layoutCache.delete(firstKey ?? '')
  }

  // Marcar como listo con un retraso mínimo
  setTimeout(() => {
    loading.value = false
  }, 100)
}

const preloadAllImages = () => {
  return new Promise<void>((resolve) => {
    if (props.images.length === 0) {
      resolve()
      return
    }

    let loadedImages = 0

    props.images.forEach((img) => {
      const imgLoader = new Image()

      imgLoader.onload = () => {
        const realWidth = imgLoader.naturalWidth
        const realHeight = imgLoader.naturalHeight

        // Guardar dimensiones en el mapa
        itemDimensions.set(img.id.toString(), { width: realWidth, height: realHeight })

        loadedImages++
        itemsLoaded.value = loadedImages
        if (loadedImages === props.images.length) {
          nextTick(() => {
            resolve()
          })
        }
      }

      imgLoader.onerror = () => {
        // Para imágenes con error, establecer dimensiones por defecto
        itemDimensions.set(img.id.toString(), { width: 300, height: 200 })
        
        loadedImages++
        itemsLoaded.value = loadedImages
        if (loadedImages === props.images.length) {
          nextTick(() => {
            resolve()
          })
        }
      }

      // Iniciar la carga de la imagen
      imgLoader.src = img.download_url
    })

    setTimeout(() => {
      if (loading.value) {
        loading.value = false
        resolve()
      }
    }, 5000)
  })
}

// Aplicamos throttling a la función de cálculo del layout para limitarla durante resize
const throttledCalculateLayout = throttle(async () => {
  await calculateLayout()
}, 200) // Limita a una ejecución cada 200ms para mayor responsividad

// Actualizar el ancho del contenedor cuando cambie el tamaño de la ventana
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.target === containerRef.value) {
      const newWidth = entry.contentRect.width
      // Solo recalcular si el cambio es significativo (más de 10px)
      if (Math.abs(containerWidth.value - newWidth) > 10) {
        containerWidth.value = newWidth
        throttledCalculateLayout()
      }
    }
  }
})

// Función para obtener la posición por ID
const getPositionById = (id: string): Position | undefined => {
  return positions.get(id.toString())
}

onMounted(async () => {
  await nextTick()
  await calculateLayout()
  resizeObserver.observe(containerRef.value!)
})

onUnmounted(() => {
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }
})

watch(
  () => props.images,
  async () => {
    loading.value = true
    itemsLoaded.value = 0
    // Vaciar cache cuando cambian las imágenes
    layoutCache.clear()
    await calculateLayout()
  },
  { deep: true },
)
</script>

<template>
  <div class="masonry-container">
    <div class="container-spinner">
      <div v-if="loading" class="spinner-wrapper">
        <div class="custom-spinner">
          <div class="spinner-circle"></div>
        </div>
      </div>
    </div>

    <div ref="containerRef" class="container-main-grid" :style="{ height: containerHeight }">
      <template v-for="(img, index) in props.images" :key="img.id">
        <div
          v-if="getPositionById(img.id)"
          class="image-item"
          :style="{
            position: 'absolute',
            left: `${getPositionById(img.id)?.x || 0}px`,
            top: `${getPositionById(img.id)?.y || 0}px`,
            width: `${getPositionById(img.id)?.width || 0}px`,
            height: `${getPositionById(img.id)?.height || 0}px`,
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: loading ? 0 : 1,
            transform: loading ? 'translateY(10px)' : 'translateY(0)',
            transitionDelay: `${index * 30}ms`,
          }"
        >
          <GalleryImage
            :src="img.download_url"
            :alt="`Image by ${img.author}`"
            :id="img.id"
            @click="$emit('select', img)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.masonry-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.container-spinner {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 30px;
  padding-bottom: 30px;
}

.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  width: 100%;
}

.custom-spinner {
  padding: 15px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.container-main-grid {
  position: relative;
  width: 100%;
  flex-grow: 1;
}

.image-item {
  will-change: transform, opacity;
}
</style>
