import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(callback: () => void, options: IntersectionObserverInit = {}) {
  const el = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (el.value) {
      observer = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback()
          observer?.disconnect()
        }
      }, options)
      observer.observe(el.value)
    }
  })
  onUnmounted(() => {
    observer?.disconnect()
  })
  return el
}
