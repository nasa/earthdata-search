/**
 * Returns an environment specific configuration object for Step Functions
 * @return {Object} A configuration object for Step Functions
 */
export const getStepFunctionsConfig = () => {
  const productionConfig = {
    apiVersion: '2016-11-23'
  }

  return productionConfig
}
