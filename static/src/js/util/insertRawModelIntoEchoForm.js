/**
 * Inserts the rawModel into the echoform
 * @param {String} rawModel
 * @param {String} echoform
 */
export const insertRawModelIntoEchoForm = (rawModel, echoform) => {
  if (rawModel) {
    return echoform.replace(/(?:<instance>)(?:.|\n)*(?:<\/instance>)/, `<instance>\n${rawModel}\n</instance>`)
  }

  return echoform
}
