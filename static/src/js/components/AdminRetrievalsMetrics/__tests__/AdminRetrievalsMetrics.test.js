import React from 'react'
import ReactDOM from 'react-dom'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import { BrowserRouter } from 'react-router-dom'

import { AdminRetrievalsMetrics } from '../AdminRetrievalsMetrics'

const setup = () => {
  const retrievalsMetrics = {
    isLoaded: true,
    isLoading: false,
    accessMethodType: {},
    allAccessMethodTypes: [],
    multCollectionResponse: [],
    byAccessMethodType: {},
    startDate: '',
    endDate: ''
  }
  const onFetchAdminRetrievalsMetrics = jest.fn()
  const onUpdateAdminRetrievalsMetricsStartDate = jest.fn()
  const onUpdateAdminRetrievalsMetricsEndDate = jest.fn()
  const onMetricsTemporalFilter = jest.fn()

  const props = {
    onFetchAdminRetrievalsMetrics,
    onUpdateAdminRetrievalsMetricsStartDate,
    onUpdateAdminRetrievalsMetricsEndDate,
    onMetricsTemporalFilter,
    retrievalsMetrics
  }

  render(<AdminRetrievalsMetrics {...props} />, { wrapper: BrowserRouter })

  return {
    onFetchAdminRetrievalsMetrics,
    onUpdateAdminRetrievalsMetricsStartDate,
    onUpdateAdminRetrievalsMetricsEndDate,
    onMetricsTemporalFilter
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

    test('clicking on the temporal filter modal opens it and applies filters with metrics tracking', async () => {
      const user = userEvent.setup()
      const {
        onFetchAdminRetrievalsMetrics,
        onUpdateAdminRetrievalsMetricsStartDate,
        onUpdateAdminRetrievalsMetricsEndDate,
        onMetricsTemporalFilter
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

      expect(onMetricsTemporalFilter).toHaveBeenCalledWith({
        type: 'Set Start Date',
        value: validStartDate
      })

      await userEvent.click(endDate)
      await userEvent.type(endDate, validEndDate)

      expect(onMetricsTemporalFilter).toHaveBeenCalledWith({
        type: 'Set End Date',
        value: validEndDate
      })

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

      expect(onMetricsTemporalFilter).toHaveBeenCalledWith({
        type: 'Apply Temporal Filter',
        value: {
          startDate: validStartDate,
          endDate: updatedEndDate
        }
      })

      const startDateHeader = screen.getAllByRole('heading', { level: 5 })[0]
      const endDateHeader = screen.getAllByRole('heading', { level: 5 })[1]

      expect(startDateHeader.textContent).toEqual(`Start Date:${validStartDate}`)
      expect(endDateHeader.textContent).toEqual(`End Date:${updatedEndDate}`)
    })
  })
})
