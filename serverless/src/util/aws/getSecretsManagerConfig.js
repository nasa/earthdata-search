/**
 * Returns an environment specific configuration object for Secrets Manager
 * @return {Object} A configuration object for Secrets Manager
 */
export const getSecretsManagerConfig = () => {
  const productionConfig = {
    apiVersion: '2017-10-17'
  }

  return productionConfig
}
