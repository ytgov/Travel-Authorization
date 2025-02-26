import { isEmpty, isNil, isString } from "lodash"

import useRouteQuery from "@/use/utils/use-route-query"

/** @typedef {{ key: string; order?: boolean | "asc" | "desc" }} SortItem */

const KEY_ORDER_SEPARATOR = "."
const LAST_DOT_REGEX = /\.(?=[^.]+$)/
const VALUE_SEPARATOR = ","

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
      newSortBy = newSortBy.split(VALUE_SEPARATOR)
    }

    return newSortBy.map((entry) => {
      const [key, order] = entry.split(LAST_DOT_REGEX)
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

    const remapedValue = sortByValue.map(({ key, order }) => `${key}${KEY_ORDER_SEPARATOR}${order}`)
    const stringifiedValue = remapedValue.join(VALUE_SEPARATOR)
    return stringifiedValue
  }

  const defaultValueString = stringify(defaultValue)
  return useRouteQuery(name, defaultValueString, {
    transform: {
      get: parse,
      set: stringify,
    },
  })
}

export default useVuetifySortByToSafeRouteQuery
