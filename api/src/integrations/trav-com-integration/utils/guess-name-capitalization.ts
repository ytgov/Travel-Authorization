import { isEmpty, isNil } from "lodash"

function guessNameCapitalization(name: string | null | undefined): string {
  if (isNil(name) || isEmpty(name)) return ""

  return name
    .toLowerCase()
    .split("-")
    .map((part) => {
      if (/^mac/i.test(part)) {
        // Handle Mac variations: MacDonald, MacIntyre
        return "Mac" + part.slice(3).charAt(0).toUpperCase() + part.slice(4)
      }
      if (/^mic/i.test(part)) {
        // Handle Mic variations: MicIntyre, MicAllister
        return "Mic" + part.slice(3).charAt(0).toUpperCase() + part.slice(4)
      }
      if (/^mc/i.test(part)) {
        // Handle Mc variations: McDonald, McLaren
        return "Mc" + part.slice(2).charAt(0).toUpperCase() + part.slice(3)
      }

      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join("-")
    .split("'")
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join("'")
    .split(" ")
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(" ")
}

export default guessNameCapitalization
