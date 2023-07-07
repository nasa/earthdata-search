import { SFNClient } from '@aws-sdk/client-sfn'

import { startOrderStatusUpdateWorkflow } from '../startOrderStatusUpdateWorkflow'
import { getStepFunctionsConfig } from '../aws/getStepFunctionsConfig'

jest.mock('@aws-sdk/client-sfn', () => {
  const original = jest.requireActual('@aws-sdk/client-sfn')
  const sendMock = jest.fn().mockResolvedValue({
    executionArn: 'mockArn',
    startDate: 12345
  })

  return {
    ...original,
    SFNClient: jest.fn().mockImplementation(() => ({
      send: sendMock
    }))
  }
})

const client = new SFNClient(getStepFunctionsConfig())
const OLD_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()

  // Manage resetting ENV variables
  jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
})

afterEach(() => {
  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV
})

describe('startOrderStatusUpdateWorkflow', () => {
  test('starts the order status workflow', async () => {
    const consoleMock = jest.spyOn(console, 'log')

    process.env.updateOrderStatusStateMachineArn = 'order-status-arn'

    await startOrderStatusUpdateWorkflow(1, 'access-token', 'ESI')

    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: {
        stateMachineArn: 'order-status-arn',
        input: JSON.stringify({
          id: 1,
          accessToken: 'access-token',
          orderType: 'ESI'
        })
      }
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith('State Machine Invocation (Order ID: 1): ', { executionArn: 'mockArn', startDate: 12345 })
  })
})