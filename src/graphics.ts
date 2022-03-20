import GameField from "./GameField"
import Piece, { Mask } from "./Piece"

const SIZE = 22
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

export function drawPiece(p: Piece, ctx: CanvasRenderingContext2D, fill = true, stroke = false) {
    ctx.fillStyle = p.color
    ctx.strokeStyle = p.color
    ctx.save()
    ctx.translate(...toCoords(p.column, p.row))
    drawMask(p.mask, ctx, fill, stroke, p.rotation)
    ctx.restore()
}

export function drawMask(mask: Mask, ctx: CanvasRenderingContext2D, fill = true, stroke = false, rotation?: number) {
    mask.forEach((i, j) => {
        drawRoundRect(ctx, ...toCoords(i, j), 20, 20, 5, fill, stroke)
    }, rotation)
}

export function drawField(f: GameField, ctx: CanvasRenderingContext2D) {
    f.forEach((cell, i, j) => {
        ctx.strokeStyle = "#444"
        const [x, y] = toCoords(i, j)
        ctx.strokeRect(x - 1, y - 1, 22, 22)
        if (ctx.fillStyle = cell || "") {
            drawSquare(ctx, i, j)
        }
    })
}