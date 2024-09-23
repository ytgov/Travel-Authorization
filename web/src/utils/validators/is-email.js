import { isEmpty, isNil, isUndefined } from "lodash"
import { isEmail as isEmailValidator } from "validator"

export const isEmail = (value) => {
  if (isNil(value) || isUndefined(value) || isEmpty(value)) {
    return true
  }

  return isEmailValidator(value) || "Invalid e-mail."
}

export default isEmail
