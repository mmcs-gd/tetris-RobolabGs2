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
  private tickTime = 1000
  public update(userInput: Actions[], time: number, stopGame: () => void) {
    const { prevSec, activePiece, field } = this
    for (let input of userInput) {
      this.processInput(input)
    }
    if (activePiece) {
      if (prevSec != Math.ceil(time / this.tickTime)) {
        this.prevSec = Math.ceil(time / this.tickTime)
        if (field.hasTouchBottom(activePiece)) {
          this.fixPiece(field, activePiece)
        } else {
          this.pieceDown(activePiece, field)
        }
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

  private fixPiece(field: GameField, activePiece: Piece) {
    field.append(activePiece)
    this.activePiece = null
  }

  private processInput(input: Actions) {
    switch (input) {
      case Actions.MoveRight:
        this.tryShift(0, 1)
        break
      case Actions.MoveLeft:
        this.tryShift(0, -1)
        break
      case Actions.RotateRight:
        this.tryRotate(1)
        break
      case Actions.RotateLeft:
        this.tryRotate(-1)
        break
      case Actions.SoftDrop:
        if (this.activePiece)
          this.pieceDown(this.activePiece, this.field)
        break
      case Actions.HardDrop:
        if (this.activePiece) {
          while (this.pieceDown(this.activePiece, this.field));
          this.fixPiece(this.field, this.activePiece)
        }
        break
    }
  }

  private pieceDown(activePiece: Piece, field: GameField): boolean {
    if (!field.hasTouchBottom(activePiece)) {
      activePiece.shift(1, 0)
      return true
    }
    return false
  }

  private tryShift(di: number, dj: number) {
    const { activePiece, field } = this
    if (!activePiece) return
    activePiece.shift(di, dj)
    if (!field.pieceSpaceIsUnoccupied(activePiece)) {
      activePiece.shift(-di, -dj)
    }
  }
  private tryRotate(r: number) {
    const { activePiece, field } = this
    if (!activePiece) return
    activePiece.rotate(r)
    if (!field.pieceSpaceIsUnoccupied(activePiece)) {
      activePiece.rotate(-r)
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
