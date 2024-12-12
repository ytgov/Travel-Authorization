import { isEmpty, isNil, isString } from "lodash"

import useRouteQueryEnhanced from "@/use/utils/use-route-query-enhanced"

/** @typedef {{ key: string; order?: boolean | "asc" | "desc" }} SortItem */

const SEPARATOR = "."

/**
 * @callback UseVuetifySortByToSafeRouteQuery
 * @param {string} name
 * @param {SortItem[] | undefined>} [defaultValue]
 * @returns {import("vue").Ref<SortItem[] | undefined>}
 */

/** @type {UseVuetifySortByToSafeRouteQuery} */
export function useVuetifySortByToSafeRouteQuery(name, defaultValue) {
  /**
   * @function parse
   * @param {string[] | string | undefined} newSortBy
   * @returns {SortItem[] | undefined}
   */
  function parse(newSortBy) {
    if (isNil(newSortBy) || isEmpty(newSortBy)) {
      return
    }

    if (isString(newSortBy)) {
      newSortBy = [newSortBy]
    }

    return newSortBy.map((entry) => {
      const [key, order] = entry.split(SEPARATOR)
      return { key, order }
    })
  }

  /**
   * @function stringify
   * @param {SortItem[] | undefined} sortByValue
   * @returns {string[] | undefined}
   */
  function stringify(sortByValue) {
    if (isNil(sortByValue) || isEmpty(sortByValue)) {
      return
    }

    return sortByValue.map(({ key, order }) => `${key}${SEPARATOR}${order}`)
  }

  const defaultValueString = stringify(defaultValue)
  return useRouteQueryEnhanced(name, defaultValueString, {
    parse,
    stringify,
  })
}

export default useVuetifySortByToSafeRouteQuery
