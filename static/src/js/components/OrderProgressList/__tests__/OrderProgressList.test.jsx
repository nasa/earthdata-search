import { screen } from '@testing-library/react'

import { OrderProgressList } from '../OrderProgressList'

import { retrievalStatusPropsHarmonyOrder } from './mocks'
import setupTest from '../../../../../../vitestConfigs/setupTest'

const setup = setupTest({
  Component: OrderProgressList,
  defaultProps: {
    retrievalOrders: [retrievalStatusPropsHarmonyOrder]
  }
})

describe('OrderProgressList component', () => {
  test('is displayed', () => {
    setup()
    expect(screen.getByRole('list')).toBeVisible()
  })

  test('renders items', () => {
    setup()
    expect(screen.queryAllByRole('listitem').length).toEqual(1)
  })
})
