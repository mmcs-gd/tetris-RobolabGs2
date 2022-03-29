import { Actions } from "./tetris"

type KeyMapping = Record<string, Actions | undefined>

export function remapActionsToKeys(record: KeyMapping): Record<string, string[]> {
    const result = {} as Record<string, string[]>
    Object.entries(record).forEach(([key, action]) => {
        if (action === undefined)
            return
        const actionName = Actions[action]
        result[actionName] = result[actionName] || []
        result[actionName].push(key)
    })
    return result
}

interface EventsSource {
    addEventListener(event: 'keyup'|'keydown', listener: (ev: KeyboardEvent) => void): void
}

export function listenKeyboard(keyMapping: KeyMapping, source: EventsSource = document) {
    const inputBuffer = new Array<boolean>(Object.keys(Actions).length/2).fill(false)
    source.addEventListener('keyup', function (ev: KeyboardEvent) {
        const action = keyMapping[ev.code]
        if (action !== undefined)
            inputBuffer[action] = false
    })
    source.addEventListener('keydown', function (ev: KeyboardEvent) {
        const action = keyMapping[ev.code]
        if (action !== undefined)
            inputBuffer[action] = true
    })
    return inputBuffer
}

