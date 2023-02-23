// copy properties of the built-in crypto module to the mock crypto
const crypto = Object.assign({}, require("node:crypto"))

crypto.randomUUID = () => '00000000-0000-0000-0000-000000000000'

module.exports = crypto
