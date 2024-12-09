import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import nock from 'nock'
import { v4 as uuidv4 } from 'uuid'
import LoggerRequest from '../../../util/request/loggerRequest'

import NotFound from '../NotFound'

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (props) => {
  act(() => {
    render(
      <NotFound {...props} />
    )
  })
}

describe('NotFound component', () => {
  test('should render the NotFound component', () => {
    const appNode = document.createElement('div')
    appNode.id = 'app'
    document.body.appendChild(appNode)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const loggerMock = jest.spyOn(LoggerRequest.prototype, 'log')

    setup({
      location: {
        search: ''
      }
    })

    expect(screen.getByRole('heading', { name: /Sorry! The page you were looking for does not exist./i })).toBeInTheDocument()
    expect(loggerMock).toBeCalledTimes(1)
    expect(loggerMock).toHaveBeenCalledWith({
      error: {
        guid: 'mock-request-id',
        message: '404 Not Found',
        location: {
          search: ''
        }
      }
    })

    document.body.removeChild(appNode)
  })

  describe('render standalone', () => {
    test('renders the notFound component', () => {
      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      const loggerMock = jest.spyOn(LoggerRequest.prototype, 'log')

      setup({
        location: {
          search: ''
        }
      })

      expect(screen.getByRole('heading', { name: /Sorry! The page you were looking for does not exist./i })).toBeInTheDocument()
      expect(loggerMock).toBeCalledTimes(1)
      expect(loggerMock).toHaveBeenCalledWith({
        error: {
          guid: 'mock-request-id',
          message: '404 Not Found',
          location: {
            search: ''
          }
        }
      })
    })
  })
})
