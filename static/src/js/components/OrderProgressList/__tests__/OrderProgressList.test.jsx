import { screen } from '@testing-library/react'

import { OrderProgressList } from '../OrderProgressList'

import { retrievalStatusPropsEsi } from './mocks'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: OrderProgressList,
  defaultProps: {
    retrievalOrders: retrievalStatusPropsEsi.orders
  }
})

describe('OrderProgressList component', () => {
  test('is displayed', () => {
    setup()
    expect(screen.getByRole('list')).toBeVisible()
  })

  test('renders items', () => {
    setup()
    expect(screen.queryAllByRole('listitem').length).toEqual(2)
  })
})
