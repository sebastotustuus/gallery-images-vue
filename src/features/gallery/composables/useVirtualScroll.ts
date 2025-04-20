import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { Position } from './types'

export function useVirtualScroll<T extends { id: string }>(
  items: Ref<T[]>,
  getPositionById: (id: string) => Position | undefined,
  options: { 
    useWindowScroll?: boolean,
    recycleMode?: 'symmetric' | 'top-only' | 'none'
  } = {}
) {
  const scrollPosition = ref(0)
  const viewportHeight = ref(0)
  
  const scrollContainerRef = ref<HTMLElement | null>(null)
  const useWindowScroll = options.useWindowScroll || false
  const recycleMode = options.recycleMode || 'symmetric'

  // Para el modo de reciclaje asimétrico, necesitamos rastrear los elementos ya renderizados
  const renderedItems = ref(new Set<number>())
  const lastScrollPosition = ref(0)
  
  const handleScroll = () => {
    let newScrollPosition = 0;
    
    if (useWindowScroll) {
      newScrollPosition = window.scrollY
      scrollPosition.value = newScrollPosition
      viewportHeight.value = window.innerHeight
    } else if (scrollContainerRef.value) {
      newScrollPosition = scrollContainerRef.value.scrollTop
      scrollPosition.value = newScrollPosition
      viewportHeight.value = scrollContainerRef.value.clientHeight
    }
    
    // Determinar la dirección del scroll para el reciclaje asimétrico
    if (recycleMode === 'top-only') {
      const isScrollingDown = newScrollPosition > lastScrollPosition.value
      
      // Si estamos haciendo scroll hacia abajo, rastreamos la posición actual
      lastScrollPosition.value = newScrollPosition
      
      // En scrolling hacia abajo, simplemente dejamos que el algoritmo regular maneje la visibilidad
      // En scrolling hacia arriba, no eliminamos los elementos ya renderizados
      if (isScrollingDown) {
        // Resetear el conjunto de elementos renderizados cuando el usuario llega al tope superior
        if (newScrollPosition <= 10) {
          renderedItems.value.clear()
        }
      }
    }
  }
  
  const setupScrollListeners = () => {
    if (useWindowScroll) {
      viewportHeight.value = window.innerHeight
      window.addEventListener('scroll', handleScroll)
    } else if (scrollContainerRef.value) {
      viewportHeight.value = scrollContainerRef.value.clientHeight
      scrollContainerRef.value.addEventListener('scroll', handleScroll)
    }
    
    // Llamada inicial para configurar valores
    handleScroll()
  }
  
  const cleanupScrollListeners = () => {
    if (useWindowScroll) {
      window.removeEventListener('scroll', handleScroll)
    } else if (scrollContainerRef.value) {
      scrollContainerRef.value.removeEventListener('scroll', handleScroll)
    }
  }
  
  const isItemInViewport = (index: number): boolean => {
    const item = items.value[index]
    if (!item) return false
    
    const position = getPositionById(item.id.toString())
    if (!position) return false
    
    // Manejar modos de reciclaje especiales
    if (recycleMode === 'none') {
      return true // No reciclar - mostrar todos los elementos siempre
    }
    
    if (recycleMode === 'top-only') {
      // Si ya se renderizó este elemento, siempre mostrarlo
      if (renderedItems.value.has(index)) {
        return true
      }
    }
    
    const overscan = 800
    let itemTop = position.y
    let itemBottom = position.y + position.height
    
    // Si usamos scroll de ventana, necesitamos considerar la posición del contenedor
    if (useWindowScroll && scrollContainerRef.value) {
      const containerRect = scrollContainerRef.value.getBoundingClientRect()
      itemTop += containerRect.top + window.scrollY
      itemBottom += containerRect.top + window.scrollY
    }
    
    const isVisible = (
      (itemBottom >= scrollPosition.value - overscan) && 
      (itemTop <= scrollPosition.value + viewportHeight.value + overscan)
    )
    
    // Si el elemento es visible y estamos en modo de reciclaje top-only, añadirlo al conjunto
    if (isVisible && recycleMode === 'top-only') {
      renderedItems.value.add(index)
    }
    
    return isVisible
  }
  
  onMounted(setupScrollListeners)
  onUnmounted(cleanupScrollListeners)
  
  // Método para resetear el estado del virtualizador (útil cuando cambian las imágenes)
  const resetVirtualizer = () => {
    renderedItems.value.clear()
    lastScrollPosition.value = 0
  }

  return {
    scrollContainerRef,
    scrollPosition,
    viewportHeight,
    isItemInViewport,
    handleScroll,
    resetVirtualizer
  }
}
