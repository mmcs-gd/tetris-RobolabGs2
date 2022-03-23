import { drawMask, setupPieceView } from './graphics'
import { listenKeyboard, remapActionsToKeys } from './input'
import {
  Actions,
  Game,
  PIECES
} from './tetris'
import { loadSettingsFromURL } from './utils'

const {
  autoStart,
  ...settings
} = loadSettingsFromURL({
  autoStart: false,
  linesPerLevel: 10,
})

const player = {
  next: 0,
  hold: 0,
}

const canvas = document.getElementById('cnvs') as HTMLCanvasElement
const holdView = Array.from(document.querySelectorAll(".piece-view_hold"))
const lockElements = (count: number) => (el: Element, i: number): boolean => el.classList.toggle("locked", !(i < count))
const displayMaskInElem = setupPieceView(13, PIECES)
const nextViews = Array.from(document.querySelectorAll(".piece-view_next"))
holdView.forEach(lockElements(player.hold))
nextViews.forEach(lockElements(player.next))
const displayHold = holdView.map(elem => displayMaskInElem.bind(undefined, elem as HTMLElement))
const displayNextPiece = nextViews.map(elem => displayMaskInElem.bind(undefined, elem as HTMLElement))

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

const keyboardMapping: Record<string, Actions | undefined> = {
  "ArrowRight": Actions.MoveRight,
  "ArrowLeft": Actions.MoveLeft,
  "ArrowUp": Actions.RotateRight,
  "ArrowDown": Actions.SoftDrop,
  "KeyZ": Actions.RotateLeft,
  "Space": Actions.HardDrop,
  "KeyC": Actions.Hold,

  "KeyD": Actions.MoveRight,
  "KeyA": Actions.MoveLeft,
  "KeyW": Actions.RotateRight,
  "KeyS": Actions.SoftDrop,
  "KeyQ": Actions.RotateLeft,
  "KeyE": Actions.Hold,
}



const controlsHelp = gameHelloDialog.querySelector('.controls-desc') as HTMLElement
const actionsToKeys = remapActionsToKeys(keyboardMapping)
for (let action in actionsToKeys) {
  const controls = actionsToKeys[action]
  const section = document.createElement('section')
  section.innerHTML = `<span>${splitCamelCase(action)}</span><span>${controls.map(splitCamelCase).join(", ")}</span>`
  controlsHelp.append(section)
}

let game = new Game()
const inputBuffer = listenKeyboard(keyboardMapping)
if (autoStart)
  restartGame()
function run(tFrame: number) {
  stopCycle = window.requestAnimationFrame(run)

  const nextTick = lastTick + tickLength
  let numTicks = 0

  if (tFrame > nextTick) {
    const timeSinceTick = tFrame - lastTick
    numTicks = Math.max(Math.floor(timeSinceTick / tickLength), 4)
  }

  for (let i = 0; i < Math.min(1, numTicks); i++) {
    lastTick = lastTick + tickLength
    const finished = game.update(inputBuffer, lastTick)
    if (finished) {
      stopGame()
      return
    }
  }
  game.draw(canvas, tFrame)
}

function stopGame() {
  window.cancelAnimationFrame(stopCycle)
  gameOverDialog.classList.remove("dialog_hidden")
  gameOverDialog.querySelector("button")?.focus()
  document.body.classList.toggle("ingame_hidden", true)
}

function restartGame() {
  game = new Game(player.next, player.hold, settings.linesPerLevel)
  holdView.forEach(lockElements(game.maxHold))
  nextViews.forEach(lockElements(game.maxHistory))
  game.addEventListener('hold', function () {
    displayHold.forEach((display, i) => {
      display(this.holdedPiece[i]?.mask)
    })
  })
  game.addEventListener('drop', function () {
    displayNextPiece.forEach((display, i) => {
      display(this.nextPieces[i]?.mask)
    })
  })
  game.addEventListener('nextLevel', function ({ level }) {
    this.maxHold = Math.min(3, (level / 5) | 0)
    this.maxHistory = Math.min(4, (level / 3) | 0)
    holdView.forEach(lockElements(this.holdedPiece.length))
    nextViews.forEach(lockElements(this.nextPieces.length))
  })
  game.addEventListener('updateScore', updateScoreView)
  updateScoreView(game.statistics)
  lastTick = performance.now()
  document.body.classList.toggle("ingame_hidden", false)
  gameOverDialog.classList.add("dialog_hidden")
  gameHelloDialog.classList.add("dialog_hidden")
  run(0)
}

function splitCamelCase(s: string) {
  return s.split(/(?<=[a-z])(?=[A-Z])/g).filter(str => !/(Arrow)|(Key)/.test(str)).join(" ")
}
