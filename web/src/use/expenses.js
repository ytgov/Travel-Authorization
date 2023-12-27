import { ref, computed } from "vue"

import expensesApi, { TYPES, EXPENSE_TYPES } from "@/api/expenses-api"

export const useExpenses = () => {
  const expenses = ref([])
  const isLoading = ref(false)
  const isErrored = ref(false)
  const isCached = ref(false)

  const estimates = computed(() => expenses.value.filter((item) => item.type === TYPES.ESTIMATE))

  async function ensure({ where, page, perPage, ...otherParams } = {}) {
    if (isCached.value) return expenses.value

    return fetch({ where, page, perPage, ...otherParams })
  }

  async function fetch({ where, page, perPage, ...otherParams } = {}) {
    isLoading.value = true
    try {
      const { expenses } = await expensesApi.list({ where, page, perPage, ...otherParams })
      isErrored.value = false
      expenses.value = expenses
      isCached.value = true
      return expenses
    } catch (error) {
      console.error("Failed to fetch expenses:", error)
      isErrored.value = true
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    TYPES,
    EXPENSE_TYPES,
    expenses,
    isLoading,
    isErrored,
    estimates,
    ensure,
    fetch,
  }
}

export default useExpenses
