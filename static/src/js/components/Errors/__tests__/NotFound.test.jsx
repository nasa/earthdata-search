import { screen } from '@testing-library/react'
import nock from 'nock'
import { v4 as uuidv4 } from 'uuid'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import LoggerRequest from '../../../util/request/loggerRequest'
import NotFound from '../NotFound'

vi.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

const setup = setupTest({
  Component: NotFound,
  withRouter: true
})

describe('NotFound component', () => {
  test('should render the NotFound component', () => {
    const appNode = document.createElement('div')
    appNode.id = 'app'
    document.body.appendChild(appNode)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const loggerMock = vi.spyOn(LoggerRequest.prototype, 'log')

    setup()

    expect(screen.getByRole('heading', { name: /Sorry! The page you were looking for does not exist./i })).toBeInTheDocument()

    expect(loggerMock).toHaveBeenCalledTimes(1)
    expect(loggerMock).toHaveBeenCalledWith({
      error: {
        guid: 'mock-request-id',
        message: '404 Not Found',
        location: {
          hash: '',
          key: 'default',
          pathname: '/',
          search: '',
          state: null
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

      const loggerMock = vi.spyOn(LoggerRequest.prototype, 'log')

      setup()

      expect(screen.getByRole('heading', { name: /Sorry! The page you were looking for does not exist./i })).toBeInTheDocument()

      expect(loggerMock).toHaveBeenCalledTimes(1)
      expect(loggerMock).toHaveBeenCalledWith({
        error: {
          guid: 'mock-request-id',
          message: '404 Not Found',
          location: {
            hash: '',
            key: 'default',
            pathname: '/',
            search: '',
            state: null
          }
        }
      })
    })
  })
})
