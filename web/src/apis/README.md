# APIs

APIs provide a way to map back-end endpoints to standard create/read/update/delete (CRUD) actions in the front-end. They handle api setup and data transformation. This lets them remain very simple and flexible if data needs to be transformed to match a new format from the backend, before the front-end gets updated to handle the new format.

e.g.

```javascript
// apis/forms-api.js
import http from "@/apis/http-client"

export const formsApi = {
  create(attributes) {
    return http.post("/api/forms", attributes).then(({ data }) => data)
  },
}

export default formsApi
```

The above code handles all access to the /api/forms endpoint, and since we are using axios it strips out the extra "data" attribute that axious wraps around the request.

This gives a single location to update if the backend naming convention changes.
