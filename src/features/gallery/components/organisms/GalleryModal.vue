<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import type { ImageProps } from '../../domain/entities/Image'
import { useImageActions } from '../../composables/useImageActions'
import { useModalVisibility } from '../../composables/useModalVisibility'
import { useImageNavigation } from '../../composables/useImageNavigation'
import { useImageDetails } from '../../composables/useImageDetails'

const props = defineProps<{ 
  open: boolean; 
  image: ImageProps; 
  images: ImageProps[];
  onClose: () => void 
}>()

const { visible, handleHide } = useModalVisibility(props.open, props.onClose)
const { openUrl, downloadImage } = useImageActions()

const {
  currentImage,
  hasPrevious,
  hasNext,
  goToPrevious,
  goToNext
} = useImageNavigation(props.image, props.images)

const { authorInitials, dimensions, ratioInfo } = useImageDetails(currentImage)
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :closable="false"
    :dismissableMask="true"
    :showHeader="false"
    @hide="handleHide"
    class="image-detail-modal"
  >
    <div class="modal-content">
      <button 
        v-if="hasPrevious" 
        @click="goToPrevious" 
        class="nav-button nav-prev" 
        aria-label="Imagen anterior"
      >
        <i class="pi pi-chevron-left"></i>
      </button>

      <div class="image-container">
        <transition name="fade" mode="out-in">
          <img
            :key="currentImage.id"
            :src="currentImage.download_url"
            :alt="`Image by ${currentImage.author}`"
            loading="lazy"
          />
        </transition>
      </div>
      
      <button 
        v-if="hasNext" 
        @click="goToNext" 
        class="nav-button nav-next" 
        aria-label="Imagen siguiente"
      >
        <i class="pi pi-chevron-right"></i>
      </button>

      <div class="info-container">
        <div class="modal-header">
          <div class="author-section">
            <Avatar
              :label="authorInitials"
              shape="circle"
              size="large"
              class="author-avatar"
              style="background-color: #6366f1; color: white"
            />
            <div class="author-info">
              <div class="author-name">{{ currentImage.author }}</div>
              <div class="publication-info">Publicado en Unsplash</div>
            </div>
          </div>
          <Button
            icon="pi pi-times"
            class="close-button"
            @click="handleHide"
            aria-label="Close"
            text
            rounded
          />
        </div>

        <div class="specs-section">
          <h4 class="section-title">Información técnica</h4>
          <div class="spec-row">
            <div class="spec-item">
              <p class="spec-label">Dimensiones:</p>
              <div class="spec-value">
                <div class="dimension-main">{{ dimensions.width }} × {{ dimensions.height }}px</div>
                <div class="dimension-ratio">Ratio: {{ ratioInfo }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <h4 class="section-title">Acciones</h4>
          <div class="action-buttons">
            <Button
              label="Ver Original"
              icon="pi pi-external-link"
              class="p-button p-button-info p-button-outlined action-button"
              @click="openUrl(currentImage.url)"
            />

            <Button
              label="Descargar"
              icon="pi pi-download"
              class="p-button p-button-success action-button"
              @click="downloadImage(currentImage.download_url)"
            />
          </div>
        </div>

        <div class="additional-info">
          <p class="info-note">
            <i class="pi pi-info-circle"></i>
            Imagen de alta resolución disponible para uso personal y comercial.
          </p>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.image-detail-modal :deep(.p-dialog-content) {
  padding: 0;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal-content {
  position: relative;
  max-width: 85vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
}

.close-button {
  color: #6366f1 !important;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-button:hover {
  color: #6366f1 !important;
}

.image-container {
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: start;
  align-items: center;
  min-height: 300px;
  max-height: 70vh;
  overflow: hidden;
}

.image-container img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  display: block;
}

.info-container {
  padding: 24px;
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.author-section {
  display: flex;
  align-items: center;
}

.author-avatar {
  margin-right: 12px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: -5px;
  letter-spacing: 0.2px;
}

.publication-info {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.close-button {
  margin-left: 12px;
}

.specs-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  position: relative;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  background-color: #6366f1;
  border-radius: 50%;
  margin-right: 8px;
  transform: scale(0.6);
}

.specs-list {
  background-color: #f8f9fc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.spec-row {
  margin-bottom: 16px;
  padding-left: 2rem;
}

.spec-row:last-child {
  margin-bottom: 0;
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-value {
  color: #333;
  display: flex;
  flex-direction: column;
}

.id-chip {
  background-color: #ebeeff !important;
  color: #6366f1 !important;
  font-weight: 500;
  border-radius: 4px;
  padding: 2px 8px;
  align-self: flex-start;
}

.dimension-main {
  font-weight: 500;
  font-size: 14px;
}

.dimension-ratio {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.actions-section {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.action-button {
  flex: 1;
  justify-content: center;
  height: 38px;
  font-weight: 500;
  background: #6366f1;
  color: #fff;
  border: 1px solid #6366f1;
  z-index: 1;
  border-radius: 10px;
  display: flex;
  flex-flow: row;
  gap: 0.3rem;
  transition:
    background 0.15s,
    color 0.15s,
    border 0.15s;
}

.action-button:hover,
.action-button:focus {
  background: #6366f1 !important;
  color: #fff !important;
  border: 1px solid #6366f1 !important;
}

.action-button .pi {
  color: #fff;
  opacity: 1;
  margin-right: 0.5em;
  font-size: 1.1em;
  transition: color 0.15s;
}

.action-button:hover .pi,
.action-button:focus .pi {
  color: #fff !important;
}

.p-button-outlined.action-button .pi {
  margin-right: 0.5em;
  color: #6366f1;
}

.p-button-outlined.action-button:hover .pi,
.p-button-outlined.action-button:focus .pi {
  color: #6366f1 !important;
}

.p-button-outlined.action-button {
  background: #fff;
  color: #6366f1;
  border: 1.5px solid #6366f1;
  border-radius: 10px;
  transition:
    background 0.15s,
    color 0.15s,
    border 0.15s;
}

.p-button-outlined.action-button:hover,
.p-button-outlined.action-button:focus {
  background: #fff !important;
  color: #6366f1 !important;
  border: 1.5px solid #6366f1 !important;
}

.p-button-outlined.action-button .pi {
  color: #6366f1;
}

.additional-info {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.info-note {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(99, 102, 241, 0.05);
  padding: 12px;
  border-radius: 8px;
}

.info-note i {
  color: #6366f1;
  font-size: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  font-weight: 600;
  margin-right: 8px;
  min-width: 100px;
}

.detail-value {
  color: #555;
}

.detail-link {
  color: #0095f6;
  text-decoration: none;
}

.detail-link:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .modal-content {
    flex-direction: row;
    max-width: 85vw;
    max-height: 80vh;
  }

  .image-container {
    flex: 3;
    max-height: 80vh;
    width: calc(100% - 350px);
    position: relative;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-container img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }

  .info-container {
    flex: none;
    width: 350px;
    min-width: 350px;
    overflow-y: auto;
    max-height: 80vh;
    position: relative;
    z-index: 1;
    border-left: 1px solid #eaeaea;
  }
}
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  color: #6366f1;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.nav-button:hover,
.nav-button:focus {
  background-color: rgba(255, 255, 255, 0.9);
  color: #4f46e5;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.nav-prev {
  left: 16px;
}

.nav-next {
  right: 16px;
}

.nav-button i {
  font-size: 1.2rem;
}

@media (min-width: 768px) {
  .nav-button {
    width: 48px;
    height: 48px;
  }
  
  .nav-prev {
    left: 16px;
  }
  
  .nav-next {
    left: calc(100% - 350px - 64px);
  }
  
  .nav-button i {
    font-size: 1.4rem;
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
