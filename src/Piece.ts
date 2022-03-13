const WIDTH = 2
const HEIGHT = 2
const SIZE = 22

export default class Piece {
  constructor(
    public row: number,
    public column: number,
    public color: string) {
  }

  shift(di: number, dj: number) {
    this.row += di
    this.column += dj
  }

  get left() {
    return this.row
  }

  get right() {
    return this.row + WIDTH - 1
  }

  get top() {
    return this.column
  }

  get bottom() {
    return this.column + HEIGHT - 1
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color

    for (let i = 0; i < WIDTH; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        const [x, y] = toCoords(this.row + i, this.column + j)
        drawRoundRect(ctx, x, y, 20, 20, 5, true, false)
      }
    }
  }
}

function toCoords(i: number, j: number) {
  return [i * SIZE + 1, j * SIZE + 1]
}

type Corners = "tl" | "tr" | "br" | "bl"

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  width: number, height: number,
  radius: number | Record<Corners, number> = 5,
  fill: boolean, stroke = true) {
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