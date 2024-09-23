import { isMobilePhone } from "validator"

export const isPhoneNumber = (value) => {
  return isMobilePhone(value) || "Invalid phone number"
}

export default isPhoneNumber
