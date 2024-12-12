import { reactive, ref, toRefs, unref, watch } from "vue"

import usersApi from "@/api/users-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/users-api.js').User} User */
/** @typedef {import('@/api/users-api.js').UserQueryOptions} UserQueryOptions */

/**
 * @callback UseUsers
 * @param {Ref<UserQueryOptions>} [options=ref({})] - Configuration options containing filters and pagination settings for fetching users.
 * @param {{
 *  skipWatchIf?: () => boolean;
 * }} [config={ skipWatchIf = () => false } = {}] - Configuration to conditionally skip API calls.
 * @returns {{
 *   users: Ref<User[]>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   fetch: () => Promise<User[]>,
 *   refresh: () => Promise<User[]>,
 * }}
 */

/** @type {UseUsers} */
export function useUsers(options = ref({}), { skipWatchIf = () => false } = {}) {
  const state = reactive({
    users: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch() {
    state.isLoading = true
    try {
      const { users, totalCount } = await usersApi.list(unref(options))
      state.isErrored = false
      state.users = users
      state.totalCount = totalCount
      return users
    } catch (error) {
      console.error("Failed to fetch users:", error)
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

export default useUsers
