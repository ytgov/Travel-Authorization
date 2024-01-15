import { GeneralLedgerCoding } from "@/models"

describe("api/src/models/general-ledger-coding.ts", () => {
  describe("GeneralLedgerCoding", () => {
    describe("#code - validity - Code must be in the format: vote (3 characters) - Program (6 characters) - object code (4 digits) - subledger-1 (0-4 characters) - subleger-2 (0-5 characters)", () => {
      test.each([
        ["123-123456-1234", true],
        ["123-123456-1234-", false],
        ["123-123456-1234-1", true],
        ["123-123456-1234-1-", false],
        ["123-123456-1234-1234", true],
        ["123-123456-1234-12345", false],
        ["123-123456-1234-1-1", true],
        ["123-123456-1234-1-12345", true],
        ["123-123456-1234-1-123456", false],
        ["123-123456-1234-1234-12345", true],
      ])('.isValid("%s") == %s', async (code, expected) => {
        const modelInstance = GeneralLedgerCoding.build({
          travelAuthorizationId: -1, // not relevant to this test
          amount: 0, // not relevant to this test
          code,
        })
        let isValid
        try {
          await modelInstance.validate()
          isValid = true
        } catch (error: any) {
          expect(error.message).toBe(
            "Validation error: Code must be in the format: vote (3 characters) - Program (6 characters) - object code (4 digits) - subledger-1 (0-4 characters) - subleger-2 (0-5 characters)"
          )
          isValid = false
        }
        expect(isValid).toBe(expected)
      })
    })
  })
})
