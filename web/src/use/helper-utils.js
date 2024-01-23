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

export function useGlobalFactory(globalState, useFunction) {
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
