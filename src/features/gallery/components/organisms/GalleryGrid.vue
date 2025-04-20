<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import GalleryImage from '../atoms/GalleryImage.vue'
import type { ImageProps } from '../../domain/entities/Image'
import { useMasonryLayout } from '../../composables/useMasonryLayout'
import { useResizeObserver } from '../../composables/useResizeObserver'
import { useVirtualScroll } from '../../composables/useVirtualScroll'


const props = defineProps<{ images: ImageProps[] }>()
defineEmits<{ select: [image: ImageProps] }>()

const imagesRef = ref(props.images)

const { 
  loading, 
  containerHeight, 
  calculateLayout, 
  throttledCalculateLayout, 
  getPositionById, 
  resetLoading, 
  clearCache 
} = useMasonryLayout()

const { observeElement } = useResizeObserver()

const {
  scrollContainerRef: parentRef,
  isItemInViewport,
  handleScroll,
  resetVirtualizer
} = useVirtualScroll(imagesRef, getPositionById, { 
  useWindowScroll: true,
  recycleMode: 'top-only'
})

const initLayout = async () => {
  if (!parentRef.value) return
  
  await calculateLayout(props.images, parentRef.value.offsetWidth)
  
  observeElement(parentRef.value, (width) => {
    throttledCalculateLayout(props.images, width)
  })
}

onMounted(async () => {
  await nextTick()
  await initLayout()
})

watch(
  () => props.images,
  async (newImages) => {
    imagesRef.value = newImages
    
    resetLoading()
    clearCache()
    resetVirtualizer() // Importante: resetear el virtualizador cuando cambian las imágenes
    
    if (parentRef.value) {
      await calculateLayout(newImages, parentRef.value.offsetWidth)
    }
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

    <div 
      ref="parentRef" 
      class="container-main-grid" 
      :style="{ height: containerHeight, position: 'relative' }"
      @scroll="handleScroll"
    >
      <div
        :style="{
          height: containerHeight,
          width: '100%',
          position: 'relative'
        }"
      >
        <template v-for="(img, index) in props.images" :key="img.id">
          <div
            v-if="isItemInViewport(index) && getPositionById(img.id)"
            class="image-item"
            :style="{
              position: 'absolute',
              left: `${getPositionById(img.id)?.x || 0}px`,
              top: `${getPositionById(img.id)?.y || 0}px`,
              width: `${getPositionById(img.id)?.width || 0}px`,
              height: `${getPositionById(img.id)?.height || 0}px`,
              transform: loading ? 'translateY(10px)' : 'translateY(0)',
              opacity: loading ? 0 : 1,
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
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
  overflow: unset;
}

.image-item {
  will-change: transform, opacity;
}
</style>
