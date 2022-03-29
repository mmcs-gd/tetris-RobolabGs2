import Piece from "./Piece"

export default class GameField {
  private readonly field: (string | null)[][]
  private filledLine: string[]
  public bottomRow: number = this.rows - 1
  constructor(public rows: number, public colums: number) {
    this.field = new Array(rows)
    this.filledLine = new Array(colums).fill("orange")
    for (let i = 0; i < rows; i++)
      this.field[i] = new Array(colums).fill(null)
  }

  pieceSpaceIsUnoccupied(piece: Piece) {
    return !piece.any((i, j) => i < 0 || i >= this.colums || j < 0 || j >= this.rows || this.field[j][i] !== null)
  }

  hasTouchBottom(piece: Piece) {
    return piece.any((i, j) => j === this.bottomRow || this.field[j + 1][i] !== null)
  }
  // return count filled lines
  append(piece: Piece): number[] {
    piece.forEach((i, j) => {
      this.field[j][i] = piece.color
    })
    const filled = new Array<number>()
    for (let row = piece.row; row < Math.min(piece.row + piece.size, this.rows); row++) {
      if (this.field[row].every(cell => cell !== null)) {
        // this.field[row] = this.filledLine
        filled.push(row)
      }
    }
    return filled;
  }
  clear(lines: number[]) {
    for (let row of lines) {
      for (let j = row; j > 0; j--)
        this.field[j] = this.field[j - 1]
      this.field[0] = new Array(this.colums).fill(null)
    }
  }
  // forEach line by line: left to right, up to down
  forEach(callback: (cell: string | null, column: number, row: number) => void) {
    for (let j = 0; j < this.rows; j++)
      for (let i = 0; i < this.colums; i++) {
        callback(this.field[j][i], i, j)
      }
  }
  forEachDownUp(callback: (cell: string | null, column: number, row: number) => void) {
    for (let j = this.rows - 1; 0 <= j; j--)
      for (let i = 0; i < this.colums; i++) {
        callback(this.field[j][i], i, j)
      }
  }
}
