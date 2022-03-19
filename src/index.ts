import {
  Actions,
  Game
} from './tetris'

const canvas = document.getElementById('cnvs') as HTMLCanvasElement
const tickLength = 15 //ms
let lastTick = 0
let stopCycle = 0

let game = new Game()
const updateScoreView = (() => {
  const scoreKey = "statistics" as const
  const keys = Object.keys(game[scoreKey]) as (keyof Game[typeof scoreKey])[]
  const elements = Object.fromEntries(
    keys.map(key => [key, Array.from(document.querySelectorAll(`.${scoreKey}__${key}`))])
  ) as Record<keyof Game[typeof scoreKey], HTMLElement[]>
  return (statistics: Game[typeof scoreKey]) => {
    for(let key of keys)
      for(let element of elements[key])
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
}

const controlsHelp = gameHelloDialog.querySelector('.controls-desc') as HTMLElement
for(let control in keyboardMapping) {
  const action = Actions[keyboardMapping[control]!]
  const section = document.createElement('section')
  section.innerHTML = `<span>${splitCamelCase(action)}</span><span>${splitCamelCase(control)}</span>`
  controlsHelp.append(section)
}

let inputBuffer = new Array<boolean>()
console.log(inputBuffer)
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
