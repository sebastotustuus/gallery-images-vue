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
              style="background-color: var(--color-primary); color: var(--color-text-inverted)"
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
  background-color: var(--color-bg-tertiary);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.close-button {
  color: var(--color-primary) !important;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-button:hover {
  color: var(--color-primary) !important;
}

.image-container {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.025);
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
  background-color: var(--color-bg-tertiary);
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid rgba(0, 0, 0, 0.03);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-divider);
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
  color: var(--color-text-primary);
  margin-bottom: -5px;
  letter-spacing: 0.2px;
}

.publication-info {
  font-size: 13px;
  color: var(--color-text-secondary);
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
  color: var(--color-text-primary);
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
  background-color: var(--color-bg-primary);
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
  color: var(--color-primary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-value {
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
}

.id-chip {
  background-color: var(--color-primary-light) !important;
  color: var(--color-primary) !important;
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
  color: var(--color-text-tertiary);
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
  background: var(--color-primary);
  color: var(--color-text-inverted);
  border: 1px solid var(--color-primary);
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
  color: var(--color-text-inverted) !important;
  border: 1px solid #6366f1 !important;
}

.action-button .pi {
  color: var(--color-text-inverted);
  opacity: 1;
  margin-right: 0.5em;
  font-size: 1.1em;
  transition: color 0.15s;
}

.action-button:hover .pi,
.action-button:focus .pi {
  color: var(--color-text-inverted) !important;
}

.p-button-outlined.action-button .pi {
  margin-right: 0.5em;
  color: var(--color-primary);
}

.p-button-outlined.action-button:hover .pi,
.p-button-outlined.action-button:focus .pi {
  color: var(--color-primary) !important;
}

.p-button-outlined.action-button {
  background: var(--color-bg-primary);
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  border-radius: 10px;
  transition:
    background 0.15s,
    color 0.15s,
    border 0.15s;
}

.p-button-outlined.action-button:hover,
.p-button-outlined.action-button:focus {
  background: var(--color-bg-primary) !important;
  color: var(--color-primary) !important;
  border: 1.5px solid var(--color-primary) !important;
}

.p-button-outlined.action-button .pi {
  color: var(--color-primary);
}

.additional-info {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--color-divider);
}

.info-note {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--color-primary-bg);
  padding: 12px;
  border-radius: 8px;
}

.info-note i {
  color: var(--color-primary);
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
  color: var(--color-text-secondary);
}

.detail-link {
  color: var(--color-link);
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
    background-color: var(--color-bg-dark);
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
    border-left: 1px solid var(--color-border);
  }
}
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--color-bg-light);
  color: var(--color-primary);
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
  background-color: var(--color-bg-lighter);
  color: var(--color-primary-dark);
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
