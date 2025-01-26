import { isNil } from "lodash"

/**
 * Transforms a string to an integer or returns null if the value is nil.
 *
 * @param {string | null | undefined} value - The value to transform.
 * @returns {number | null} - The transformed integer or null if the value is nil.
 */
export const integerTransformer = {
  get(value) {
    if (isNil(value)) return null

    return parseInt(value, 10)
  },
  set(value) {
    if (isNil(value)) return null

    return value.toString()
  },
}

export default integerTransformer
