import { screen } from '@testing-library/react'
import nock from 'nock'
import { v4 as uuidv4 } from 'uuid'
import { useRouteError } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import LoggerRequest from '../../../util/request/loggerRequest'

import RouterErrorBoundary from '../RouterErrorBoundary'

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteError: jest.fn()
}))

const setup = setupTest({
  Component: RouterErrorBoundary
})

describe('RouterErrorBoundary component', () => {
  test('should render the RouterErrorBoundary component', () => {
    useRouteError.mockReturnValue({
      message: 'Error: Uncaught [Error: Test error]',
      stack: 'mock stack'
    })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const loggerMock = jest.spyOn(LoggerRequest.prototype, 'log')

    setup()

    expect(screen.getByRole('heading', { name: /We're sorry, but something went wrong./i })).toBeInTheDocument()

    expect(loggerMock).toHaveBeenCalledTimes(1)
    expect(loggerMock).toHaveBeenCalledWith({
      error: {
        guid: 'mock-request-id',
        location: window.location,
        message: 'Error: Uncaught [Error: Test error]',
        stack: 'mock stack'
      }
    })
  })
})
