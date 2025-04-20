import { ref, watch } from 'vue'

export function useModalVisibility(open: boolean, onClose: () => void) {
  const visible = ref(open)
  watch(
    () => open,
    (val) => {
      visible.value = val
    },
    { immediate: true }
  )
  function handleHide() {
    visible.value = false
    onClose()
  }
  return { visible, handleHide }
}
