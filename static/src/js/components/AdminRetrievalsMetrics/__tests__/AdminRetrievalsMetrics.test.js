import React from 'react'
import ReactDOM from 'react-dom'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import { AdminRetrievalsMetrics } from '../AdminRetrievalsMetrics'

const mockStore = configureMockStore()
const store = mockStore({})

const setup = () => {
  const retrievalsMetrics = {
    isLoaded: true,
    isLoading: false,
    accessMethodType: {},
    allAccessMethodTypes: [
    ],
    multCollectionResponse: [],
    byAccessMethodType: {},
    startDate: '',
    endDate: ''
  }
  const onFetchAdminRetrievalsMetrics = jest.fn()
  const onUpdateAdminRetrievalsMetricsStartDate = jest.fn()
  const onUpdateAdminRetrievalsMetricsEndDate = jest.fn()

  const props = {
    onFetchAdminRetrievalsMetrics,
    onUpdateAdminRetrievalsMetricsStartDate,
    onUpdateAdminRetrievalsMetricsEndDate,
    retrievalsMetrics
  }

  // https://testing-library.com/docs/example-react-router/
  // Wrapping this in a Redux provider because DatepickerContainer has to be connected to Redux
  render(
    <Provider store={store}>
      <BrowserRouter>
        <AdminRetrievalsMetrics {...props} />
      </BrowserRouter>
    </Provider>
  )

  return {
    onFetchAdminRetrievalsMetrics,
    onUpdateAdminRetrievalsMetricsStartDate,
    onUpdateAdminRetrievalsMetricsEndDate
  }
}

describe('AdminRetrievals component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getByText('Enter a value for the temporal filter')).toBeInTheDocument()
  })

  describe('when filtering temporally', () => {
    beforeAll(() => {
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
    })

    afterEach(() => {
      ReactDOM.createPortal.mockClear()
    })

    test('clicking on the temporal filter modal opens it', async () => {
      const user = userEvent.setup()
      const {
        onFetchAdminRetrievalsMetrics,
        onUpdateAdminRetrievalsMetricsStartDate,
        onUpdateAdminRetrievalsMetricsEndDate
      } = setup()

      const temporalFilterButton = screen.getByRole('button')
      await waitFor(async () => {
        await user.click(temporalFilterButton)
      })

      const validStartDate = '2019-03-29T00:00:00.000Z'
      const validEndDate = '2019-03-30T00:00:00.000Z'

      const updatedEndDate = '2019-03-30T23:59:59.999Z'

      const startDate = screen.getByRole('textbox', { name: 'Start Date' })
      const endDate = screen.getByRole('textbox', { name: 'End Date' })

      await userEvent.click(startDate)
      await userEvent.type(startDate, validStartDate)

      await userEvent.click(endDate)
      await userEvent.type(endDate, validEndDate)

      const applyBtn = screen.getByRole('button', { name: 'Apply' })

      await waitFor(async () => {
        await user.click(startDate)
        await user.click(applyBtn)
      })

      expect(onUpdateAdminRetrievalsMetricsStartDate).toHaveBeenCalledTimes(1)
      expect(onUpdateAdminRetrievalsMetricsStartDate).toHaveBeenCalledWith(validStartDate)

      expect(onUpdateAdminRetrievalsMetricsEndDate).toHaveBeenCalledTimes(1)
      expect(onUpdateAdminRetrievalsMetricsEndDate).toHaveBeenCalledWith(updatedEndDate)

      expect(onFetchAdminRetrievalsMetrics).toHaveBeenCalledTimes(1)

      const startDateHeader = screen.getAllByRole('heading', { level: 5 })[0]
      const endDateHeader = screen.getAllByRole('heading', { level: 5 })[1]

      expect(startDateHeader.textContent).toEqual(`Start Date:${validStartDate}`)
      expect(endDateHeader.textContent).toEqual(`End Date:${updatedEndDate}`)
    })
  })
})
