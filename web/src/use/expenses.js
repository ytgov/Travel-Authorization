import { isEmpty } from "lodash"
import { reactive, computed, toRefs } from "vue"

import expensesApi, { TYPES, EXPENSE_TYPES } from "@/api/expenses-api"

export const useExpenses = () => {
  const state = reactive({
    expenses: [],
    isLoading: false,
    isErrored: false,
    isCached: false,
  })

  const estimates = computed(() => state.expenses.filter((item) => item.type === TYPES.ESTIMATE))

  async function ensure({ where, page, perPage, ...otherParams } = {}) {
    if (state.isCached) return state.expenses

    return fetch({ where, page, perPage, ...otherParams })
  }

  async function fetch({ where, page, perPage, ...otherParams } = {}) {
    state.isLoading = true
    try {
      const { expenses } = await expensesApi.list({ where, page, perPage, ...otherParams })
      state.isErrored = false
      state.expenses = expenses
      state.isCached = !isEmpty(expenses)
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
    estimates,
    ensure,
    fetch,
  }
}

export default useExpenses
