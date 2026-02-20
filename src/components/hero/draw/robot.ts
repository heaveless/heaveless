export function drawRobot(
  ctx: CanvasRenderingContext2D,
  processedImage: HTMLCanvasElement,
  cx: number,
  cy: number,
  robotSize: number,
  floatY: number,
): void {
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    processedImage,
    cx - robotSize / 2,
    cy - robotSize / 2 + floatY,
    robotSize,
    robotSize,
  )
}
