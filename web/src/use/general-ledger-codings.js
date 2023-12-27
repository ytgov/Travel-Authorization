import { reactive, toRefs } from "vue"

import generalLedgerCodingsApi from "@/api/general-ledger-codings-api"

export function useGeneralLedgerCodings() {
  const state = reactive({
    generalLedgerCodings: [],
    isLoading: false,
    isErrored: false,
    isCached: false,
  })

  async function fetch({ where, page, perPage, ...otherParams } = {}) {
    state.isLoading = true
    try {
      const { generalLedgerCodings } = await generalLedgerCodingsApi.list({
        where,
        page,
        perPage,
        ...otherParams,
      })
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

  return {
    ...toRefs(state),
    fetch,
  }
}

export default useGeneralLedgerCodings
