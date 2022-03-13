import Piece from './Piece'
import GameField from './GameField'

const COLUMNS = 12
const ROWS = 24

const GREEN = '#45FD6B'
const RED = '#FC393E'
const YELLOW = '#FED248'
const BLUE = '#3B73FB'
const GREY = '#DBE1F1'

const COLORS = [
  GREEN,
  RED,
  YELLOW,
  BLUE,
  GREY
]

export class Game {
  private activePiece: Piece | null = new Piece(
    getRandomInt(COLUMNS - 2),
    0,
    getRandomColor()
  )
  private field = new GameField(ROWS, COLUMNS)
  private prevSec = 0
  constructor() {
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }
  private tickTime = 150
  public update(time: number, stopGame: () => void) {
    const { prevSec, activePiece, field } = this

    if (activePiece) {
      if (prevSec != Math.ceil(time / this.tickTime)) {
        activePiece.shift(0, 1)
        this.prevSec = Math.ceil(time / this.tickTime)

        if (field.hasTouchBottom(activePiece)) {
          field.append(activePiece)
          this.activePiece = null
        }
      }
    } else {
      this.activePiece = new Piece(
        2,//getRandomInt(COLUMNS - 2),
        0,
        getRandomColor(),
        [
          [
            [1, 0],
            [1, 1]
          ], [
            [1, 1],
            [0, 1]
          ], [
            [1, 1],
            [1, 1],
          ], [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
          ], [
            [0, 1, 0],
            [1, 1, 0],
            [0, 1, 0],
          ], [
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0],
          ], [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
          ], [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        ][getRandomInt(8)]
      )
      if (!field.pieceSpaceIsUnoccupied(this.activePiece)) {
          stopGame()
      }
    }

    // if there is no unoccupied space call stopGame()
  }
  private moveActivePieceRight() {
    const { activePiece, field } = this

    if (!activePiece) return

    if (activePiece.right + 1 < COLUMNS) {
      activePiece.shift(1, 0)
      if (!field.pieceSpaceIsUnoccupied(activePiece)) {
        // revert move beacaue is not allowed
        activePiece.shift(-1, 0)
      }
    }
  }

  private moveActivePieceLeft() {
    const { activePiece, field } = this

    if (!activePiece) return

    if (activePiece.left - 1 >= 0) {
      activePiece.shift(-1, 0)
      if (!field.pieceSpaceIsUnoccupied(activePiece)) {
        // revert move beacaue is not allowed
        activePiece.shift(1, 0)
      }
    }
  }

  public draw(canvas: HTMLCanvasElement, time: number) {
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const { activePiece, field } = this

    if (activePiece) {
      activePiece.draw(ctx)
    }

    field.draw(ctx)
  }

  private onKeyDown(event: KeyboardEvent) {
    const { key } = event
    if (key === "ArrowRight") {
      this.moveActivePieceRight()
    } else if (key === "ArrowLeft") {
      this.moveActivePieceLeft()
    }
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomColor() {
  return COLORS[getRandomInt(COLORS.length)]
}
