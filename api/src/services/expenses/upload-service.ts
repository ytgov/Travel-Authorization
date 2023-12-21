import { Expense } from "@/models"

import BaseService from "@/services/base-service"

export class UploadService extends BaseService {
  private expense: Expense
  private file: Express.Multer.File

  // Info on file format: https://github.com/expressjs/multer#file-information
  constructor(expense: Expense, file: Express.Multer.File) {
    super()
    this.expense = expense
    this.file = file
  }

  async perform(): Promise<Expense> {
    console.log("this.file:", JSON.stringify(this.file, null, 2))
    const { originalname, size, path, buffer } = this.file
    console.log("originalname:", originalname)
    console.log("size:", size)
    console.log("path:", path)
    console.log("buffer:", buffer)
    return this.expense
  }
}
