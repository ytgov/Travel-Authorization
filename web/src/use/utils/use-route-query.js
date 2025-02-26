import { customRef, nextTick, watch } from "vue-demi"
import { toValue, tryOnScopeDispose } from "@vueuse/shared"
import { useRoute, useRouter } from "vue2-helpers/vue-router"

export * from "@/utils/use-route-query-transformers"

/** @typedef {import("vue-router").RouteParamValueRaw | string[]} RouteQueryValueRaw */

const _queue = new WeakMap()

/**
 * See https://vueuse.org/router/useRouteQuery/ (v12.5.0)
 *
 * Code back-ported from https://github.com/vueuse/vueuse/blob/1e153e936a6055d633becd3a685603b4492d8791/packages/router/useRouteQuery/index.ts
 * @template [T=RouteQueryValueRaw]
 * @template [K=T]
 * @callback UseRouteQuery
 * @param {string} name
 * @param {import("@vueuse/shared").MaybeRefOrGetter<T>} defaultValue
 * @param {{
 *   mode?: import("@vueuse/shared").MaybeRef<"replace" | "push">,
 *   route?: import("vue-router").Route,
 *   router?: import("vue-router").Router,
 *   transform?: ((value: T) => K) | {
 *     get?: (value: T) => K,
 *     set?: (value: K) => T
 *   }
 * }} [options]
 * @returns {import("vue").Ref<K>}
 */
export function useRouteQuery(name, defaultValue, options = {}) {
  const { mode = "replace", route = useRoute(), router = useRouter(), transform } = options

  let transformGet = (value) => value
  let transformSet = (value) => value

  if (typeof transform === "function") {
    transformGet = transform
  } else if (transform) {
    if (transform.get) {
      transformGet = transform.get
    }
    if (transform.set) {
      transformSet = transform.set
    }
  }

  if (!_queue.has(router)) {
    _queue.set(router, new Map())
  }

  const _queriesQueue = _queue.get(router)

  let query = route.query[name]

  tryOnScopeDispose(() => {
    query = undefined
  })

  /** @type {() => void} */
  let _trigger

  const proxy = customRef((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        return transformGet(query !== undefined ? query : toValue(defaultValue))
      },
      set(v) {
        v = transformSet(v)

        if (query === v) return

        query = v === toValue(defaultValue) ? undefined : v
        _queriesQueue.set(name, v === toValue(defaultValue) ? undefined : v)

        trigger()

        nextTick(() => {
          if (_queriesQueue.size === 0) return

          const newQueries = Object.fromEntries(_queriesQueue.entries())
          _queriesQueue.clear()

          const { params, query, hash } = route

          // Check if the new query is actually different before navigating
          const newQueryParams = { ...query, ...newQueries }
          if (JSON.stringify(newQueryParams) === JSON.stringify(route.query)) {
            return // Stop navigation if nothing changed
          }

          router[toValue(mode)]({
            params,
            query: newQueryParams,
            hash,
          })
          // If you actually want to try to debug the nav duplication error, use the following.
          // .catch((error) => {
          //   if (error.name === "NavigationDuplicated") {
          //     console.warn(error)
          //   } else {
          //     console.error(error)
          //   }
          // })
        })
      },
    }
  })

  watch(
    () => route.query[name],
    (v) => {
      if (query === transformGet(v)) return

      query = v

      _trigger()
    },
    { flush: "sync" }
  )

  return proxy
}

export default useRouteQuery
