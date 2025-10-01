import React from 'react'
import { screen } from '@testing-library/react'
import nock from 'nock'
import { v4 as uuidv4 } from 'uuid'

import setupTest from '../../../../../../jestConfigs/setupTest'

import LoggerRequest from '../../../util/request/loggerRequest'

import ErrorBoundary from '../ErrorBoundary'

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

const ErroredComponent = () => {
  throw new Error('Test error')
}

const setup = setupTest({
  Component: ErrorBoundary,
  defaultProps: {
    children: <ErroredComponent />
  }
})

describe('ErrorBoundary component', () => {
  test('should render the ErrorBoundary component', () => {
    const appNode = document.createElement('div')
    appNode.id = 'app'
    document.body.appendChild(appNode)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const loggerMock = jest.spyOn(LoggerRequest.prototype, 'log')

    setup()

    expect(screen.getByRole('heading', { name: /We're sorry, but something went wrong./i })).toBeInTheDocument()

    expect(loggerMock).toHaveBeenCalledTimes(1)
    expect(loggerMock).toHaveBeenCalledWith({
      error: expect.objectContaining({
        guid: 'mock-request-id',
        message: 'Error: Uncaught [Error: Test error]'
      })
    })

    document.body.removeChild(appNode)
  })

  describe('render standalone', () => {
    test('should render the ErrorBoundary component', () => {
      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      const loggerMock = jest.spyOn(LoggerRequest.prototype, 'log')

      setup()

      expect(screen.getByRole('heading', { name: /We're sorry, but something went wrong./i })).toBeInTheDocument()

      expect(loggerMock).toHaveBeenCalledTimes(1)
      expect(loggerMock).toHaveBeenCalledWith({
        error: expect.objectContaining({
          guid: 'mock-request-id',
          message: 'Error: Uncaught [Error: Test error]'
        })
      })
    })
  })
})
