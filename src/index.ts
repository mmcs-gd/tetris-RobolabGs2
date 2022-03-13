import {
  Game
} from './tetris'

const canvas = document.getElementById('cnvs') as HTMLCanvasElement

const tickLength = 15 //ms
let lastTick = 0
let stopCycle = 0

let game = new Game()

function run(tFrame: number) {
  stopCycle = window.requestAnimationFrame(run)

  const nextTick = lastTick + tickLength
  let numTicks = 0

  if (tFrame > nextTick) {
    const timeSinceTick = tFrame - lastTick
    numTicks = Math.floor(timeSinceTick / tickLength)
  }

  for (let i = 0; i < Math.min(1, numTicks); i++) {
    lastTick = lastTick + tickLength
    game.update(lastTick, restartGame)
  }

  game.draw(canvas, tFrame)
}

function stopGame() {
  window.cancelAnimationFrame(stopCycle)
}

function restartGame() {
  game = new Game()
}

lastTick = performance.now()

run(0)
