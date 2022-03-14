import Piece, { drawSquare, toCoords } from "./Piece"

export default class GameField {
  private readonly field: (string | null)[][]
  public bottomRow: number = this.rows - 1
  constructor(public rows: number, public colums: number) {
    this.field = new Array()
    for (let i = 0; i < rows; i++)
      this.field[i] = new Array(colums).fill(null)
  }

  pieceSpaceIsUnoccupied(piece: Piece) {
    return !piece.any((i, j) => i < 0 || i >= this.colums || j < 0 || j >= this.rows || this.field[j][i] !== null)
  }

  hasTouchBottom(piece: Piece) {
    return piece.any((i, j) => j === this.bottomRow || this.field[j+1][i] !== null)
  }

  append(piece: Piece) {
    piece.forEach((i, j) => {
      this.field[j][i] = piece.color
    })
    for(let row = piece.row; row < Math.min(piece.row+piece.size, this.rows); row++) {
      if(this.field[row].every(cell => cell !== null)) {
        for(let j = row; j > 0; j--)
          this.field[j] = this.field[j-1]
        this.field[0] = new Array(this.colums).fill(null)
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.colums; i++)
      for (let j = 0; j < this.rows; j++) {
        if (ctx.fillStyle = ctx.strokeStyle = this.field[j][i] || "") {
          drawSquare(ctx, i, j)
        }
        // ctx.fillStyle = "#ffffff"
        // ctx.fillText(`|${j},${i}|`, ...toCoords(i, j+0.5))
      }
  }
}
