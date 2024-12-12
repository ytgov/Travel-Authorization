import { isEmpty, isNil } from "lodash"
import { computed } from "vue"
import { toValue } from "@vueuse/shared"

/** @typedef {import("@/api/base-api").ModelOrder} ModelOrder */
/** @typedef {import("@/use/utils/use-vuetify-sort-by-to-safe-route-query").SortItem} SortItem */

/**
 * @callback UseVuetifySortByToSequelizeSafeOrder
 * @param {import("vue").Ref<SortItem[] | undefined>} sortBy
 * @returns {import("vue").ComputedRef<ModelOrder[] | undefined>}
 */

/** @type {UseVuetifySortByToSequelizeSafeOrder} */
export function useVuetifySortByToSequelizeSafeOrder(sortBy) {
  /** @type {import("vue").ComputedRef<ModelOrder[] | undefined>} */
  const order = computed(() => {
    const sortByValue = toValue(sortBy)
    if (isNil(sortByValue) || isEmpty(sortByValue)) {
      return undefined
    }

    return sortByValue.map(({ key: column, order }) => {
      let direction = "ASC"
      if (order === true) {
        direction = "ASC"
      } else if (order === false) {
        direction = "DESC"
      } else if (order === "desc") {
        direction = "DESC"
      } else if (order === "asc") {
        direction = "ASC"
      }
      return [column, direction]
    })
  })

  return order
}

export default useVuetifySortByToSequelizeSafeOrder
