import React from 'react'
import { render, screen } from '@testing-library/react'

import { OrderProgressList } from '../OrderProgressList'

import { retrievalStatusPropsEsi } from './mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = () => {
  const { orders } = retrievalStatusPropsEsi

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
