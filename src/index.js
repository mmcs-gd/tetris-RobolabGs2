import {
  init,
  update,
  draw
} from './tetris'

const canvas = document.getElementById('cnvs')

const tickLength = 15 //ms
let lastTick
let stopCycle

function run(tFrame) {
  stopCycle = window.requestAnimationFrame(run)

  const nextTick = lastTick + tickLength
  let numTicks = 0

  if (tFrame > nextTick) {
    const timeSinceTick = tFrame - lastTick
    numTicks = Math.floor(timeSinceTick / tickLength)
  }

  for (let i = 0; i < numTicks; i++) {
    lastTick = lastTick + tickLength
    update(lastTick, stopGame)
  }

  draw(canvas, tFrame)
}

function stopGame() {
  window.cancelAnimationFrame(stopCycle)
}

lastTick = performance.now()
init(canvas)
run()
