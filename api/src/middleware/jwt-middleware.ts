import { expressjwt as jwt } from "express-jwt"
import { NextFunction, Request, Response } from "express"
import jwksRsa, { type GetVerificationKey } from "jwks-rsa"

import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "@/config"
import logger from "@/utils/logger"

logger.debug(`AUTH0_DOMAIN=${AUTH0_DOMAIN}/.well-known/jwks.json`)

const baseCheckJwtMiddleware = jwt({
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

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    return baseCheckJwtMiddleware(req, res, (error) => {
      if (error) {
        logger.error(`JWT validation failed: ${error}`, {
          error,
        })
        return res.status(500).json({
          message: `JWT validation failed: ${error}`,
        })
      }
      next()
    })
  } catch (error) {
    logger.error(`JWT middleware failed: ${error}`, {
      error,
    })
    return res.status(500).json({
      message: `JWT middleware failed: ${error}`,
    })
  }
}

export default jwtMiddleware
