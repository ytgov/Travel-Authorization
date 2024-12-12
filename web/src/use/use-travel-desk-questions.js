import { reactive, toRefs, ref, unref, watch } from "vue"

import travelDeskQuestionsApi, {
  TRAVEL_DESK_QUESTION_REQUEST_TYPES,
} from "@/api/travel-desk-questions-api"

export { TRAVEL_DESK_QUESTION_REQUEST_TYPES }

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/travel-desk-questions-api.js').TravelDeskQuestion} TravelDeskQuestion */
/** @typedef {import('@/api/travel-desk-questions-api.js').TravelDeskQuestionQueryOptions} TravelDeskQuestionQueryOptions */

/**
 * Provides reactive state management for travel desk questions with API integration.
 *
 * @callback UseTravelDeskQuestions
 * @param {Ref<TravelDeskQuestionQueryOptions>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching travel desk questions.
 * @param {{
 *  skipWatchIf?: () => boolean;
 * }} [config={ skipWatchIf = () => false } = {}] - Configuration to conditionally skip API calls.
 * @returns {{
 *   travelDeskQuestions: Ref<TravelDeskQuestion[]>,
 *   totalCount: Ref<number>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<TravelDeskQuestion[]>,
 *   refresh: () => Promise<TravelDeskQuestion[]>
 * }}
 */

/** @type {UseTravelDeskQuestions} */
export function useTravelDeskQuestions(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    travelDeskQuestions: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelDeskQuestions, totalCount } = await travelDeskQuestionsApi.list(unref(options))
      state.isErrored = false
      state.travelDeskQuestions = travelDeskQuestions
      state.totalCount = totalCount
      return travelDeskQuestions
    } catch (error) {
      console.error("Failed to fetch travel desk questions:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => [skipWatchIf(), unref(options)],
    async ([skip]) => {
      if (skip) return

      await fetch()
    },
    { deep: true, immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useTravelDeskQuestions
