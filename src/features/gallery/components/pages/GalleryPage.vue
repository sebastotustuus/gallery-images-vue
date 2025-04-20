<script setup lang="ts">
import { ref } from 'vue'
import { useModal } from '../../composables/useModal'
import GalleryGrid from '../organisms/GalleryGrid.vue'
import GalleryModal from '../organisms/GalleryModal.vue'
import type { ImageProps } from '../../domain/entities/Image'
import { useGallery } from '../../composables/useGallery'

const { data: images } = useGallery(100)
const modal = useModal()
const selectedImage = ref<ImageProps | null>(null)

function onSelect(img: ImageProps) {
  selectedImage.value = img
  modal.open()
}
function closeModal() {
  modal.close()
  selectedImage.value = null
}

</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <h1 v-once class="text-3xl font-bold mb-6">Image Gallery Collection</h1>
    <GalleryGrid :images="images ?? []" @select="onSelect" />
    <!-- Siempre renderizar el modal pero controlar su visibilidad con la prop -->    
    <GalleryModal
      v-if="selectedImage"
      :open="modal.isOpen.value"
      :image="selectedImage"
      :onClose="closeModal"
    />
  </div>
</template>
