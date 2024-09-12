import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import SearchTour from '../SearchTour'

// Mock the react-joyride module
jest.mock('react-joyride', () => {
  return jest.fn().mockImplementation(({ callback }) => {
    return (
      <div
        data-testid="mocked-joyride"
        onClick={() => callback({
          action: 'close',
          status: 'FINISHED',
          index: 0,
          type: 'step:after'
        })}
      >
        Mocked Joyride
      </div>
    )
  })
})

// Mock the local storage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

describe('SearchTour', () => {
  const mockSetRunTour = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when rendered', () => {
    it('displays the tour component', () => {
      render(<SearchTour runTour={true} setRunTour={mockSetRunTour} />)
      expect(screen.getByTestId('mocked-joyride')).toBeInTheDocument()
    })
  })
})