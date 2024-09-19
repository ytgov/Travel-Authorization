function simpleDedent(str) {
  const lines = str.split("\n")

  const firstNonEmptyLine = lines.find((line) => line.trim().length > 0)
  if (!firstNonEmptyLine) return str

  const leadingWhitespace = firstNonEmptyLine.match(/^\s*/)[0]
  const indentSize = leadingWhitespace.length
  const indentString = " ".repeat(indentSize)

  const dedentedLines = lines.map((line) => {
    if (line.startsWith(indentString)) {
      return line.slice(indentSize)
    }

    return line
  })

  return dedentedLines.join("\n")
}

export default simpleDedent
