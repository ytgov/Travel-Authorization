import { isEmail as isEmailValidator } from "validator"

export const isEmail = (value) => {
  return isEmailValidator(value) || "Invalid e-mail."
}

export default isEmail
