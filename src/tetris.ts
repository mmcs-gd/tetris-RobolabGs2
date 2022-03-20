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

class Statistics {
  lines = 0
  private _score = 0
  public get score() {
    return this._score
  }
  public get level() {
    return Math.floor(this.lines/10)+1
  }
  public set score(value: number) {
    this._score += this.level * (value - this._score)
  }
}

export class Game {
  public static statisticLabels: Record<keyof Game["statistics"], string> = {
    lines: "Уничтожено линий",
    level: "Уровень",
    score: "Счёт",
  }
  public statistics = new Statistics()
  private activePiece: Piece | null = new Piece(0, 5, ...getRandomItem(PIECES))
  private field = new GameField(ROWS, COLUMNS)
  private shiftTime = 50
  private lastShift = 0
  private get freezeCooldown() {
    return Math.max(30, 1000 - 40 * Math.min(10, this.statistics.level-1) - 30 * (this.statistics.level-1))
  }
  private freezeAfter = this.freezeCooldown
  private buttonStates = new Array<boolean>()
  private prevTime = 0
  public update(userInput: boolean[], time: number): boolean {
    const { activePiece, field } = this
    const dt = time - this.prevTime
    this.prevTime = time
    this.freezeAfter -= dt
    if (activePiece) {
      if (this.freezeAfter <= 0) {
        if (field.hasTouchBottom(activePiece)) {
          this.fixPiece(field, activePiece)
        } else {
          this.pieceDown(activePiece)
          this.freezeAfter = this.freezeCooldown
        }
      }
      this.processInput(this.buttonStates, userInput, time)
    } else {
      this.activePiece = new Piece(0, 5, ...getRandomItem(PIECES))
      this.freezeAfter = this.freezeCooldown
      if (!field.pieceSpaceIsUnoccupied(this.activePiece)) {
        return true
      }
    }
    this.buttonStates = [...userInput]
    return false
  }

  private fixPiece(field: GameField, activePiece: Piece) {
    const linesDestroyed = field.append(activePiece)
    this.statistics.lines += linesDestroyed
    this.statistics.score += [0, 100, 300, 500, 800][linesDestroyed]
    this.activePiece = null
  }

  private processInput(oldInput: boolean[], input: boolean[], time: number) {
    let shifted = false
    for (let action = 0 as Actions; action < input.length; action++) {
      if (input[action]) {
        if (!oldInput[action])
          switch (action) {
            case Actions.RotateRight:
              this.tryRotate(1)
              break
            case Actions.RotateLeft:
              this.tryRotate(-1)
              break
            case Actions.HardDrop:
              if (this.activePiece) {
                this.statistics.score += this.pieceHardDown(this.activePiece) * 2;
                this.fixPiece(this.field, this.activePiece)
              }
              break
          }
        else if (time - this.lastShift >= this.shiftTime) {
          shifted = true
          switch (action) {
            case Actions.MoveRight:
              this.tryShift(0, 1)
              break
            case Actions.MoveLeft:
              this.tryShift(0, -1)
              break
            case Actions.SoftDrop:
              if (this.activePiece)
                this.statistics.score += this.pieceDown(this.activePiece) ? 1 : 0
              this.freezeAfter = this.freezeCooldown
              break
            default:
              shifted = false
          }
        }
      }
    }
    if (shifted) {
      this.lastShift = time
    }
  }

  private pieceDown(activePiece: Piece): boolean {
    if (!this.field.hasTouchBottom(activePiece)) {
      activePiece.shift(1, 0)
      return true
    }
    return false
  }
  private pieceHardDown(activePiece: Piece): number {
    let linesDown = 0
    while (this.pieceDown(activePiece)) ++linesDown
    return linesDown
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
      const backupRow = activePiece.row
      this.pieceHardDown(activePiece)
      activePiece.draw(ctx, false, true)
      activePiece.row = backupRow
    }
    field.draw(ctx)
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomItem<T>(arr: T[]): T {
  return arr[getRandomInt(arr.length)]
}
