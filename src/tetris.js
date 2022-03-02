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

const gameState = {}

export function init(canvas) {
  gameState.activePiece = new Piece(
    getRandomInt(COLUMNS - 2),
    0,
    getRandomColor()
  )

  gameState.field = new GameField(ROWS - 1)
  gameState.prevSec = 0
}


export function update(time, stopGame) {
  const { prevSec, activePiece, field } = gameState

  if (activePiece) {
    if (prevSec != Math.ceil(time / 100)) {
      activePiece.shift(0, 1)
      gameState.prevSec = Math.ceil(time / 100)

      if (field.hasTouchBottom(activePiece)) {
        field.append(activePiece)
        gameState.activePiece = null
      }
    }
  } else {
    gameState.activePiece = new Piece(
      getRandomInt(COLUMNS - 2),
      0,
      getRandomColor()
    )
  }

  // if there is no unoccupied space call stopGame()
}


function moveActivePieceRight() {
  const { activePiece, field } = gameState

  if (!activePiece) return

  if (activePiece.right + 1 < COLUMNS) {
    activePiece.shift(1, 0)
    if (!field.pieceSpaceIsUnoccupied(activePiece)) {
      // revert move beacaue is not allowed
      activePiece.shift(-1, 0)
    }
  }
}

function moveActivePieceLeft() {
  const { activePiece, field } = gameState

  if (!activePiece) return

  if (activePiece.left - 1 >= 0) {
    activePiece.shift(-1, 0)
    if (!field.pieceSpaceIsUnoccupied(activePiece)) {
      // revert move beacaue is not allowed
      activePiece.shift(1, 0)
    }
  }
}

export function draw(canvas, time) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const { activePiece, field } = gameState

  if (activePiece) {
    activePiece.draw(ctx)
  }

  field.draw(ctx)
}

function onKeyDown(event) {
  const { key } = event
  if (key === "ArrowRight") {
    moveActivePieceRight()
  } else if (key === "ArrowLeft") {
    moveActivePieceLeft()
  }
}

document.addEventListener('keydown', onKeyDown)

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getRandomColor() {
  return COLORS[getRandomInt(COLORS.length)]
}
