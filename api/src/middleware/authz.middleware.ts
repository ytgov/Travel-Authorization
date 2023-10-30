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

interface Auth0Response {
  sub: string // "auth0|6241ec44e5b4a700693df293"
  given_name: string // "Jane"
  family_name: string // "Doe"
  nickname: string // "Jane"
  name: string // "Jane Doe"
  picture: string // https://s.gravatar.com/avatar/1234567890abcdef1234567890abcdef?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fmb.png
  updated_at: string // "2023-10-30T17:25:52.975Z"
  email: string // "janedoe@gmail.com"
  email_verified: boolean // true
}

function findOrCreateUserFromAuth0Token(token: string): Promise<User> {
  return axios
    .get(`${AUTH0_DOMAIN}/userinfo`, {
      headers: {
        authorization: token,
      },
    })
    .then(async ({ data }: { data: Auth0Response }) => {
      const sub = data.sub
      if (isNil(sub)) {
        throw new Error(`Payload from Auth0 is strange or failed for: ${JSON.stringify(data)}`)
      }

      const { email, given_name: firstName, family_name: lastName } = data

      const user = await User.findOne({ where: { sub } })
      if (!isNil(user)) {
        return user
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
      console.log(`CREATED USER FOR ${email}: ${JSON.stringify(newUser.dataValues)}`)

      return newUser
    })
}

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  const sub = req.user.sub

  const user = await User.findOne({ where: { sub } })
  if (user !== null) {
    req.user = user
    return next()
  }

  const token = req.headers.authorization || ""
  return findOrCreateUserFromAuth0Token(token)
    .then((user) => {
      req.user = user
      return next()
    })
    .catch((error) => {
      console.log("ERROR pulling userinfo from Auth0", error)
      return res.status(502).json({ message: "Error pulling user info from authorization service" })
    })
}
