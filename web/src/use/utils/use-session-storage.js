import { ref, watch } from "vue"
import { isEqual } from "lodash"

export function useSessionStorage(key, defaultValue = null) {
  const storedValue = sessionStorage.getItem(key)
  const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

  watch(
    data,
    (newValue) => {
      if (isEqual(newValue, defaultValue)) {
        sessionStorage.removeItem(key)
      } else {
        sessionStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true }
  )

  return data
}

export default useSessionStorage
