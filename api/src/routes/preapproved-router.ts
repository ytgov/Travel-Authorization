import express, { Request, Response } from "express"
import knex from "knex"
import { ModelStatic, Op } from "sequelize"
import { isNil } from "lodash"

import { RequiresAuth, RequiresRolePatAdminOrAdmin } from "@/middleware"
import { DB_CONFIG } from "@/config"
import db, {
  TravelAuthorizationPreApproval,
  TravelAuthorizationPreApprovalSubmission,
  User,
} from "@/models"

const dbLegacy = knex(DB_CONFIG)

export const preapprovedRouter = express.Router()

preapprovedRouter.get("/submissions", RequiresAuth, async function (req: Request, res: Response) {
  const applyScope = (scope: ModelStatic<TravelAuthorizationPreApprovalSubmission>, user: User) => {
    if (req?.user?.roles?.indexOf(User.Roles.ADMIN) >= 0) {
      return scope
    }

    return scope.scope({
      where: {
        department: req.user.department,
      },
    })
  }

  const scopedSubmissions = applyScope(TravelAuthorizationPreApprovalSubmission, req.user)
  const submissionList = await scopedSubmissions.findAll({
    include: [
      {
        association: "preApproval",
        include: ["travelers"],
      },
    ],
  })

  res.status(200).json(submissionList)
})

preapprovedRouter.get(
  "/submissions/:submissionId",
  RequiresAuth,
  RequiresRolePatAdminOrAdmin,
  async function (req: Request, res: Response) {
    const preTSubID = req.params.submissionId
    try {
      const submission = await TravelAuthorizationPreApprovalSubmission.findByPk(preTSubID)
      res.status(200).json(submission)
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Record Not Found")
    }
  }
)

