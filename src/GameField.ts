import Piece from "./Piece"

export default class GameField {
  public readonly pieces: Piece[] = []
  constructor(public bottomRow: number) {
  }

  pieceSpaceIsUnoccupied(piece: Piece) {
    return this.pieces.every(p => (
      !(
        intersects(piece.left, piece.right, p.left, p.right) &&
        intersects(piece.top, piece.bottom, p.top, p.bottom)
      )
    ))
  }

  hasTouchBottom(piece: Piece) {
    const touchBottomRow = piece.bottom >= this.bottomRow

    const touchAnotherPiece = this.pieces.some(p => (
      intersects(
        piece.left, piece.right,
        p.left, p.right
      ) && piece.bottom + 1 == p.top
    ))

    return touchBottomRow || touchAnotherPiece
  }

  append(piece: Piece) {
    this.pieces.push(piece)
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.pieces.forEach(t => t.draw(ctx))
  }
}

/*
 * There are two possible situations:
 *
 * a----b
 *    c-----d
 *
 * or:
 *
 * c----d
 *    a-----b
 */
function intersects(a: number, b: number, c: number, d: number) {
  return (a >= c && a <= d) || (b >= c && b <= d)
}
