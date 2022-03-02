export default class GameField {
  constructor(bottomRow) {
    this.pieces = []
    this.bottomRow = bottomRow
  }

  pieceSpaceIsUnoccupied(piece) {
    return this.pieces.every(p => (
      !(
        intersects(piece.left, piece.right, p.left, p.right) &&
        intersects(piece.top, piece.bottom, p.top, p.bottom)
      )
    ))
  }

  hasTouchBottom(piece) {
    const touchBottomRow = piece.bottom >= this.bottomRow

    const touchAnotherPiece = this.pieces.some(p => (
      intersects(
        piece.left, piece.right,
        p.left, p.right
      ) && piece.bottom + 1 == p.top
    ))

    return touchBottomRow || touchAnotherPiece
  }

  append(piece) {
    this.pieces.push(piece)
  }

  draw(ctx) {
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
function intersects(a, b, c, d) {
  return (a >= c && a <= d) || (b >= c && b <= d)
}
