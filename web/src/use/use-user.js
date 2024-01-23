import { reactive, toRefs, unref, watch } from "vue"
import { isNumber } from "lodash"

import usersApi from "@/api/users-api"
import { useGlobalFactory } from "@/use/helper-utils"

const globalState = new Map()

/**
 * This stores a global user state per id.
 *
 * @param {import('vue').Ref<number>} userId
 */
export function useGlobalUser(userId) {
  const useGlobalUserFunction = useGlobalFactory(globalState, useUser)
  return useGlobalUserFunction(userId)
}

/**
 * This function retrieves and processes user data based on a given user ID.
 *
 * @param {import('vue').Ref<number>} userId
 */
export function useLocalUser(userId) {
  const state = reactive({
    user: {},
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { user } = await usersApi.get(unref(userId))
      state.isErrored = false
      state.user = user
      return user
    } catch (error) {
      console.error("Failed to fetch user:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(userId),
    async (newUserId) => {
      if (!isNumber(newUserId)) return

      await fetch()
    },
    {
      immediate: true,
    }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export function useUser(userId, { global = false } = {}) {
  if (global) {
    return useGlobalUser(userId)
  } else {
    return useLocalUser(userId)
  }
}

export default useUser
