/**
 * This serverless plugin allows for a function to take a custom property object `webpack`,
 * with a boolean value for `includeMigrations`.
 *
 * This allows our Webpack config to receive that boolean value to determine if it should include the
 * database migrations when packaging serverless functions.
 */
class ServerlessWebpackIncludeMigrations {
  constructor(serverless) {
    // For reference on JSON schema, see https://github.com/ajv-validator/ajv
    serverless.configSchemaHandler.defineFunctionProperties('aws', {
      properties: {
        webpack: {
          type: 'object',
          properties: {
            includeMigrations: { type: 'boolean' }
          }
        }
      },
      additionalProperties: false
    })
  }
}

module.exports = ServerlessWebpackIncludeMigrations
