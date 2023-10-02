import React from 'react'
import ReactDOM from 'react-dom'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'

import '@testing-library/jest-dom'

import userEvent from '@testing-library/user-event'

import { BrowserRouter } from 'react-router-dom'

import { AdminRetrievalsMetrics } from '../AdminRetrievalsMetrics'

const setup = () => {
  const retrievals = {
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
  const onFetchAdminMetricsRetrievals = jest.fn()
  const onUpdateAdminMetricsRetrievalsStartDate = jest.fn()
  const onUpdateAdminMetricsRetrievalsEndDate = jest.fn()

  const props = {
    onFetchAdminMetricsRetrievals,
    onUpdateAdminMetricsRetrievalsStartDate,
    onUpdateAdminMetricsRetrievalsEndDate,
    retrievals
  }

  // TODO  why is this needed as a wrapper exactly?
  // https://testing-library.com/docs/example-react-router/
  render(<AdminRetrievalsMetrics {...props} />, { wrapper: BrowserRouter })

  // Render(<AdminRetrievalsMetrics retrievals={retrievals} />)
  // todo double check this
  return {
    onFetchAdminMetricsRetrievals,
    onUpdateAdminMetricsRetrievalsStartDate,
    onUpdateAdminMetricsRetrievalsEndDate
  }
}

describe('AdminRetrievals component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getByText('Enter a value for the temporal filter')).toBeInTheDocument()
  })

  describe('when filtering temporally', () => {
    // Todo explain why these are necessary
    beforeAll(() => {
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
    })

    afterEach(() => {
      ReactDOM.createPortal.mockClear()
    })

    test('clicking on the temporal filter modal opens it', async () => {
      const user = userEvent.setup()
      const {
        onFetchAdminMetricsRetrievals,
        onUpdateAdminMetricsRetrievalsStartDate,
        onUpdateAdminMetricsRetrievalsEndDate
      } = setup()

      const temporalFilterButton = screen.getByRole('button', { id: 'temporal-selection-dropdown' })
      await waitFor(async () => {
        await user.click(temporalFilterButton)
      })

      const validEndDate = '2019-03-30T00:00:00.000Z'
      const validStartDate = '2019-03-29T00:00:00.000Z'

      const inputs = screen.getAllByRole('textbox')

      fireEvent.change(inputs[0], { target: { value: validStartDate } })
      fireEvent.change(inputs[1], { target: { value: validEndDate } })

      const applyBtn = screen.getByRole('button', { name: 'Apply' })

      await waitFor(async () => {
        await user.click(applyBtn)
      })

      expect(onUpdateAdminMetricsRetrievalsStartDate).toHaveBeenCalledTimes(1)
      expect(onUpdateAdminMetricsRetrievalsStartDate).toHaveBeenCalledWith(validStartDate)

      expect(onUpdateAdminMetricsRetrievalsEndDate).toHaveBeenCalledTimes(1)
      expect(onUpdateAdminMetricsRetrievalsEndDate).toHaveBeenCalledWith(validEndDate)

      expect(onFetchAdminMetricsRetrievals).toHaveBeenCalledTimes(1)

      const startDateHeader = screen.getAllByRole('heading', { level: 5 })[0]
      const endDateHeader = screen.getAllByRole('heading', { level: 5 })[1]

      expect(startDateHeader.textContent).toEqual(`Start Date:${validStartDate}`)
      expect(endDateHeader.textContent).toEqual(`End Date:${validEndDate}`)
    })
  })
})
