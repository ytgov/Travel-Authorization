export const greaterThanOrEqualToDate =
  (b, { referenceFieldLabel }) =>
  (a) =>
    new Date(a) >= new Date(b) ||
    `This field must be greater than or equal to ${b || referenceFieldLabel}`

export default greaterThanOrEqualToDate
