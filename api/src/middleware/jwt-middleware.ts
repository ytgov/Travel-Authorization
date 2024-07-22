import { expressjwt as jwt } from "express-jwt"
import jwksRsa, { type GetVerificationKey } from "jwks-rsa"

import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "@/config"
import logger from "@/utils/logger"

logger.debug(`AUTH0_DOMAIN=${AUTH0_DOMAIN}/.well-known/jwks.json`)

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as GetVerificationKey,

  // Validate the audience and the issuer.
  audience: AUTH0_AUDIENCE,
  issuer: [`${AUTH0_DOMAIN}/`],
  algorithms: ["RS256"],
})

export default checkJwt
