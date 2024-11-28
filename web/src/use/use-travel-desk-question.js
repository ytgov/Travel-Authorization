import { reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import travelDeskQuestionsApi from "@/api/travel-desk-questions-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/base-api.js').Policy} Policy */
/** @typedef {import('@/api/travel-desk-questions-api.js').TravelDeskQuestion} TravelDeskQuestion */

/**
 * @callback UseTravelDeskQuestion
 * @param {Ref<number | null | undefined>} id
 * @returns {{
 *   travelDeskQuestion: Ref<TravelDeskQuestion | null>,
 *   policy: Ref<Policy | null>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskQuestion>,
 *   refresh: () => Promise<TravelDeskQuestion>,
 * }}
 */

/** @type {UseTravelDeskQuestion} */
export function useTravelDeskQuestion(id) {
  const state = reactive({
    travelDeskQuestion: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { data: travelDeskQuestion, policy } = await travelDeskQuestionsApi.show(unref(id))
      state.isErrored = false
      state.travelDeskQuestion = travelDeskQuestion
      state.policy = policy
      return travelDeskQuestion
    } catch (error) {
      console.error("Failed to fetch travel desk question:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
    async (newId) => {
      if (isNil(newId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useTravelDeskQuestion
