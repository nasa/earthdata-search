/**
 * Returns an environment specific configuration object for Lambda
 * @return {Object} A configuration object for Lambda
 */
export const getLambdaConfig = () => {
  const productionConfig = {
    apiVersion: '2015-03-31'
  }

  if (process.env.IS_OFFLINE) {
    // The endpoint should point to the serverless offline host:port
    return {
      ...productionConfig,
      region: 'us-east-1',
      endpoint: 'http://localhost:3001'
    }
  }

  return productionConfig
}
