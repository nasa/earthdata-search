import { SFNClient } from '@aws-sdk/client-sfn'

import { startOrderStatusUpdateWorkflow } from '../startOrderStatusUpdateWorkflow'

jest.mock('@aws-sdk/client-sfn', () => {
  const original = jest.requireActual('@aws-sdk/client-sfn')
  const stepFunctionData = jest.fn()

  return {
    ...original,
    SFNClient: jest.fn().mockImplementation(() => ({
      startExecution: stepFunctionData
        .mockResolvedValue(stepFunctionData)
    }))
  }
})

const client = new SFNClient()
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
    process.env.updateOrderStatusStateMachineArn = 'order-status-arn'

    await startOrderStatusUpdateWorkflow(1, 'access-token', 'ESI')

    expect(client.startExecution).toBeCalledTimes(1)
    expect(client.startExecution).toHaveBeenCalledWith(
      {
        stateMachineArn: 'order-status-arn',
        input: JSON.stringify({
          id: 1,
          accessToken: 'access-token',
          orderType: 'ESI'
        })
      }
    )
  })
})
