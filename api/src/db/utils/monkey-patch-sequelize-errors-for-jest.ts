/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize } from "sequelize"

import logger from "@/utils/logger"

const sequelizeVersion = (Sequelize as any).version
const major = sequelizeVersion.split(".").map(Number)[0]

if (major >= 7) {
  logger.warn("This patch was probably made redundant in Sequelize v7, you should check!")
}

/**
 * Fixed in Sequelize v7, but hasn't been back-ported to Sequelize v6.
 * See https://github.com/sequelize/sequelize/issues/14807#issuecomment-1854398131
 */
export function monkeyPatchSequelizeErrorsForJest(instance: Sequelize) {
  if (typeof jest === "undefined") return instance

  const origQueryFunc = instance.query
  instance.query = async function query(this: Sequelize, ...args: any[]) {
    let result
    try {
      result = await origQueryFunc.apply(this, args as any)
    } catch (error: any) {
      // Important - this is how we debug the error
      throw fixSequelizeError(error)
    }
    return result
  } as typeof origQueryFunc

  return instance
}

const isSequelizeError = (error: any) =>
  error instanceof Error && error.name.startsWith("Sequelize")

const fixSequelizeError = (error: any) => {
  if (!isSequelizeError(error)) return error

  let { message } = error.parent
  if (error.sql) {
    message += "\nSQL: " + error.sql
  }

  if (error.parameters) {
    const stringifiedParameters = JSON.stringify(error.parameters)
    if (stringifiedParameters !== "undefined" && stringifiedParameters !== "{}") {
      message += "\nParameters: " + stringifiedParameters
    }
  }

  message += "\n" + error.stack

  error.message = message
  Error.captureStackTrace(error)

  return error
}
