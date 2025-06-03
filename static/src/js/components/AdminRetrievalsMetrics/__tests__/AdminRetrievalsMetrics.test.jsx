import ReactDOM from 'react-dom'
import { screen, waitFor } from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import AdminRetrievalsMetrics from '../AdminRetrievalsMetrics'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: AdminRetrievalsMetrics,
  defaultProps: {
    onFetchAdminRetrievalsMetrics: jest.fn(),
    onUpdateAdminRetrievalsMetricsStartDate: jest.fn(),
    onUpdateAdminRetrievalsMetricsEndDate: jest.fn(),
    retrievalsMetrics: {
      isLoaded: true,
      isLoading: false,
      accessMethodType: {},
      allAccessMethodTypes: [],
      multCollectionResponse: [],
      byAccessMethodType: {},
      startDate: '',
      endDate: ''
    }
  },
  withRouter: true,
  withRedux: true
})

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
      const { props, user } = setup()

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

      await user.click(startDate)
      await user.click(applyBtn)

      expect(props.onUpdateAdminRetrievalsMetricsStartDate).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAdminRetrievalsMetricsStartDate).toHaveBeenCalledWith(validStartDate)

      expect(props.onUpdateAdminRetrievalsMetricsEndDate).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAdminRetrievalsMetricsEndDate).toHaveBeenCalledWith(updatedEndDate)

      expect(props.onFetchAdminRetrievalsMetrics).toHaveBeenCalledTimes(1)
      expect(props.onFetchAdminRetrievalsMetrics).toHaveBeenCalledWith()

      const startDateHeader = screen.getAllByRole('heading', { level: 5 })[0]
      const endDateHeader = screen.getAllByRole('heading', { level: 5 })[1]

      expect(startDateHeader.textContent).toEqual(`Start Date:${validStartDate}`)
      expect(endDateHeader.textContent).toEqual(`End Date:${updatedEndDate}`)
    })
  })
})
