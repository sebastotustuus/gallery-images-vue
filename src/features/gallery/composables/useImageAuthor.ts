import { computed } from 'vue'

export function useImageAuthor(image: { author?: string }) {
  const authorInitials = computed(() => {
    if (!image?.author) return ''
    const nameParts = image.author.split(' ')
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase()
    } else {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
    }
  })
  return { authorInitials }
}
