import React from 'react'
import { render, screen } from '@testing-library/react'

import { OrderProgressList } from '../OrderProgressList'

import { retrievalStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

function setup() {
  const { orders } = retrievalStatusPropsEsi.retrieval.collections.byId[1]

  const props = {
    orders
  }

  render(<OrderProgressList {...props} />)

  return {
    props
  }
}

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
