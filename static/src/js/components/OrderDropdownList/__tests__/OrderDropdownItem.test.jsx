import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import OrderDropdownItem from '../OrderDropdownItem'

import { retrievalStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

const setup = setupTest({
  Component: OrderDropdownItem,
  defaultProps: {
    order: retrievalStatusPropsEsi.retrieval.retrievalCollections[0].retrievalOrders[0],
    index: 0,
    totalOrders: 2
  }
})

describe('OrderDropdownItem component', () => {
  test('displays the links', () => {
    setup()

    expect(screen.getByText('Order 1/2')).toBeInTheDocument()
    expect(screen.getByText('Order ID: 5000000333461')).toBeInTheDocument()

    expect(screen.getByText('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html')).toBeInTheDocument()
    expect(screen.getByText('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip')).toBeInTheDocument()
  })
})
