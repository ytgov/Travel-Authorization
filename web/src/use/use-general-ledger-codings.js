import { reactive, toRefs, unref, watch } from "vue"

import generalLedgerCodingsApi from "@/api/general-ledger-codings-api"

/**
 * TODO: add other fields
 * @typedef {Object} GeneralLedgerCoding
 * @property {number} id
 */

/**
 * Fetches and manages expenses data based on the provided options.
 *
 * @param {import('vue').Ref<{
 *   where: { [key: string]: any },
 * }>} [options={}] - The configuration options for fetching expenses, wrapped in a Vue ref.
 * @returns {{
 *   generalLedgerCodings: import('vue').Ref<GeneralLedgerCoding[]>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   fetch: () => Promise<GeneralLedgerCoding[]>,
 * }}
 */
export function useGeneralLedgerCodings(options = {}) {
  const state = reactive({
    generalLedgerCodings: [],
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { generalLedgerCodings } = await generalLedgerCodingsApi.list(unref(options))
      state.isErrored = false
      state.generalLedgerCodings = generalLedgerCodings
      return generalLedgerCodings
    } catch (error) {
      console.error("Failed to fetch general ledger codings:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(options),
    async () => {
      await fetch()
    },
    {
      immediate: true,
      deep: true,
    }
  )

  return {
    ...toRefs(state),
    fetch,
  }
}

export default useGeneralLedgerCodings
