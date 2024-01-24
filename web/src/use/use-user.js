import { reactive, toRefs, unref, watch } from "vue"
import { isNumber } from "lodash"

import usersApi from "@/api/users-api"
import { defineUse } from "@/use/helper-utils"

/**
 * TODO: add other user fields
 * @typedef {Object} User
 * @property {number} id
 */

/**
 * This stores a global user state per id.
 *
 * @callback UseUser
 * @param {import('vue').Ref<number>} userId
 * @returns {{
 *   user: import('vue').Ref<User>,
 *   isLoading: import('vue').Ref<boolean>,
 *   isErrored: import('vue').Ref<boolean>,
 *   fetch: () => Promise<User>,
 *   refresh: () => Promise<User>,
 * }}
 */

/** @type {UseUser} */
export const useUser = defineUse((userId) => {
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
})

export default useUser
