import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import type { Position } from './types'

const DEFAULT_OVERSCAN = 800

type RecycleMode = 'symmetric' | 'top-only' | 'none'

export function useVirtualScroll<T extends { id: string }>(
  items: Ref<T[]>,
  getPositionById: (id: string) => Position | undefined,
  options: {
    useWindowScroll?: boolean,
    recycleMode?: RecycleMode,
    overscan?: number
  } = {}
) {
  const {
    useWindowScroll = false,
    recycleMode = 'symmetric',
    overscan = DEFAULT_OVERSCAN,
  } = options

  const scrollPosition = ref(0)
  const viewportHeight = ref(0)
  const scrollContainerRef = ref<HTMLElement | null>(null)
  const renderedIndexes = ref(new Set<number>())
  const lastScrollPosition = ref(0)

  function handleScroll(): void {
    let newScroll = 0

    if (useWindowScroll) {
      newScroll = window.scrollY
      viewportHeight.value = window.innerHeight
    } else if (scrollContainerRef.value) {
      newScroll = scrollContainerRef.value.scrollTop
      viewportHeight.value = scrollContainerRef.value.clientHeight
    }
    scrollPosition.value = newScroll

    if (recycleMode === 'top-only') {
      const isScrollingDown = newScroll > lastScrollPosition.value
      lastScrollPosition.value = newScroll
      if (isScrollingDown && newScroll <= 10) {
        renderedIndexes.value.clear()
      }
    }
  }

  function setupScrollListeners(): void {
    if (useWindowScroll) {
      viewportHeight.value = window.innerHeight
      window.addEventListener('scroll', handleScroll)
    } else if (scrollContainerRef.value) {
      viewportHeight.value = scrollContainerRef.value.clientHeight
      scrollContainerRef.value.addEventListener('scroll', handleScroll)
    }
    handleScroll()
  }

  function cleanupScrollListeners(): void {
    if (useWindowScroll) {
      window.removeEventListener('scroll', handleScroll)
    } else if (scrollContainerRef.value) {
      scrollContainerRef.value.removeEventListener('scroll', handleScroll)
    }
  }

  function isItemInViewport(index: number): boolean {
    const item = items.value[index]
    if (!item) return false

    const position = getPositionById(item.id)
    if (!position) return false

    if (recycleMode === 'none') return true

    if (recycleMode === 'top-only' && renderedIndexes.value.has(index)) {
      return true
    }

    let { y: itemTop, height } = position
    let itemBottom = itemTop + height

    if (useWindowScroll && scrollContainerRef.value) {
      const containerRect = scrollContainerRef.value.getBoundingClientRect()
      const offset = containerRect.top + window.scrollY
      itemTop += offset
      itemBottom += offset
    }

    const visible =
      itemBottom >= scrollPosition.value - overscan &&
      itemTop <= scrollPosition.value + viewportHeight.value + overscan

    if (visible && recycleMode === 'top-only') {
      renderedIndexes.value.add(index)
    }

    return visible
  }

  function resetVirtualizer(): void {
    renderedIndexes.value.clear()
    lastScrollPosition.value = 0
  }

  onMounted(setupScrollListeners)
  onUnmounted(cleanupScrollListeners)

  return {
    scrollContainerRef,
    scrollPosition,
    viewportHeight,
    isItemInViewport,
    handleScroll,
    resetVirtualizer,
  }
}
