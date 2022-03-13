import Piece, { drawSquare } from "./Piece"

export default class GameField {
  private readonly field: (string | undefined)[][]
  public bottomRow: number = this.rows - 1
  constructor(public rows: number, public colums: number) {
    this.field = new Array(colums)
    for (let i = 0; i < colums; i++)
      this.field[i] = new Array(rows)
  }

  pieceSpaceIsUnoccupied(piece: Piece) {
    const mask = piece.mask
    for (let i = 0; i < mask.length; i++)
      for (let j = 0; j < mask[0].length; j++)
        if (mask[j][i] && this.field[i + piece.row][j + piece.column])
          return false
    return true
  }

  hasTouchBottom(piece: Piece) {
    if (piece.bottom >= this.bottomRow)
      return true
    
    const mask = piece.mask
    for (let i = 0; i < mask.length; i++)
      for (let j = 0; j < mask[0].length; j++)
        if (mask[j][i] && this.field[i + piece.row][j + piece.column + 1])
          return true
    return false
  }

  append(piece: Piece) {
    const mask = piece.mask
    for (let i = 0; i < mask.length; i++)
      for (let j = 0; j < mask[0].length; j++)
        if (mask[j][i])
          this.field[i + piece.row][j + piece.column] = piece.color
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.colums; i++)
      for (let j = 0; j < this.rows; j++)
        if (ctx.fillStyle = ctx.strokeStyle = this.field[i][j] || "") {
          drawSquare(ctx, i, j)
        }
  }
}
