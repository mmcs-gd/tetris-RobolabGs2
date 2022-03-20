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
  forEach(action: (i: number, j: number) => void, rotation: number = 0): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.get(j, i, rotation))
          continue
        action(i, j)
      }
    }
  }
}

export default class Piece {
  public readonly size: number;
  constructor(
    public row: number,
    public column: number,
    public color: string,
    public readonly mask: Mask) {
    this.size = this.mask.size;
  }

  public rotation = 0

  shift(di: number, dj: number) {
    this.row += di
    this.column += dj
  }
  rotate(delta = 1) {
    this.rotation = (this.rotation + 4 + delta) % 4;
  }


  forEach(action: (i: number, j: number) => void): void {
    this.mask.forEach((i, j) => {
      action(this.column + i, this.row + j)
    }, this.rotation)
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
}

