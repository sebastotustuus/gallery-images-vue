export function useImageActions() {
  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  
  const downloadImage = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return { openUrl, downloadImage }
}
