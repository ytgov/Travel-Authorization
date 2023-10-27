import { NextFunction, Request, Response } from "express"
import jwt from "express-jwt"
import axios from "axios"
import jwksRsa from "jwks-rsa"

import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "@/config"
import { User } from "@/models"
import { isNil } from "lodash"

console.log("AUTH0_DOMAIN", `${AUTH0_DOMAIN}/.well-known/jwks.json`)

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: AUTH0_AUDIENCE,
  issuer: [`${AUTH0_DOMAIN}/`],
  algorithms: ["RS256"],
})

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  const sub = req.user.sub
  const token = req.headers.authorization || ""

  const user = await User.findOne({ where: { sub } })
  if (user !== null) {
    const userAttributes = user.dataValues as any
    userAttributes.displayName = `${userAttributes.firstName} ${userAttributes.lastName}`
    userAttributes.roles = userAttributes.roles
    req.user = {
      ...req.user,
      ...userAttributes,
    }
    return next()
  }

  return axios
    .get(`${AUTH0_DOMAIN}/userinfo`, {
      headers: {
        authorization: token,
      },
    })
    .then(async ({ data }) => {
      if (isNil(data.sub)) {
        console.log("Payload from Auth0 is strange or failed for", req.user)
        return res
          .status(502)
          .json({ message: "Payload returned from authorization service is malformed" })
      }

      const { email, given_name: firstName, family_name: lastName } = data.email

      const user = await User.findOne({ where: { sub } })
      if (!isNil(user)) {
        const userAttributes = user.dataValues as any
        userAttributes.displayName = `${userAttributes.firstName} ${userAttributes.lastName}`
        req.user = {
          ...req.user,
          ...userAttributes,
        }
        return next()
      }

      const fallbackEmail = `${firstName}.${lastName}@yukon-no-email.ca`
      const newUser = await User.create({
        sub,
        email: email || fallbackEmail,
        firstName,
        lastName,
        roles: [User.Roles.USER],
        status: User.Statuses.ACTIVE,
      })

      const newUserAttributes = newUser.dataValues as any
      console.log("CREATED USER FOR " + email, newUserAttributes)
      req.user = {
        ...req.user,
        ...newUserAttributes,
      }

      return next()
    })
    .catch((error) => {
      console.log("ERROR pulling userinfo from Auth0", error)
      return res.status(502).json({ message: "Error pulling user info from authorization service" })
    })
}
