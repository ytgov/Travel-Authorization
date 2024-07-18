import { type NextFunction, type Response } from "express"
import { type Request as JwtRequest } from "express-jwt"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { User } from "@/models"

import auth0Integration, { Auth0PayloadError } from "@/integrations/auth0-integration"

import sequelize from "@/models"

export type AuthorizationRequest = JwtRequest & {
  user?: User
}

async function findUserFromAuth0Subject(auth0Subject: string): Promise<User | null> {
  return User.findOne({ where: { sub: auth0Subject } })
}

export async function ensureUserFromAuth0Token(token: string): Promise<User> {
  const { auth0Subject, email, firstName, lastName } = await auth0Integration.getUserInfo(token)
  const user = await findUserFromAuth0Subject(auth0Subject)

  if (!isNil(user)) {
    return user
  }

  const newUser = await sequelize.transaction(async (transaction) => {
    const existingUser = await User.findOne({
      where: { sub: auth0Subject },
      transaction,
    });

    if (existingUser) {
      return existingUser;
    }
    const newUser = await User.create({
      sub: auth0Subject,
      email: email,
      firstName: firstName,
      lastName: lastName,
      roles: [User.Roles.USER],
      status: User.Statuses.ACTIVE,
    }, { transaction })
  
    logger.info(`CREATED USER FOR ${email}: ${JSON.stringify(newUser.dataValues)}`)
    return newUser
  })

  return newUser
}

export async function authorizationMiddleware(
  req: AuthorizationRequest,
  res: Response,
  next: NextFunction
) {
  const user = await User.findOne({ where: { sub: req.auth?.sub } })

  if (!isNil(user)) {
    req.user = user
    return next()
  }

  try {
    const token = req.headers.authorization || ""
    const user = await ensureUserFromAuth0Token(token)
    req.user = user
    return next()
  } catch (error) {
    if (error instanceof Auth0PayloadError) {
      logger.info(error)
      return res.status(502).json({ message: "External authorization api failed." })
    } else {
      return res.status(401).json({ message: "User authentication failed." })
    }
  }
}

export default authorizationMiddleware
