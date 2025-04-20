<script setup lang="ts">

const props = defineProps<{
  src: string
  alt: string
  width?: number
  height?: number
  author?: string
  id?: string
}>()
</script>

<template>
  <div
    class="inline-block break-inside-avoid mb-4 cursor-pointer overflow-hidden rounded-lg shadow hover:shadow-lg transition"
    @click="$emit('click')"
    role="button"
    :aria-label="props.alt"
  >
    <img
      :src="props.src"
      :alt="props.alt"
      class="w-full block"
      :width="props.width"
      :height="props.height"
      loading="lazy"
      draggable="false"
    />
  </div>
</template>