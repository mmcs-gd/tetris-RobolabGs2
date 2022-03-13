const WIDTH = 2
const HEIGHT = 2
const SIZE = 22

export default class Piece {
  constructor(
    public row: number,
    public column: number,
    public color: string,
    public mask = [
      [1, 0],
      [1, 1]
    ]) {
  }

  shift(di: number, dj: number) {
    this.row += di
    this.column += dj
  }

  get left() {
    return this.row
  }

  get right() {
    return this.row + this.mask.length - 1
  }

  get top() {
    return this.column
  }

  get bottom() {
    return this.column + this.mask.length - 1
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color

    for (let i = 0; i < this.mask[0].length; i++) {
      for (let j = 0; j < this.mask.length; j++) {
        if(!this.mask[j][i])
          continue
        const [x, y] = toCoords(this.row + i, this.column + j)
        drawRoundRect(ctx, x, y, 20, 20, 5, true, false)
      }
    }
  }
}

export function drawSquare(ctx: CanvasRenderingContext2D, i: number, j: number) {
  const [x, y] = toCoords(i, j)
  drawRoundRect(ctx, x, y)
}

function toCoords(i: number, j: number) {
  return [i * SIZE + 1, j * SIZE + 1]
}

type Corners = "tl" | "tr" | "br" | "bl"

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  width: number = 20, height: number = 20,
  radius: number | Record<Corners, number> = 5,
  fill: boolean = true, stroke = true) {
  if (typeof stroke === 'undefined') {
    stroke = true
  }
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 } as Record<Corners, number>
    for (let side in defaultRadius) {
      radius[side as Corners] = radius[side as Corners] || defaultRadius[side as Corners]
    }
  }
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
}