<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  width?: number
  height?: number
  author?: string
  id?: string
  aspectRatio?: number
}>()

// Estado de carga de la imagen
const isLoaded = ref(false)
const hasError = ref(false)

// Calcular aspect ratio para el skeleton
const skeletonStyle = computed(() => {
  return {
    paddingBottom: '100%', // 4:3 aspect ratio
    width: '100%',
    backgroundColor: '#e5e7eb',
    height: '100%'
  }
})

// Manejar eventos de carga y error
function handleImageLoad() {
  // Añadir un delay artificial para que la imagen aparezca gradualmente
  setTimeout(() => {
    isLoaded.value = true
  }, 300 + Math.random() * 700) // Delay aleatorio entre 300ms y 1000ms
}

function handleImageError() {
  hasError.value = true
  isLoaded.value = true // Para quitar el skeleton
}
</script>

<template>
  <div
    class="image-card break-inside-avoid mb-4 cursor-pointer overflow-hidden rounded-lg shadow hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px]"
    @click="$emit('click')"
    role="button"
    :aria-label="props.alt"
  >
    <div class="image-container relative">
      <!-- Skeleton mientras la imagen carga -->
      <div 
        v-if="!isLoaded && !hasError" 
        class="skeleton-loader animate-pulse"
        :style="skeletonStyle"
      ></div>
      
      <!-- Mensaje de error si falla la carga -->
      <div 
        v-if="hasError" 
        class="error-state flex items-center justify-center text-gray-500"
        :style="skeletonStyle"
      >
        <span>No se pudo cargar la imagen</span>
      </div>
      
      <!-- Imagen con transición suave -->
      <img
        :src="props.src"
        :alt="props.alt"
        class="w-full h-auto block transition-all duration-1000 ease-out"
        :class="{ 
          'opacity-0 scale-[1.02] blur-sm': !isLoaded, 
          'opacity-100 scale-100 blur-0': isLoaded 
        }"
        :width="props.width"
        :height="props.height"
        loading="lazy"
        draggable="false"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </div>
  </div>
</template>

<style scoped>
.image-card {
  will-change: transform, opacity;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.image-container {
  position: relative;
  overflow: hidden;
}

.skeleton-loader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.error-state {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* Animación para las reorganizaciones */
.image-card {
  transition: transform 0.8s cubic-bezier(0.2, 0, 0.2, 1);
}

/* Asegurar que las animaciones sean suaves */
img {
  will-change: opacity, transform, filter;
}
</style>