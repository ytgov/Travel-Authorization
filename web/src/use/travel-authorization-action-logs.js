import { reactive, toRefs, unref } from "vue"

import travelAuthorizationActionLogsApi from "@/api/travel-authorization-action-logs-api"

export function useTravelAuthorizationActionLogs({ where } = {}) {
  const state = reactive({
    travelAuthorizationActionLogs: [],
    isLoading: true,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { travelAuthorizationActionLogs } = await travelAuthorizationActionLogsApi.list({
        where: unref(where),
      })
      state.travelAuthorizationActionLogs = travelAuthorizationActionLogs
    } catch (error) {
      state.isErrored = true
    } finally {
      state.isLoading = false
    }
  }

  return {
    ...toRefs(state),
    fetch,
  }
}
