import Piece, { Mask } from './Piece'
import GameField from './GameField'

const COLUMNS = 12
const ROWS = 24

const GREEN = '#45FD6B'
const RED = '#FC393E'
const YELLOW = '#FED248'
const BLUE = '#3B73FB'
const GREY = '#DBE1F1'
const CYAN = '#00F0F0'
const PURPLE = '#A000F0'
const COLORS = [
  GREEN,
  RED,
  YELLOW,
  BLUE,
  GREY,
  CYAN,
  PURPLE,
]

const CLASSIC_TETRAMINO = [
  [ // I
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [ // O
    [1, 1],
    [1, 1],
  ],
  [ // J
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [ // L
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [ // T
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [ // S
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [ // Z
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
]

const PIECES = CLASSIC_TETRAMINO.map((mask, i) => [COLORS[i], new Mask(mask)] as const)
export enum Actions {
  MoveLeft, MoveRight,
  RotateLeft, RotateRight,
  SoftDrop, HardDrop,
}
export class Game {
  private activePiece: Piece | null = new Piece(
    0,
    getRandomInt(COLUMNS - 2),
    ...getRandomItem(PIECES),
  )
  private field = new GameField(ROWS, COLUMNS)
  private prevSec = 0
  private tickTime = 150
  public update(userInput: Actions[], time: number, stopGame: () => void) {
    const { prevSec, activePiece, field } = this
    // TODO
    for (let input of userInput) {
      switch (input) {
        case Actions.MoveRight:
          this.moveActivePieceRight()
          break
        case Actions.MoveLeft:
          this.moveActivePieceLeft()
          break
        case Actions.RotateRight:
          if (this.activePiece) {
            this.activePiece.rotate(1)
            if (!this.field.pieceSpaceIsUnoccupied(this.activePiece))
              this.activePiece.rotate(-1)
          }
          break
        case Actions.SoftDrop:
          if (this.activePiece)
            this.pieceDown(this.activePiece, this.field)
          break
      }
    }
    if (activePiece) {
      if (prevSec != Math.ceil(time / this.tickTime)) {
        this.prevSec = Math.ceil(time / this.tickTime)
        this.pieceDown(activePiece, field)
      }
    } else {
      this.activePiece = new Piece(
        0,//getRandomInt(COLUMNS - 2),
        5,
        ...getRandomItem(PIECES),
      )
      if (!field.pieceSpaceIsUnoccupied(this.activePiece)) {
        stopGame()
      }
    }

    // if there is no unoccupied space call stopGame()
  }
  private pieceDown(activePiece: Piece, field: GameField) {
    activePiece.shift(1, 0)
    if (field.hasTouchBottom(activePiece)) {
      field.append(activePiece)
      this.activePiece = null
    }
  }

  private moveActivePieceRight() {
    const { activePiece, field } = this

    if (!activePiece) return

    activePiece.shift(0, 1)
    if (!field.pieceSpaceIsUnoccupied(activePiece)) {
      // revert move beacaue is not allowed
      activePiece.shift(0, -1)
    }
  }

  private moveActivePieceLeft() {
    const { activePiece, field } = this

    if (!activePiece) return

    activePiece.shift(0, -1)
    if (!field.pieceSpaceIsUnoccupied(activePiece)) {
      // revert move beacaue is not allowed
      activePiece.shift(0, 1)
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
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomColor() {
  return COLORS[getRandomInt(COLORS.length)]
}

function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomInt(arr.length)]
}
