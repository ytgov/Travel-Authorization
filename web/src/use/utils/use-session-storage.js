import { ref, watch } from "vue"

export function useSessionStorage(key, defaultValue = null) {
  const storedValue = sessionStorage.getItem(key)
  const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

  watch(
    data,
    (newValue) => {
      if (newValue === defaultValue) {
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
