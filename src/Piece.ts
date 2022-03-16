const WIDTH = 2
const HEIGHT = 2
const SIZE = 22

export class Mask {
  public readonly size = this.mask.length;
  constructor(private mask: number[][]) {
    if (mask.some(line => line.length != this.size))
      throw new Error(`Invalid mask: dimensions mismatch. \n${mask.map(l => l.join(", ")).join("\n")}`)
  }
  get(row: number, column: number, rotation: number = 0) {
    switch (rotation) {
      case 0:
        return this.mask[row][column]
      case 1:
        return this.mask[column][this.size - row - 1]
      case 2:
        return this.mask[this.size - row - 1][this.size - column - 1]
      case 3:
        return this.mask[this.size - column - 1][row]
      default:
        throw new Error(`Unexpected rotation ${rotation}`)
    }
  }
}

export default class Piece {
  public readonly size: number;
  constructor(
    public row: number,
    public column: number,
    public color: string,
    private mask: Mask) {
      this.size = this.mask.size;
  }

  private rotation = 0

  shift(di: number, dj: number) {
    this.row += di
    this.column += dj
  }
  rotate(delta = 1) {
    this.rotation = (this.rotation+4+delta)%4;
  }


  forEach(action: (i: number, j: number) => void): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.mask.get(j, i, this.rotation))
          continue
        action(this.column + i, this.row + j)
      }
    }
  }

  any(condition: (i: number, j: number) => boolean): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.mask.get(j, i, this.rotation) && condition(this.column + i, this.row + j))
          return true
      }
    }
    return false
  }

  draw(ctx: CanvasRenderingContext2D, fill = true, stroke = false) {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    this.forEach((i, j) => {
      drawRoundRect(ctx, ...toCoords(i, j), 20, 20, 5, fill, stroke)
    })
    // ctx.strokeStyle = "red"
    // ctx.strokeRect(...toCoords(this.column, this.row), SIZE * this.mask.size, SIZE * this.mask.size)
  }
}

export function drawSquare(ctx: CanvasRenderingContext2D, i: number, j: number) {
  const [x, y] = toCoords(i, j)
  drawRoundRect(ctx, x, y)
}

export function toCoords(i: number, j: number) {
  return [i * SIZE + 1, j * SIZE + 1] as const
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