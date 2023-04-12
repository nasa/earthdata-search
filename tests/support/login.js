import { testJwtToken } from './getJwtToken'

/**
 * Sets a cookie that will result in the user being logged in for a test
 */
export const login = async (context) => {
  await context.addCookies([{
    name: 'authToken',
    value: testJwtToken,
    url: 'http://localhost:8080'
  }])
}
