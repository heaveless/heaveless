/**
 * Loads a PNG and premultiplies alpha to eliminate white-fringe artifacts
 * that appear on semi-transparent edges when compositing over dark backgrounds.
 */
export function loadRobotImage(
  src: string,
  onLoad: (processed: HTMLCanvasElement) => void,
): void {
  const img = new Image()

  img.onload = () => {
    const canvas    = document.createElement('canvas')
    canvas.width    = img.naturalWidth
    canvas.height   = img.naturalHeight
    const ctx       = canvas.getContext('2d')!

    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const { data }  = imageData

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]
      if (alpha === 0) {
        data[i] = data[i + 1] = data[i + 2] = 0
      } else if (alpha < 255) {
        const factor  = alpha / 255
        data[i]     = data[i]     * factor | 0
        data[i + 1] = data[i + 1] * factor | 0
        data[i + 2] = data[i + 2] * factor | 0
      }
    }

    ctx.putImageData(imageData, 0, 0)
    onLoad(canvas)
  }

  img.src = src
}
