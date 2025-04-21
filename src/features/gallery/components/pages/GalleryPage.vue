<script setup lang="ts">
import { ref } from 'vue'
import { useModal } from '../../composables/useModal'
import GalleryGrid from '../organisms/GalleryGrid.vue'
import GalleryModal from '../organisms/GalleryModal.vue'
import MainLayout from '../../../../layouts/MainLayout.vue'
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
  <MainLayout title="Galería de Imágenes">
    <div class="gallery-container">
      <GalleryGrid :images="images ?? []" @select="onSelect" />
      <GalleryModal
        v-if="selectedImage"
        :open="modal.isOpen.value"
        :image="selectedImage"
        :images="images ?? []"
        :onClose="closeModal"
      />
    </div>
  </MainLayout>
</template>

<style scoped>
.gallery-container {
  width: 100%;
  padding-bottom: 2rem;
}
</style>
