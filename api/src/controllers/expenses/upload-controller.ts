import { isNil } from "lodash"
import { UploadedFile } from "express-fileupload"

import BaseController from "@/controllers/base-controller"

import { Expense } from "@/models"
import { ExpensesPolicy } from "@/policies"
import { UploadService } from "@/services/expenses/upload-service"

export class UploadController extends BaseController {
  async show() {
    const expense = await this.loadExpense()
    if (isNil(expense)) return this.response.status(404).json({ message: "Expense not found." })

    const policy = this.buildPolicy(expense)
    if (!policy.show()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to view receipts on this expense." })
    }

    if (isNil(expense.fileSize)) {
      return this.response
        .status(404)
        .json({ message: "This expense does not have an associated receipt." })
    }

    return expense
      .reload({
        attributes: ["receiptImage", "fileName"],
      })
      .then(({ receiptImage: fileContents, fileName }) => {
        this.response.setHeader("Content-Disposition", "attachment; filename=" + fileName)
        this.response.setHeader("Content-Type", "application/octet-stream")

        return this.response.send(fileContents)
      })
      .catch((error) => {
        return this.response.status(400).json({ message: `Receipt retrieval failed: ${error}` })
      })
  }

  async create() {
    const expense = await this.loadExpense()
    if (isNil(expense)) return this.response.status(404).json({ message: "Expense not found." })

    const policy = this.buildPolicy(expense)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to upload receipts to this expense." })
    }

    // must match field name in web/src/api/expenses-api.js#upload
    const file = this.request.files?.["receipt"] as UploadedFile | undefined
    if (isNil(file)) {
      return this.response.status(422).json({ message: "No receipt was uploaded." })
    }

    return UploadService.perform(expense, file)
      .then((expense) => {
        return this.response.json({ expense })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Receipt upload failed: ${error}` })
      })
  }

  private loadExpense(): Promise<Expense | null> {
    return Expense.findByPk(this.params.expenseId, {
      include: [
        {
          association: "travelAuthorization",
          include: ["travelSegments"],
          order: [["travelSegments", "segmentNumber", "ASC"]],
        },
      ],
    })
  }

  private buildPolicy(record: Expense): ExpensesPolicy {
    return new ExpensesPolicy(this.currentUser, record)
  }
}

export default UploadController
