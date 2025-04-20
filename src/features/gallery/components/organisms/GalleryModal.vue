<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import type { ImageProps } from '../../domain/entities/Image'

const props = defineProps<{ open: boolean; image: ImageProps; onClose: () => void }>()
const visible = ref(props.open)

watch(() => props.open, (val) => {
  visible.value = val
})

function handleHide() {
  visible.value = false
  props.onClose()
}
</script>

<template>
  <Dialog v-model:visible="visible" :modal="true" :closable="true" :dismissableMask="true" header="Image Details" @hide="handleHide" style="max-width: 480px; width: 100%">
    <div class="flex flex-col items-center">
      <img
        :src="props.image.download_url"
        :alt="`Image by ${props.image.author}`"
        class="w-full h-auto rounded mb-4"
        loading="lazy"
        style="max-height: 320px; object-fit: contain;"
      />
      <div class="text-gray-800 dark:text-gray-100 w-full">
        <p class="font-semibold text-lg mb-1">Author: {{ props.image.author }}</p>
        <p class="mb-2">ID: {{ props.image.id }}</p>
      </div>
      <Button label="Close" icon="pi pi-times" class="mt-2" @click="handleHide" severity="secondary" outlined />
    </div>
  </Dialog>
</template>

<style scoped>
/* Puedes agregar estilos adicionales aquí si lo deseas */
</style>
