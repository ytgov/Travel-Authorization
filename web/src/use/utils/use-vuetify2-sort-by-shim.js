import { reactive, toRefs, watch } from "vue"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import("@/use/utils/use-vuetify-sort-by-to-safe-route-query").SortItem} SortItem */

/**
 * @callback UseVuetify2SortByShim
 * @param {Ref<SortItem[] | undefined>} sortBy
 * @returns {{
 *   vuetify2SortBy: Ref<string[]>,
 *   vuetify2SortDesc: Ref<boolean[]>,
 *   sortBy: Ref<SortItem[] | undefined>,
 * }}
 */

/** @type {UseVuetify2SortByShim} */
export function useVuetify2SortByShim(sortBy) {
  const state = reactive({
    vuetify2SortBy: sortBy.value?.map((item) => item.key) || [],
    vuetify2SortDesc: sortBy.value?.map((item) => item.order === "desc") || [],
  })

  watch(
    () => [state.vuetify2SortBy, state.vuetify2SortDesc],
    ([newVuetify2SortBy, newVuetify2SortDesc]) => {
      sortBy.value = newVuetify2SortBy.map((value, index) => {
        return {
          key: value,
          order: newVuetify2SortDesc[index] ? "desc" : "asc",
        }
      })
    }
  )

  return {
    ...toRefs(state),
  }
}

export default useVuetify2SortByShim
