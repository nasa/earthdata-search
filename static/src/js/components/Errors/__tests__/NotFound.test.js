import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import nock from 'nock'
import { v4 as uuidv4 } from 'uuid'
import LoggerRequest from '../../../util/request/loggerRequest'
import '@testing-library/jest-dom'

import NotFound from '../NotFound'

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

const setup = (props) => {
  act(() => {
    render(
      <NotFound {...props} />
    )
  })
}

describe('NotFound component', () => {
  test('should render the NotFound component', () => {
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
