import { isNil } from "lodash"

import BaseController from "@/controllers/base-controller"

import { Expense } from "@/models"
import { ExpensesPolicy } from "@/policies"
import { UploadService } from "@/services/expenses/upload-service"

export class UploadController extends BaseController {
  async create() {
    const expense = await this.loadExpense()
    if (isNil(expense)) return this.response.status(404).json({ message: "Expense not found." })

    const policy = this.buildPolicy(expense)
    if (!policy.update()) {
      return this.response
        .status(403)
        .json({ message: "You are not authorized to upload receipts to this expense." })
    }

    console.log("this.request.file:", this.request.file)
    console.log("this.request.files:", this.request.files)
    const file = this.request.file
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
    return Expense.findByPk(this.params.expenseId, { include: ["travelAuthorization"] })
  }

  private buildPolicy(record: Expense): ExpensesPolicy {
    return new ExpensesPolicy(this.currentUser, record)
  }
}

export default UploadController
