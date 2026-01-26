import { SFNClient } from '@aws-sdk/client-sfn'

import { startOrderStatusUpdateWorkflow } from '../startOrderStatusUpdateWorkflow'
import { getStepFunctionsConfig } from '../aws/getStepFunctionsConfig'
import * as mockStepFunction from '../mockStepFunction'

vi.mock('@aws-sdk/client-sfn', async () => {
  const original = await vi.importActual('@aws-sdk/client-sfn')
  const sendMock = vi.fn().mockResolvedValue({
    executionArn: 'mockArn',
    startDate: 12345
  })

  return {
    ...original,
    SFNClient: vi.fn(class {
      send = sendMock
    })
  }
})

const client = new SFNClient(getStepFunctionsConfig())
const OLD_ENV = process.env

beforeEach(() => {
  // Manage resetting ENV variables
  vi.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
  process.env.UPDATE_ORDER_STATUS_STATE_MACHINE_ARN = 'order-status-arn'
})

afterEach(() => {
  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV
})

describe('startOrderStatusUpdateWorkflow', () => {
  test('starts the order status workflow', async () => {
    const consoleMock = vi.spyOn(console, 'log')

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
    expect(consoleMock).toHaveBeenCalledWith('State Machine Invocation (Order ID: 1): ', {
      executionArn: 'mockArn',
      startDate: 12345
    })
  })

  describe('when in development mode running SQS', () => {
    test('mocks the step function', async () => {
      process.env.NODE_ENV = 'development'
      process.env.SKIP_SQS = 'false'
      const mockStepFunctionMock = vi.spyOn(mockStepFunction, 'mockStepFunction').mockImplementationOnce(() => vi.fn())

      const consoleMock = vi.spyOn(console, 'log')

      await startOrderStatusUpdateWorkflow(1, 'access-token', 'ESI')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Starting order status update workflow for order ID: 1')

      expect(mockStepFunctionMock).toHaveBeenCalledTimes(1)
      expect(mockStepFunctionMock).toHaveBeenCalledWith('UpdateOrderStatus', {
        accessToken: 'access-token',
        id: 1,
        orderType: 'ESI'
      })

      expect(client.send).toHaveBeenCalledTimes(0)
    })
  })

  describe('when in development mode and skipping SQS', () => {
    test('does not mock the step function', async () => {
      process.env.NODE_ENV = 'development'
      process.env.SKIP_SQS = 'true'
      const mockStepFunctionMock = vi.spyOn(mockStepFunction, 'mockStepFunction').mockImplementationOnce(() => vi.fn())

      const consoleMock = vi.spyOn(console, 'log')

      await startOrderStatusUpdateWorkflow(1, 'access-token', 'ESI')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('State Machine Invocation (Order ID: 1): ', {
        executionArn: 'mockArn',
        startDate: 12345
      })

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

      expect(mockStepFunctionMock).toHaveBeenCalledTimes(0)
    })
  })
})
