/** See api/src/models/general-ledger-coding.ts -> code -> validate  */
export const isGeneralLedgerCode = (v) =>
  /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{6}-\d{4}(?:-[a-zA-Z0-9]{1,4}(?:-[a-zA-Z0-9]{1,5})?)?$/.test(v) ||
  "Code must be in the format: vote (3 characters) - Program (6 characters) - object code (4 digits) - subledger-1 (0-4 characters) - subleger-2 (0-5 characters)"

export default isGeneralLedgerCode
