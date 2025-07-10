import ReactDOM from 'react-dom'
import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { AdminRetrievalsMetrics } from '../AdminRetrievalsMetrics'

const defaultRetrievalsMetrics = {
  isLoaded: true,
  isLoading: false,
  accessMethodType: {},
  allAccessMethodTypes: [],
  multCollectionResponse: [],
  byAccessMethodType: {},
  startDate: '',
  endDate: ''
}
// DatepickerContainer connects to redux store and router
const setup = setupTest({
  Component: AdminRetrievalsMetrics,
  defaultProps: {
    retrievalsMetrics: defaultRetrievalsMetrics,
    onFetchAdminRetrievalsMetrics: jest.fn(),
    onUpdateAdminRetrievalsMetricsStartDate: jest.fn(),
    onUpdateAdminRetrievalsMetricsEndDate: jest.fn()
  },
  withRedux: true,
  withRouter: true
})

describe('AdminRetrievalsMetrics component', () => {
  describe('when the component loads', () => {
    test('prompts the user to enter a temporal filter', () => {
      setup()

      expect(
        screen.getByText('Enter a value for the temporal filter')
      ).toBeInTheDocument()
    })
  })

  describe('when filtering temporally', () => {
    beforeAll(() => {
      ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
    })

    afterEach(() => {
      ReactDOM.createPortal.mockClear()
    })

    test('clicking on the temporal filter modal opens it', async () => {
      const { user, props } = setup()

      const temporalFilterButton = screen.getByRole('button')
      await waitFor(async () => {
        await user.click(temporalFilterButton)
      })

      const validStartDate = '2019-03-29T00:00:00.000Z'
      const validEndDate = '2019-03-30T00:00:00.000Z'

      const updatedEndDate = '2019-03-30T23:59:59.999Z'

      const startDate = screen.getByRole('textbox', { name: 'Start Date' })
      const endDate = screen.getByRole('textbox', { name: 'End Date' })

      await user.click(startDate)
      await user.type(startDate, validStartDate)

      await user.click(endDate)
      await user.type(endDate, validEndDate)

      const applyBtn = screen.getByRole('button', { name: 'Apply' })

      await waitFor(async () => {
        await user.click(startDate)
        await user.click(applyBtn)
      })

      expect(props.onUpdateAdminRetrievalsMetricsStartDate).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAdminRetrievalsMetricsStartDate).toHaveBeenCalledWith(validStartDate)

      expect(props.onUpdateAdminRetrievalsMetricsEndDate).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAdminRetrievalsMetricsEndDate).toHaveBeenCalledWith(updatedEndDate)

      expect(props.onFetchAdminRetrievalsMetrics).toHaveBeenCalledTimes(1)

      const startDateHeader = screen.getAllByRole('heading', { level: 5 })[0]
      const endDateHeader = screen.getAllByRole('heading', { level: 5 })[1]

      expect(startDateHeader.textContent).toEqual(`Start Date:${validStartDate}`)
      expect(endDateHeader.textContent).toEqual(`End Date:${updatedEndDate}`)
    })
  })
})
