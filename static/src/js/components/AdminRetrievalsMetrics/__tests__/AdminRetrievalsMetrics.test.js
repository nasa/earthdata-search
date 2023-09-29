import React from 'react'
import {
  render,
  screen
} from '@testing-library/react'

import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'

import { AdminRetrievalsMetrics } from '../AdminRetrievalsMetrics'
// import { AdminPage } from '../../AdminPage/AdminPage'
// import { AdminRetrievalsMetricsList } from '../AdminRetrievalsMetricsList'

// jest.mock('../../AdminPage/AdminPage')
// jest.mock('../../AdminPage/AdminPage', () => jest.fn(
//   () => <mock-Admin-Retrieval-Metrics>Mock Admin Retrieval Metrics</mock-Admin-Retrieval-Metrics>
// ))

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

  // const props = {
  //   onFetchAdminMetricsRetrievals: jest.fn(),
  //   onUpdateAdminMetricsRetrievalsStartDate: jest.fn(),
  //   onUpdateAdminMetricsRetrievalsEndDate: jest.fn(),
  //   retrievals: {
  //     accessMethodType: {},
  //     allAccessMethodTypes: [],
  //     multCollectionResponse: []
  //   }
  // }

  // TODO  why is this needed as a wrapper exactly?
  // https://testing-library.com/docs/example-react-router/
  render(<AdminRetrievalsMetrics retrievals={retrievals} />, { wrapper: BrowserRouter })

  // render(<AdminRetrievalsMetrics retrievals={retrievals} />)
  // todo double check this
  // return {
  //   props
  // }
}

describe('AdminRetrievals component', () => {
  test('renders itself correctly', () => {
    setup()
    // todo should I test each table header its just static HTML code though
    expect(screen.getByText('Enter a value for the temporal filter'))
      .toBeInTheDocument()
    screen.debug()
    // const { enzymeWrapper } = setup()

    // expect(enzymeWrapper.find(AdminPage).length).toBe(1)
    // expect(enzymeWrapper.find(AdminRetrievalsMetricsList).length).toBe(1)
  })
})
