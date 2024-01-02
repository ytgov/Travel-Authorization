import { reactive, toRefs } from "vue"

import expensesApi, { TYPES, EXPENSE_TYPES } from "@/api/expenses-api"

export function useExpenses() {
  const state = reactive({
    expenses: [],
    isLoading: false,
    isErrored: false,
    isCached: false,
  })

  async function fetch({ where, page, perPage, ...otherParams } = {}) {
    state.isLoading = true
    try {
      const { expenses } = await expensesApi.list({ where, page, perPage, ...otherParams })
      state.isErrored = false
      state.expenses = expenses
      return expenses
    } catch (error) {
      console.error("Failed to fetch expenses:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  return {
    TYPES,
    EXPENSE_TYPES,
    ...toRefs(state),
    fetch,
  }
}

export default useExpenses
