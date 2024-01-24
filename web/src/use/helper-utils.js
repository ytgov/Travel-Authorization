import { unref, watch } from "vue"
import { isNumber } from "lodash"

function ensureStateFor(globalState, useFunction, id) {
  if (!isNumber(id)) return null

  if (globalState.has(id)) {
    return globalState.get(id)
  } else {
    // NOTE: the use function is using an unreffed id here,
    // reactivity is maintined by the watch in the global factory function
    const localState = useFunction(id)
    globalState.set(id, localState)
    return localState
  }
}

/**
 *
 * @param {typeof Map} globalState - a Map instance for storing global state
 * @param {() => any} useFunction - use function that returns a reactive state object
 */
export function asGlobalUse(globalState, useFunction) {
  return (id) => {
    watch(
      () => unref(id),
      (newId) => {
        ensureStateFor(globalState, useFunction, newId)
      },
      {
        immediate: true,
      }
    )

    return ensureStateFor(globalState, useFunction, unref(id))
  }
}

export function defineUse(useFunction) {
  const globalState = new Map()

  return asGlobalUse(globalState, useFunction)
}
