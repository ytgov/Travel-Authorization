import { isUndefined } from "lodash"

/**
 * Transforms a string to an integer or returns null if the value is nil.
 *
 * @type {{
 *   get: (value: string | undefined) => T | null | undefined,
 *   set: (value: T | null | undefined) => string,
 * }}
 */
export const jsonTransformer = {
  get(value) {
    if (isUndefined(value) || value === "") return undefined

    return JSON.parse(value)
  },
  set(value) {
    if (isUndefined(value)) return ""

    return JSON.stringify(value)
  },
}

export default jsonTransformer
