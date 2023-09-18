import { securePost } from "@/store/jwt"

export const formsApi = {
  create(attributes) {
    return securePost("/api/forms", attributes).then(({ data }) => data)
  },
}

export default formsApi
