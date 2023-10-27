import { isNull } from "lodash"
import { Op } from "sequelize"
import express, { Request, Response } from "express"

import { RequiresRoleAdmin } from "@/middleware"
import { UserService } from "@/services"
import { RequiresRoleTdUser } from "@/middleware"
import { User } from "@/models"

export const userRouter = express.Router()
const userService = new UserService()

userRouter.get("/me", async (req: Request, res: Response) => {
  let person = req.user

  if (person)
    return res.json({
      data: await makeDTO(person),
    })
})

async function makeDTO(userRaw: any) {
  let dto = userRaw
  dto.displayName = `${userRaw.firstName} ${userRaw.lastName}`
  //dto.roles = _.split(userRaw.roles, ",").filter(r => r.length > 0);
  //dto.access = await db.getAccessFor(userRaw.email);
  //dto.display_access = _.join(dto.access.map((a: any) => a.level), ", ")

  return dto
}

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    let users = await User.findAll()
    res.status(200).json(users)
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.get("/unit", async (req: Request, res: Response) => {
  try {
    let unit = await userService.getUnit(req.user?.email)
    res.status(200).json(unit)
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
          [Op.like]: "%TdUser%",
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
      },
      { where: { id: req.params.id } }
    )
    await userService.saveDepartmentAccess(req.params.id, req.body.departments)
    await userService.saveRoleAccess(req.params.id, req.body.roles)
    res.status(200).json("Saved permissions")
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Internal Server Error")
  }
})

userRouter.get("/:id/permissions", async (req: Request, res: Response) => {
  try {
    // let departments = await userService.getDepartmentAccess(req.params.id);
    // let roles = await userService.getRoleAccess(req.params.id);
    const user = await User.findByPk(req.params.id)
    if (isNull(user)) {
      return res.status(404).json({ message: "User not found" })
    }

    console.log(user)
    let permissions = {
      first_name: user.firstName,
      last_name: user.lastName,
      departments: user.department,
      roles: user.roles?.split(","),
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
