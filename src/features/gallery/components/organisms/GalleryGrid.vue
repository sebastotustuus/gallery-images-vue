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
    resetVirtualizer()
    
    if (parentRef.value) {
      await calculateLayout(newImages, parentRef.value.offsetWidth)
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="w-full flex flex-col min-h-[200px]">
    <div v-if="loading" class="w-full flex justify-center py-[30px]">
      <div class="flex justify-center items-center z-10 w-full">
        <div class="p-[15px] rounded-full flex justify-center items-center">
          <div class="spinner-circle"></div>
        </div>
      </div>
    </div>

    <div 
      ref="parentRef" 
      class="relative w-full grow overflow-visible" 
      :style="{ height: containerHeight, position: 'relative' }"
      @scroll="handleScroll"
    >
      <div
        class="w-full relative"
        :style="{
          height: containerHeight,
          position: 'relative'
        }"
      >
        <template v-for="(img, index) in props.images" :key="img.id">
          <div
            v-if="isItemInViewport(index) && getPositionById(img.id)"
            class="[will-change:transform,opacity] absolute"
            :class="{ 'opacity-0 translate-y-[10px]': loading, 'opacity-100 translate-y-0': !loading }"
            :style="{
              left: `${getPositionById(img.id)?.x || 0}px`,
              top: `${getPositionById(img.id)?.y || 0}px`,
              width: `${getPositionById(img.id)?.width || 0}px`,
              height: `${getPositionById(img.id)?.height || 0}px`,
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
</style>
