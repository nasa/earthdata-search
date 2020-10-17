import AWS from 'aws-sdk'

import { startOrderStatusUpdateWorkflow } from '../startOrderStatusUpdateWorkflow'

const stepFunctionData = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue()
})

AWS.StepFunctions = jest.fn()
  .mockImplementationOnce(() => ({
    startExecution: stepFunctionData
  }))

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

    expect(stepFunctionData).toBeCalledTimes(1)
    expect(stepFunctionData.mock.calls[0]).toEqual([{
      stateMachineArn: 'order-status-arn',
      input: JSON.stringify({
        id: 1,
        accessToken: 'access-token',
        orderType: 'ESI'
      })
    }])
  })
})
