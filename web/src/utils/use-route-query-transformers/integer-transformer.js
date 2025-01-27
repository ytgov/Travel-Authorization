import { isNil } from "lodash"

/**
 * Transforms a string to an integer or returns null if the value is nil.
 *
 * @type {{
 *   get: (value: string | null | undefined) => number | null,
 *   set: (value: number | null) => string | null,
 * }}
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
