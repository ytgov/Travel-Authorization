import { GeneralLedgerCoding } from "@/models"

describe("api/src/models/general-ledger-coding.ts", () => {
  describe("GeneralLedgerCoding", () => {
    describe("#code - valid cases", () => {
      test.each([
        "123-123456-1234",
        "123-123456-1234-1",
        "123-123456-1234-1234",
        "123-123456-1234-1-1",
        "123-123456-1234-1-12345",
        "123-123456-1234-1234-12345",
      ])('.isValid("%s") should resolve', async (code) => {
        const modelInstance = GeneralLedgerCoding.build({
          travelAuthorizationId: -1, // not relevant to this test
          amount: 0, // not relevant to this test
          code,
        })

        await expect(modelInstance.validate()).resolves.to.not.toThrowError()
      })
    })

    describe("#code - invalid cases", () => {
      test.each([
        "123-123456-1234-",
        "123-123456-1234-1-",
        "123-123456-1234-12345",
        "123-123456-1234-1-123456",
      ])('.isValid("%s") should reject', async (code) => {
        const modelInstance = GeneralLedgerCoding.build({
          travelAuthorizationId: -1, // not relevant to this test
          amount: 0, // not relevant to this test
          code,
        })

        await expect(modelInstance.validate()).rejects.toThrowError(
          "Validation error: Code must be in the format: vote (3 characters) - Program (6 characters) - object code (4 digits) - subledger-1 (0-4 characters) - subleger-2 (0-5 characters)"
        )
      })
    })
  })
})
