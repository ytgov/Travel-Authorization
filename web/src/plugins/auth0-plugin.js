import { Auth0Client } from "@auth0/auth0-spa-js"

import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN, ENVIRONMENT } from "@/config"

export const auth0 = new Auth0Client({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: AUTH0_AUDIENCE,
    redirect_uri: window.location.origin,
  },
  cacheLocation: ENVIRONMENT === "development" ? "localstorage" : "memory",
})

export default auth0
