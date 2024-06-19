import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import nock from 'nock'
import { v4 as uuidv4 } from 'uuid'
import LoggerRequest from '../../../util/request/loggerRequest'
import '@testing-library/jest-dom'

import ErrorBoundary from '../ErrorBoundary'

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

beforeEach(() => {
  jest.clearAllMocks()
})

const ErroredComponent = () => {
  throw new Error('Test error')
}

const setup = (props) => {
  act(() => {
    render(
      <ErrorBoundary {...props}>
        <ErroredComponent />
      </ErrorBoundary>
    )
  })
}

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

    expect(loggerMock).toBeCalledTimes(1)
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
      expect(loggerMock).toBeCalledTimes(1)
    })
  })
})
