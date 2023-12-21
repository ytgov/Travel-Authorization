import { Expense } from "@/models"

import BaseService from "@/services/base-service"

type ExpressFileUpload = {
  name: string // "car.jpg"
  mv: (...args: unknown[]) => unknown // A function to move the file elsewhere on your server. Can take a callback or return a promise.
  mimetype: string // The mimetype of your file
  data: Buffer // A buffer representation of your file, returns empty buffer in case useTempFiles option was set to true.
  tempFilePath: string // A path to the temporary file in case useTempFiles option was set to true.
  truncated: boolean // A boolean that represents if the file is over the size limit
  size: number // Uploaded size in bytes
  md5: string // MD5 checksum of the uploaded file

}

export class UploadService extends BaseService {
  private expense: Expense
  private file: ExpressFileUpload

  // Info on file format: https://github.com/expressjs/multer#file-information
  constructor(expense: Expense, file: ExpressFileUpload) {
    super()
    this.expense = expense
    this.file = file
  }

  async perform(): Promise<Expense> {
    console.log("this.file:", JSON.stringify(this.file, null, 2))
    const { name, size, data } = this.file
    console.log("name:", name)
    console.log("size:", size)
    console.log("data:", data)
    return this.expense
  }
}
