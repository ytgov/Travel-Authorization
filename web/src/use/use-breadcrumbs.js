import { reactive, toRefs } from "vue"
import { isEmpty } from "lodash"

/**
 * TODO: add other fields
 * @typedef {Object} BreadcrumbItem
 * @property {string} title
 * @property {Object} to
 * @property {string} to.name
 */

const BASE_CRUMB = {
  text: "Dashboard",
  to: {
    name: "Dashboard",
  },
}

const state = reactive({
  breadcrumbs: [],
})

/**
 * This stores a global breadcrumb state.
 *
 * @callback UseBreadcrumbs
 * @param {BreadcrumbItem[]} [breadcrumbs=[]]
 * @returns {{
 *   breadcrumbs: import('vue').Ref<BreadcrumbItem[]>,
 * }}
 */

/** @type {UseBreadcrumbs} */
export function useBreadcrumbs(breadcrumbs = []) {
  if (!isEmpty(breadcrumbs)) {
    state.breadcrumbs = [BASE_CRUMB, ...breadcrumbs]
  }

  return {
    ...toRefs(state),
  }
}

export default useBreadcrumbs
