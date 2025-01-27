import { isNil } from "lodash"

/**
 * Transforms a string to a boolean or returns null if the value is nil.
 * Assumes that useRouteQuery "default" value is a boolean, not a string.
 *
 * @type {{
 *   get: (value: string | null | undefined) => boolean | null,
 *   set: (value: boolean | null) => boolean | null,
 * }}
 */
export const booleanTransformer = {
  get(value) {
    if (isNil(value)) return null

    return Boolean(value)
  },
  set(value) {
    if (isNil(value)) return null

    return Boolean(value)
  },
}

export default booleanTransformer
