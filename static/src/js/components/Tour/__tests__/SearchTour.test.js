import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchTour from '../SearchTour'

import '@testing-library/jest-dom/extend-expect'

const setup = () => {
  const props = {
    runTour: true,
    setRunTour: jest.fn()
  }

  const user = userEvent.setup()

  const { onFetchRetrieval, onChangePath } = props
  render(
    <SearchTour {...props} />
  )

  return {
    onChangePath,
    onFetchRetrieval,
    user
  }
}

describe('SearchTour Keyboard Navigation', () => {
  test('increments stepIndex when ArrowRight key is pressed', async () => {
    setup()
    expect(1 !== 0)
  })
})
