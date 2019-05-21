import AWS from 'aws-sdk'
import getConfig from '../../sharedUtils/config'
// import fs from 'fs'

const secretsmanager = new AWS.SecretsManager({
  region: 'us-east-1'
})

export const getEdlConfig = async () => {
  console.log(process.env.NODE_ENV)
  // if (process.env.NODE_ENV === 'development') {
  //   const config = JSON.parse(fs.readFileSync('config.json'))
  //   console.log('config', config)
  //   return config.oauth
  // }

  const params = { SecretId: 'ursClientConfigProd' }
  console.log('params', params)

  const secretValue = await secretsmanager.getSecretValue(params).promise()

  console.log('secretValue', secretValue)
  const clientConfig = JSON.parse(secretValue.SecretString)
  return {
    client: clientConfig,
    auth: {
      tokenHost: getConfig('prod').edlHost
    }
  }
}

export default getEdlConfig
