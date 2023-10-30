import express, { Request, Response } from "express"
import knex from "knex"

import { RequiresAuth, RequiresRolePatAdminOrAdmin } from "@/middleware"
import { DB_CONFIG } from "@/config"
import { User } from "@/models"

const db = knex(DB_CONFIG)

export const preapprovedRouter = express.Router()

preapprovedRouter.get("/submissions", RequiresAuth, async function (req: Request, res: Response) {
  const adminQuery = function (queryBuilder: any) {
    if (req?.user?.roles?.indexOf(User.Roles.ADMIN) >= 0) queryBuilder.select("*")
    else queryBuilder.where("department", req.user.department).select("*")
  }

  const submissionList = await db("preapprovedSubmissions").modify(adminQuery)

  for (const submission of submissionList) {
    const preapproved = await db("preapproved").select("*").where({
      preTSubID: submission.preTSubID,
    })
    for (const preapp of preapproved) {
      const traveler = await db("preapprovedTravelers").select("*").where({
        preTID: preapp.preTID,
      })
      preapp.travelers = traveler
    }
    submission.preapproved = preapproved
  }

  res.status(200).json(submissionList)
})

preapprovedRouter.get(
  "/submissions/:submissionId",
  RequiresAuth,
  RequiresRolePatAdminOrAdmin,
  async function (req: Request, res: Response) {
    const preTSubID = req.params.submissionId
    try {
      const submission = await db("preapprovedSubmissions")
        .select("*")
        .where("preTSubID", preTSubID)
        .first()
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
      await db.transaction(async (trx) => {
        const preTSubID = Number(req.params.submissionId)
        const preapprovedIds = req.body.preapprovedIds
        delete req.body.preapprovedIds

        const newSubmission = req.body

        if (newSubmission.department && newSubmission.status && preapprovedIds.length > 0) {
          var id = []
          newSubmission.submitter = req.user.displayName

          if (preTSubID > 0) {
            id = await db("preapprovedSubmissions")
              .update(newSubmission, "preTSubID")
              .where("preTSubID", preTSubID)
          } else {
            id = await db("preapprovedSubmissions").insert(newSubmission, "preTSubID")
          }

          const preapprovedQuery = await db("preapproved")
            .select("preTID")
            .where("preTSubID", id[0].preTSubID)

          let preapprovedIdList = preapprovedQuery.map((preapp) => preapp.preTID)
          preapprovedIdList = preapprovedIdList.filter(
            (preappId) => !preapprovedIds.includes(preappId)
          )
          // console.log(preapprovedIdList)

          await db("preapproved")
            .update({
              status: newSubmission.status,
              preTSubID: id[0].preTSubID,
            })
            .whereIn("preTID", preapprovedIds)

          if (preapprovedIdList.length > 0) {
            await db("preapproved")
              .update({
                status: null,
                preTSubID: null,
              })
              .whereIn("preTID", preapprovedIdList)
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

preapprovedRouter.delete(
  "/submissions/:submissionId",
  RequiresAuth,
  RequiresRolePatAdminOrAdmin,
  async function (req: Request, res: Response) {
    try {
      const preTSubID = Number(req.params.submissionId)
      await db.transaction(async (trx) => {
        const submission = await db("preapprovedSubmissions")
          .select("*")
          .where("preTSubID", preTSubID)
          .first()
        if (submission.status == "Finished" || submission.approvalDate || submission.approvedBy) {
          res.status(403).json("Cannot delete final records")
        } else {
          await db("preapproved")
            .update({
              status: null,
              preTSubID: null,
            })
            .where("preTSubID", preTSubID)

          await db("preapprovedSubmissions").delete().where("preTSubID", preTSubID).transacting(trx)

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
      await db.transaction(async (trx) => {
        const approvalDoc = await db("preapprovedDocuments")
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
          await db("preapprovedDocuments").insert(newDocument, "preTDocID")

          await db("preapprovedSubmissions")
            .update({
              status: data.status,
              approvalDate: data.approvalDate,
              approvedBy: data.approvedBy,
            })
            .where("preTSubID", preTSubID)

          for (const preapp of data.preapproved) {
            await db("preapproved")
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
    const doc = await db("preapprovedDocuments")
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

  const preapprovedList = await db("preapproved").modify(adminQuery)

  for (const preapp of preapprovedList) {
    const traveler = await db("preapprovedTravelers").select("*").where({
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
      await db.transaction(async (trx) => {
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
            id = await db("preapproved").update(newPreapproved, "preTID").where("preTID", preTID)
          } else {
            id = await db("preapproved").insert(newPreapproved, "preTID")
          }

          const travelersQuery = await db("preapprovedTravelers")
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
              await db("preapprovedTravelers").insert(travellerInfo).transacting(trx)
            }
          }

          for (const travellerId of travelerIdList) {
            await db("preapprovedTravelers")
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
      await db.transaction(async (trx) => {
        const preapp = await db("preapproved").select("*").where("preTID", preTID).first()
        if (preapp.status == "Approved" || preapp.status == "Declined") {
          res.status(403).json("Cannot delete final records")
        } else {
          await db("preapproved").delete().where("preTID", preTID).transacting(trx)
          res.status(200).json("Delete Successful")
        }
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json("Delete failed")
    }
  }
)
