// TODO: replace this with a standard validation library

import { isArray, isEmpty, isString, isNull, isObject, isUndefined } from "lodash"
import { isEmail as isEmailValidator, isMobilePhone } from "validator"

export const required = (v) => {
  if (isNull(v) || isUndefined(v)) {
    return "This field is required"
  }

  if ((isArray(v) || isString(v) || isObject(v)) && isEmpty(v)) {
    return "This field is required"
  }

  return true
}

export const isInteger = (v) =>
  v == 0 || Number.isInteger(Number(v)) || "This field must be a number"

export const greaterThanOrEqualToDate =
  (b, { referenceFieldLabel }) =>
  (a) =>
    new Date(a) >= new Date(b) ||
    `This field must be greater than or equal to ${b || referenceFieldLabel}`

// See api/src/models/general-ledger-coding.ts -> code -> validate
export const isGeneralLedgerCode = (v) =>
  /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{6}-\d{4}(?:-[a-zA-Z0-9]{1,4}(?:-[a-zA-Z0-9]{1,5})?)?$/.test(v) ||
  "Code must be in the format: vote (3 characters) - Program (6 characters) - object code (4 digits) - subledger-1 (0-4 characters) - subleger-2 (0-5 characters)"

export const isPhoneNumber = (value) => {
  return isMobilePhone(value) || "Invalid phone number"
}

export const isEmail = (value) => {
  return isEmailValidator(value) || "Invalid e-mail."
}

export default {
  greaterThanOrEqualToDate,
  isEmail,
  isGeneralLedgerCode,
  isPhoneNumber,
  required,
}
