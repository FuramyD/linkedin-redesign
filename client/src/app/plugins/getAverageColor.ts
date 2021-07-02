function draw(
    img: HTMLImageElement,
): {
    ctx: CanvasRenderingContext2D
    width: number
    height: number
} {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = img.width
    canvas.height = img.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, img.width, img.height)
    return {
        ctx,
        width: canvas.width,
        height: canvas.height,
    }
}

function getColors(canvData: {
    ctx: CanvasRenderingContext2D
    width: number
    height: number
}) {
    const { ctx, width, height } = canvData
    const colors = {}
    let col, pixels, r, g, b, a
    r = g = b = a = 0
    pixels = ctx.getImageData(0, 0, width, height)
    for (let i = 0, data = pixels.data; i < data.length; i += 4) {
        r = data[i]
        g = data[i + 1]
        b = data[i + 2]
        a = data[i + 3] // alpha
        // skip pixels >50% transparent
        if (a < 255 / 2) continue
        col = rgbToHex(r, g, b)
        if (!colors[col]) colors[col] = 0
        colors[col]++
    }
    return colors
}

function rgbToHex(r: number, g: number, b: number): string {
    if (r > 255 || g > 255 || b > 255)
        throw new Error('Invalid color component')
    return ((r << 16) | (g << 8) | b).toString(16)
}
