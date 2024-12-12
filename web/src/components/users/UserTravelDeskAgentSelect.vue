<template>
  <v-select
    :value="value"
    :items="usersDisplayNames"
    :label="label"
    :loading="isLoading"
    v-bind="$attrs"
    @input="emit('input', $event)"
    v-on="$listeners"
  />
</template>

<script setup>
import { computed } from "vue"

import { MAX_PER_PAGE } from "@/api/base-api"
import useUsers from "@/use/use-users"

/** @typedef {import('@/api/users-api.js').UserWhereOptions} UserWhereOptions */
/** @typedef {import('@/api/users-api.js').UserFiltersOptions} UserFiltersOptions */

/**
 * Defines component props with descriptions and types using JSDoc.
 *
 * @type {{
 *   value: number | null,
 *   where?: UserWhereOptions,
 *   filters?: UserFiltersOptions
 * }}
 */
defineProps({
  value: {
    type: String,
    default: () => null,
  },
  label: {
    type: String,
    default: "Travel Desk Agent",
  },
})

/**
 * @type {{
 *   input: [userDisplayName: string | null]
 * }}
 */
const emit = defineEmits(["input"])

const usersQuery = computed(() => ({
  filters: {
    isTravelDeskUser: true,
  },
  // TODO: replace max per page with search feature
  perPage: MAX_PER_PAGE,
}))
const { users, isLoading } = useUsers(usersQuery)

const usersDisplayNames = computed(() =>
  users.value.map(({ firstName, lastName }) => [firstName, lastName].filter(Boolean).join(" "))
)
</script>
