// TODO: replace this with a standard validation library

export const required = (v) => !!v || "This field is required"

export default {
  required,
}
