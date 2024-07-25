import { computed, reactive, toRefs } from "vue"

import usersApi, { ROLES } from "@/api/users-api"

/**
 * @template [T=any]
 * @typedef {import('vue').Ref<T>} Ref
 */
/** @typedef {import('@/api/users-api.js').User} User */

// Note that state is global here
const state = reactive({
  currentUser: {
    roles: [],
  },
  isLoading: false,
  isErrored: false,
  isCached: false,
})

/**
 * This stores the global current user state.
 * Does not load current user until fetch is ran; however,
 * fetch is run in App, so currentUser will effectively always be ready in all inner components.
 *
 * @returns {{
 *   ROLES: typeof ROLES,
 *   currentUser: Ref<User>,
 *   isLoading: Ref<boolean>,
 *   isErrored: Ref<boolean>,
 *   isCached: Ref<boolean>,
 *   isReady: Ref<boolean>,
 *   fullName: Ref<string>,
 *   isAdmin: Ref<boolean>,
 *   fetch: () => Promise<User>,
 *   unset: () => void,
 * }}
 */
export function useCurrentUser() {
  const isReady = computed(() => state.isCached && !state.isLoading && !state.isErrored)

  const fullName = computed(() => {
    const { firstName, lastName } = state.currentUser
    return [firstName, lastName].filter(Boolean).join(" ")
  })
  const isAdmin = computed(() => state.currentUser.roles?.includes(ROLES.ADMIN))

  async function fetch() {
    state.isLoading = true
    try {
      const { user } = await usersApi.me()
      state.isErrored = false
      state.currentUser = user
      state.isCached = true
      return user
    } catch (error) {
      console.error("Failed to fetch current user:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  function unset() {
    state.currentUser = {
      roles: [],
    }
    state.isLoading = false
    state.isErrored = false
    state.isCached = false
  }

  return {
    ROLES,
    // getters
    ...toRefs(state),
    isReady,
    fullName,
    isAdmin,
    // actions
    fetch,
    unset,
  }
}

export default useCurrentUser
