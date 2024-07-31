import { isNull } from "lodash"
import { Op } from "sequelize"
import express, { Request, Response } from "express"

import logger from "@/utils/logger"
import { RequiresRoleAdmin } from "@/middleware"
import { RequiresRoleTdUser } from "@/middleware"
import { User } from "@/models"
import { YkGovernmentDirectorySyncService } from "@/services"
import { UsersSerializer } from "@/serializers"

export const userRouter = express.Router()

userRouter.get("/me", async (req: Request, res: Response) => {
  const user = req.user

  // See api/src/controllers/users/yg-government-directory-sync-controller.ts for force sync endpoint
  if (!user.isTimeToSyncWithEmployeeDirectory()) {
    const serializedUser = UsersSerializer.asDetailed(user)
    return res.status(200).json({ user: serializedUser })
  }

  return YkGovernmentDirectorySyncService.perform(user).then((user) => {
    const serializedUser = UsersSerializer.asDetailed(user)
    return res.status(200).json({ user: serializedUser })
  })
})

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    let users = await User.findAll()
    res.status(200).json(users)
  } catch (error: any) {
    logger.info(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.get("/travel-desk-users", RequiresRoleTdUser, async (req: Request, res: Response) => {
  try {
    // TODO: update the front-end so renaming is no longer needed
    const users = await User.findAll({
      attributes: ["email", "firstName", "lastName"],
      where: {
        status: User.Statuses.ACTIVE,
        roles: {
          [Op.contains]: [User.Roles.TRAVEL_DESK_USER],
        },
      },
    })

    res.status(200).json(users)
  } catch (error: any) {
    logger.info(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.put(
  "/:id/permissions",
  /* RequiresRoleAdmin, */ async (req: Request, res: Response) => {
    try {
      logger.info("body", {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        department: req.body.departments,
        roles: req.body.roles,
      })
      await User.update(
        {
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          department: req.body.departments,
          roles: req.body.roles,
        },
        { where: { id: req.params.id } }
      )
      res.status(200).json("Saved permissions")
    } catch (error: any) {
      logger.info(error)
      res.status(500).json("Internal Server Error")
    }
  }
)

userRouter.get("/:id/permissions", async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (isNull(user)) {
      return res.status(404).json({ message: "User not found" })
    }

    let permissions = {
      first_name: user.firstName,
      last_name: user.lastName,
      departments: user.department,
      roles: user.roles,
    }
    res.status(200).json(permissions)
  } catch (error: any) {
    logger.info(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (isNull(user)) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error: any) {
    logger.info(error)
    res.status(500).json("Internal Server Error")
  }
})
