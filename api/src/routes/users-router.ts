import { isNil, isNull } from "lodash"
import { Op } from "sequelize"
import express, { Request, Response } from "express"

import { RequiresRoleAdmin } from "@/middleware"
import { RequiresRoleTdUser } from "@/middleware"
import { User } from "@/models"
import { YkGovernmentDirectorySyncService } from "@/services"
import { UsersSerializer } from "@/serializers"

export const userRouter = express.Router()

userRouter.get("/me", async (req: Request, res: Response) => {
  const user = req.user

  if (!user.isTimeToSyncWithEmployeeDirectory()) {
    const serializedUser = UsersSerializer.asDetailed(user)
    return res.status(200).json({ user: serializedUser })
  }

  // TODO: add a force sync endpoint
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
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.get("/travel-desk-users", RequiresRoleTdUser, async (req: Request, res: Response) => {
  try {
    // TODO: update the front-end so renaming is no longer needed
    const users = await User.findAll({
      attributes: ["email", ["firstName", "first_name"], ["lastName", "last_name"]],
      where: {
        status: User.Statuses.ACTIVE,
        roles: {
          [Op.contains]: [User.Roles.TD_USER],
        },
      },
    })

    res.status(200).json(users)
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.put("/:id/permissions", RequiresRoleAdmin, async (req: Request, res: Response) => {
  try {
    console.log("body", req.body)
    await User.update(
      {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        department: req.body.departments,
        roles: req.body.roles.join(","),
      },
      { where: { id: req.params.id } }
    )
    res.status(200).json("Saved permissions")
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.get("/:id/permissions", async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (isNull(user)) {
      return res.status(404).json({ message: "User not found" })
    }

    console.log(user)
    let permissions = {
      first_name: user.firstName,
      last_name: user.lastName,
      departments: user.department,
      roles: user.roles,
    }
    res.status(200).json(permissions)
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = User.findByPk(req.params.id)
    if (isNull(user)) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})