preapprovedRouter.post(
  "/submissions/:submissionId",
  RequiresAuth,
  RequiresRolePatAdminOrAdmin,
  async function (req: Request, res: Response) {
    try {
      await db.transaction(async () => {
        const preTSubID = Number(req.params.submissionId)
        const preapprovedIds = req.body.preapprovedIds
        delete req.body.preapprovedIds

        const newSubmission = req.body

        if (newSubmission.department && newSubmission.status && preapprovedIds.length > 0) {
          var id = []
          newSubmission.submitter = req.user.displayName

          let submission = await TravelAuthorizationPreApprovalSubmission.findByPk(preTSubID)
          if (submission !== null) {
            submission.update(newSubmission)
          } else {
            submission = await TravelAuthorizationPreApprovalSubmission.create(newSubmission)
          }

          await TravelAuthorizationPreApproval.update(
            {
              status: submission.status,
              submissionId: submission.preTSubID,
            },
            {
              where: {
                id: preapprovedIds,
              },
            }
          )
          await TravelAuthorizationPreApproval.update(
            {
              status: null,
              submissionId: null,
            },
            {
              where: {
                submissionId: submission.preTSubID,
                [Op.not]: [{ id: preapprovedIds }],
              },
            }
          )

          res.status(200).json("Successful")
        } else {
          res.status(500).json("Required fields in submission are blank")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

preapprovedRouter.delete(
  "/submissions/:submissionId",
  RequiresAuth,
  RequiresRolePatAdminOrAdmin,
  async function (req: Request, res: Response) {
    try {
      const preTSubID = Number(req.params.submissionId)
      const submission = await TravelAuthorizationPreApprovalSubmission.findByPk(preTSubID)
      if (isNil(submission)) {
        return res.status(404).json("Submission not found")
      }

      await db.transaction(async () => {
        if (submission.status == "Finished" || submission.approvalDate || submission.approvedBy) {
          res.status(403).json("Cannot delete final records")
        } else {
          await TravelAuthorizationPreApproval.update(
            {
              status: null,
              submissionId: null,
            },
            {
              where: {
                submissionId: submission.preTSubID,
              },
            }
          )
          await submission.destroy()

          res.status(200).json("Delete Successful")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Delete failed")
    }
  }
)

preapprovedRouter.post(
  "/approval/:submissionId",
  RequiresAuth,
  RequiresRolePatAdminOrAdmin,
  async function (req: Request, res: Response) {
    const file = req.body.file
    const preTSubID = req.params.submissionId
    const data = JSON.parse(req.body.data)

    try {
      await dbLegacy.transaction(async (trx) => {
        const approvalDoc = await dbLegacy("preapprovedDocuments")
          .select("preTDocID")
          .where("preTSubID", preTSubID)
          .first()
        if (approvalDoc) {
          res.status(409).json("File Already Exist!")
        } else if (
          preTSubID &&
          data.status &&
          data.approvalDate &&
          data.approvedBy &&
          data.preapproved.length > 0
        ) {
          const newDocument = {
            preTSubID: preTSubID,
            approvalDoc: file,
          }
          await dbLegacy("preapprovedDocuments").insert(newDocument, "preTDocID")

          await dbLegacy("preapprovedSubmissions")
            .update({
              status: data.status,
              approvalDate: data.approvalDate,
              approvedBy: data.approvedBy,
            })
            .where("preTSubID", preTSubID)

          for (const preapp of data.preapproved) {
            await dbLegacy("preapproved")
              .update({
                status: preapp.status,
              })
              .where("preTID", preapp.preTID)
          }

          res.status(200).json("Successful")
        } else {
          res.status(500).json("Required fields in submission are blank")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

preapprovedRouter.get("/document/:submissionId", RequiresAuth, async function (req, res) {
  try {
    const preTSubID = req.params.submissionId
    const doc = await dbLegacy("preapprovedDocuments")
      .select("approvalDoc")
      .where("preTSubID", preTSubID)
      .first()
    res.status(200).send(doc.approvalDoc)
  } catch (error: any) {
    console.log(error)
    res.status(500).json("PDF not Found")
  }
})

preapprovedRouter.get("/", RequiresAuth, async function (req: Request, res: Response) {
  const adminQuery = function (queryBuilder: any) {
    if (req?.user?.roles?.indexOf(User.Roles.ADMIN) >= 0) queryBuilder.select("*")
    else queryBuilder.where("department", req.user.department).select("*")
  }

  const preapprovedList = await dbLegacy("preapproved").modify(adminQuery)

  for (const preapp of preapprovedList) {
    const traveler = await dbLegacy("preapprovedTravelers").select("*").where({
      preTID: preapp.preTID,
    })
    preapp.travelers = traveler
  }

  res.status(200).json(preapprovedList)
})

preapprovedRouter.post(
  "/:preapprovedId",
  RequiresAuth,
  async function (req: Request, res: Response) {
    const preTID = Number(req.params.preapprovedId)
    try {
      await dbLegacy.transaction(async (trx) => {
        const travelers = req.body.travelers
        delete req.body.travelers

        const newPreapproved = req.body

        if (
          newPreapproved.department &&
          newPreapproved.purpose &&
          newPreapproved.dateUnkInd >= 0 &&
          newPreapproved.estimatedCost &&
          newPreapproved.location &&
          newPreapproved.travelerUnkInd >= 0 &&
          travelers?.length > 0
        ) {
          var id = []
          if (preTID > 0) {
            id = await dbLegacy("preapproved")
              .update(newPreapproved, "preTID")
              .where("preTID", preTID)
          } else {
            id = await dbLegacy("preapproved").insert(newPreapproved, "preTID")
          }

          const travelersQuery = await dbLegacy("preapprovedTravelers")
            .select("travelerID")
            .where("preTID", id[0].preTID)

          let travelerIdList = travelersQuery.map((traveler) => traveler.travelerID)

          for (const traveller of travelers) {
            if (traveller.travelerID) {
              travelerIdList = travelerIdList.filter((tid) => tid != traveller.travelerID)
            } else {
              let travellerInfo = {
                preTID: id[0].preTID,
                ...traveller,
              }
              await dbLegacy("preapprovedTravelers").insert(travellerInfo).transacting(trx)
            }
          }

          for (const travellerId of travelerIdList) {
            await dbLegacy("preapprovedTravelers")
              .delete()
              .where("travelerID", travellerId)
              .transacting(trx)
          }

          res.status(200).json(id)
        } else {
          res.status(500).json("Required fields in submission are blank")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Insert failed")
    }
  }
)

preapprovedRouter.delete(
  "/:preapprovedId",
  RequiresAuth,
  RequiresRolePatAdminOrAdmin,
  async function (req: Request, res: Response) {
    try {
      const preTID = req.params.preapprovedId
      await dbLegacy.transaction(async (trx) => {
        const preapp = await dbLegacy("preapproved").select("*").where("preTID", preTID).first()
        if (preapp.status == "Approved" || preapp.status == "Declined") {
          res.status(403).json("Cannot delete final records")
        } else {
          await dbLegacy("preapproved").delete().where("preTID", preTID).transacting(trx)
          res.status(200).json("Delete Successful")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Delete failed")
    }
  }
)
