import { onUnmounted, ref } from 'vue'

export function useResizeObserver() {
  const elementWidth = ref(0)
  let resizeObserver: ResizeObserver | null = null
  
  const observeElement = (element: HTMLElement, callback: (width: number) => void) => {
    if (!element) return
    
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element) {
          const newWidth = entry.contentRect.width
          
          if (Math.abs(elementWidth.value - newWidth) > 10) {
            elementWidth.value = newWidth
            callback(newWidth)
          }
        }
      }
    })
    
    resizeObserver.observe(element)
  }
  
  const disconnect = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  }
  
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    elementWidth,
    observeElement,
    disconnect
  }
}
