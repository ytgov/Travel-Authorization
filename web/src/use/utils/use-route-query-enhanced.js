import { computed } from "vue"
import { useRouteQuery } from "@/use/utils/use-route-query"

/** @typedef {import("vue-router").RouteParamValueRaw | string[]} RouteQueryValueRaw */

/**
 * Enhanced useRouteQuery with parse and stringify transformations
 *
 * See https://github.com/vueuse/vueuse/blob/0f11df11962f5f2e912d66c8544bc6767630780a/packages/router/useRouteQuery/index.ts
 * @template [T=RouteQueryValueRaw]
 * @template [K=T]
 * @callback UseRouteQueryEnhanced
 * @param {string} name
 * @param {import("@vueuse/shared").MaybeRefOrGetter<T>} defaultValue
 * @param {{
 *   parse: (value: T) => K,
 *   stringify: (value: K) => T
 * }} options
 * @returns {import("vue").Ref<K>}
 */

/**
 * @type {UseRouteQueryEnhanced}
 *
 * @deprecated - prefer web/src/use/utils/use-route-query.js, now that it supports get/set https://github.com/icefoganalytics/travel-authorization/commit/3114b0751c59387037851abf011d3ad070b1008c
 */
export function useRouteQueryEnhanced(name, defaultValue, options) {
  const query = useRouteQuery(name, defaultValue)

  return computed({
    get() {
      return options.parse(query.value)
    },
    set(value) {
      query.value = options.stringify(value)
    },
  })
}

/** * @deprecated - prefer web/src/use/utils/use-route-query.js, now that it supports get/set https://github.com/icefoganalytics/travel-authorization/commit/3114b0751c59387037851abf011d3ad070b1008c */
export default useRouteQueryEnhanced
