import guessNameCapitalization from "@/integrations/trav-com-integration/utils/guess-name-capitalization"

describe("api/src/integrations/trav-com-integration/utils/guess-name-capitalization.ts", () => {
  describe("guessNameCapitalization", () => {
    test.each([
      ["ONDRICKA-BAILEY", "Ondricka-Bailey"],
      ["MACDONALD", "MacDonald"],
      ["MICINTYRE", "MicIntyre"],
      ["MCLAREN", "McLaren"],
      ["O'REILLY", "O'Reilly"],
      ["VAN DER WALT", "Van Der Walt"],
      ["MCLAREN-O'REILLY", "McLaren-O'Reilly"],
    ])("guessNameCapitalization(%s) === %s", (input, expected) => {
      expect(guessNameCapitalization(input)).toBe(expected)
    })
  })
})
