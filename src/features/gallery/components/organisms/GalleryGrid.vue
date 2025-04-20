<script setup lang="ts">
import GalleryImage from '../atoms/GalleryImage.vue'
import type { ImageProps } from '../../domain/entities/Image'

defineProps<{ images: ImageProps[] }>()
</script>

<template>
  <div
  class="
    columns-1 sm:columns-2 lg:columns-3
    column-gap-4 gap-y-4
  ">
  <GalleryImage
    v-for="img in images"
    :key="img.id"
    :src="img.download_url"
    :alt="`Image by ${img.author}`"
    @click="$emit('select', img)"
    :author="img.author"
    :id="img.id"
  />
</div>
</template>
