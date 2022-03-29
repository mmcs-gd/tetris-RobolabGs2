import GameField from "./GameField"
import Piece, { Mask } from "./Piece"

const SIZE = 22
export function drawSquare(ctx: CanvasRenderingContext2D, i: number, j: number) {
    const [x, y] = toCoords(i, j)
    drawRoundRect(ctx, x, y)
}

export function toCoords(i: number, j: number, size = SIZE) {
    return [i * size + 1, j * size + 1] as const
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

export function drawMask(mask: Mask, ctx: CanvasRenderingContext2D, fill = true, stroke = false, rotation?: number, size = SIZE) {
    mask.forEach((i, j) => {
        drawRoundRect(ctx, ...toCoords(i, j, size), size - 2, size - 2, size / 4, fill, stroke)
    }, rotation)
}


export function drawFieldLightpiece(f: GameField, ctx: CanvasRenderingContext2D, piece: Piece, level: number) {
    const light = new LightMap(f.colums, f.rows)
    lightPiece(light, piece, level / 30)
    drawWithLight(light, f, ctx)
}

function lightPiece(lightmap: LightMap, piece: Piece, alpha: number = 1) {
    piece.forEach((column, row) => {
        for (let i = 0; i < lightmap.colums; i++)
            for (let j = 0; j < lightmap.rows; j++) {
                const distance = Math.abs(i - column)**2 + Math.abs(j - row)**2
                lightmap.add(i, j, 1 / (1 + alpha * distance))
            }
    })
}

function lightFilled(lightmap: LightMap, filled: number[]) {
    filled.forEach((row) => {
        for (let i = 0; i < lightmap.colums; i++)
            for (let j = 0; j < lightmap.rows; j++) {
                const distance = Math.abs(j - row)
                lightmap.add(i, j, 1 / (1 + distance))
            }
    })
}

function drawWithLight(light: ReadonlyLightMap, f: GameField, ctx: CanvasRenderingContext2D) {
    f.forEach((cell, column, row) => {
        ctx.globalAlpha = light.get(column, row)
        // const color = 255 * light.get(column, row) // 0x44
        const color = 0x44
        ctx.strokeStyle = `rgba(${color}, ${color}, ${color})`
        const [x, y] = toCoords(column, row)
        ctx.strokeRect(x - 1, y - 1, SIZE, SIZE)
        if (ctx.fillStyle = cell || "") {
            drawSquare(ctx, column, row)
        }
    })
    ctx.globalAlpha = 1
}
interface ReadonlyLightMap {
    get(column: number, row: number): number;
}
class LightMap implements ReadonlyLightMap {
    map = new Array<number>(this.colums * this.rows).fill(0)
    private index(i: number, j: number): number {
        return i * this.rows + j
    }
    constructor(public readonly colums: number, public readonly rows: number) {
    }
    add(column: number, row: number, value: number) {
        const i = this.index(column, row)
        this.map[i] = Math.min(1, this.map[i] + value)
    }
    sub(column: number, row: number, value: number) {
        const i = this.index(column, row)
        this.map[i] = Math.max(0, this.map[i] - value)
    }
    get(column: number, row: number) {
        return this.map[this.index(column, row)]
    }
}

class CombineLightMap implements ReadonlyLightMap {
    constructor(
        private readonly map1: ReadonlyLightMap,
        private readonly map2: ReadonlyLightMap,
        private readonly merge: (l1: number, l2: number) => number,
    ) {
    }
    get(column: number, row: number): number {
        return this.merge(this.map1.get(column, row), this.map2.get(column, row))
    }
}

function lightDownUp(lightmap: LightMap, f: GameField, opacity: number) {
    const light = new Array(f.colums).fill(1)
    f.forEachDownUp((cell, column, row) => {
        lightmap.add(column, row, light[column])
        if (cell)
            light[column] *= opacity;
    })
}

function lightUpDown(lightmap: LightMap, f: GameField, opacity: number) {
    const light = new Array(f.colums).fill(1)
    f.forEach((cell, column, row) => {
        lightmap.add(column, row, light[column])
        if (cell)
            light[column] *= opacity;
    })
}

export function drawField(f: GameField, ctx: CanvasRenderingContext2D, piece: Piece | null, level: number, filled: number[][]) {
    let light = new LightMap(f.colums, f.rows)
    let light2 = new LightMap(f.colums, f.rows)
    lightDownUp(light, f, Math.max(0.5, 1 - 0.05 * (level)))
    lightFilled(light, filled.flat(1))
    if (piece) {
        lightPiece(light2, piece, level / 30)
    } else {
        lightPiece(light2, new Piece(0, 5, "", new Mask([[1, 1],[1, 1]])), level / 30)
    }
    drawWithLight(new CombineLightMap(light, light2, (l1, l2) => Math.max(l1, l2)), f, ctx)
    ctx.fillStyle = '#f009'
    filled.forEach(lines => lines.forEach(line => ctx.fillRect(0, SIZE*line, SIZE*f.colums, SIZE)))
}

export function drawFieldSimple(f: GameField, ctx: CanvasRenderingContext2D) {
    f.forEach((cell, i, j) => {
        ctx.strokeStyle = "#444"
        const [x, y] = toCoords(i, j)
        ctx.strokeRect(x - 1, y - 1, 22, 22)
        if (ctx.fillStyle = cell || "") {
            drawSquare(ctx, i, j)
        }
    })
}

const bufferCanvas = document.createElement("canvas")
const styleSheet = document.querySelector("style")!.sheet!
let pieceViewRule: number | undefined

export function setupPieceView(squareSize: number, pieces: (readonly [string, Mask])[]) {
    bufferCanvas.width = 4 * squareSize * (pieces.length + 1)
    bufferCanvas.height = 4 * squareSize
    const bufferCtx = bufferCanvas.getContext("2d")!
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height)
    const pieceShiftMap = new Map<Mask | undefined | null, number>()
    pieceShiftMap.set(undefined, 0)
    pieceShiftMap.set(null, 0)
    bufferCtx.translate(squareSize * 4, 0)
    pieces.forEach(([color, mask], i) => {
        pieceShiftMap.set(mask, i + 1)
        bufferCtx.fillStyle = color
        const shift = (4 - mask.size) / 2;
        bufferCtx.translate(squareSize * shift, squareSize * shift)
        drawMask(mask, bufferCtx, true, false, 0, squareSize)
        bufferCtx.translate(squareSize * (4 - shift), -squareSize * shift)
    })
    const sprites = bufferCanvas.toDataURL()
    if (pieceViewRule)
        styleSheet.deleteRule(pieceViewRule)
    pieceViewRule = styleSheet.insertRule(`.piece-view { 
        background-image: url(${sprites});
        width: ${4 * squareSize}px; 
        height: ${4 * squareSize}px;
    }`, styleSheet.cssRules.length)
    return (view: HTMLElement, mask?: Mask) => {
        view.style.backgroundPositionX = `-${squareSize * 4 * pieceShiftMap.get(mask)!}px`
    }
}