import { drawMask } from './graphics'
import {
  Actions,
  Game
} from './tetris'

const canvas = document.getElementById('cnvs') as HTMLCanvasElement
const holdedCanvas = document.querySelector('canvas.hold') as HTMLCanvasElement
const autoStart = true
const tickLength = 15 //ms
let lastTick = 0
let stopCycle = 0

function staticLineView(parent: Element, label: string, cssClass: string): HTMLElement {
  const line = document.createElement("section")
  line.innerText = `${label}: `
  const output = document.createElement("span")
  output.className = cssClass
  line.appendChild(output)
  parent.appendChild(line)
  return output
}

const updateScoreView = (() => {
  const scoreKey = "statistics" as const
  const keys = Object.keys(Game.statisticLabels) as (keyof Game[typeof scoreKey])[]
  const elements = Object.fromEntries(
    keys.map(key => [key, new Array<HTMLElement>()])
  ) as Record<keyof Game[typeof scoreKey], HTMLElement[]>
  document.querySelectorAll(`.${scoreKey}`).forEach(root => {
    keys.forEach(key => elements[key].push(staticLineView(root, Game.statisticLabels[key], `${scoreKey}__${key}`)))
  })


  return (statistics: Game[typeof scoreKey]) => {
    for (let key of keys)
      for (let element of elements[key])
        element.textContent = statistics[key].toString()
  }
})();

document.querySelectorAll('.new-game').forEach(el => el.addEventListener('click', restartGame))
const gameOverDialog = document.getElementById('gameover') as HTMLElement
const gameHelloDialog = document.getElementById('gamehello') as HTMLElement
const gameUI = document.querySelectorAll('.ingame')

const keyboardMapping: Record<string, Actions | undefined> = {
  "ArrowRight": Actions.MoveRight,
  "ArrowLeft": Actions.MoveLeft,
  "ArrowUp": Actions.RotateRight,
  "ArrowDown": Actions.SoftDrop,
  "KeyZ": Actions.RotateLeft,
  "Space": Actions.HardDrop,
  "KeyC": Actions.Hold,
}

const controlsHelp = gameHelloDialog.querySelector('.controls-desc') as HTMLElement
for (let control in keyboardMapping) {
  const action = Actions[keyboardMapping[control]!]
  const section = document.createElement('section')
  section.innerHTML = `<span>${splitCamelCase(action)}</span><span>${splitCamelCase(control)}</span>`
  controlsHelp.append(section)
}
const holdCtx = holdedCanvas.getContext('2d')!
const inputBuffer = new Array<boolean>(Object.keys(keyboardMapping).length).fill(false)
document.addEventListener('keyup', function (ev: KeyboardEvent) {
  const action = keyboardMapping[ev.code]
  if (action !== undefined)
    inputBuffer[action] = false
})
document.addEventListener('keydown', function (ev: KeyboardEvent) {
  const action = keyboardMapping[ev.code]
  if (action !== undefined)
    inputBuffer[action] = true
})
let game = new Game()

if (autoStart)
  restartGame()
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
    const finished = game.update(inputBuffer, lastTick)
    updateScoreView(game.statistics)
    if (finished) {
      stopGame()
      return
    }
  }

  game.draw(canvas, tFrame)
  holdCtx.clearRect(0, 0, holdedCanvas.width, holdedCanvas.height)
  holdCtx.save()
  game.nextPieces.forEach((piece, i) => {
    holdCtx.fillStyle = piece.color
    drawMask(piece.mask, holdCtx)
    holdCtx.translate(22*4, 0)
  })
  holdCtx.restore()
  if(game.holdedPiece) {
    holdCtx.fillStyle = game.holdedPiece.color
    holdCtx.translate(0, 22*5)
    drawMask(game.holdedPiece.mask, holdCtx)
    holdCtx.translate(0, -22*5)
  }
}

function stopGame() {
  window.cancelAnimationFrame(stopCycle)
  gameOverDialog.classList.remove("dialog_hidden")
  gameUI.forEach(el => el.classList.toggle("ingame_hidden", true))
}

function restartGame() {
  game = new Game()
  lastTick = performance.now()
  gameUI.forEach(el => el.classList.toggle("ingame_hidden", false))
  gameOverDialog.classList.add("dialog_hidden")
  gameHelloDialog.classList.add("dialog_hidden")
  run(0)
}

function splitCamelCase(s: string) {
  return s.split(/(?<=[a-z])(?=[A-Z])/g).join(" ")
}
