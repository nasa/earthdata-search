/**
 * Returns an environment specific configuration object for SQS
 * @return {Object} A configuration object for SQS
 */
export const getSqsConfig = () => {
  const productionConfig = {
    apiVersion: '2012-11-05'
  }

  return productionConfig
}
