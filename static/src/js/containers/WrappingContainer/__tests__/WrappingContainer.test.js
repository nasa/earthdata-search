import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WrappingContainer from '../WrappingContainer'

const setup = (initialEntries, overrideProps) => {
  const props = {
    location: {
      pathname: '',
      search: ''
    },
    children: <div data-testid="test-child">Im a child!</div>,
    ...overrideProps
  }

  render(
    <MemoryRouter initialEntries={initialEntries}>
      <WrappingContainer {...props} />
    </MemoryRouter>
  )

  return { props }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('WrappingContainer component', () => {
  test('renders container and the children', async () => {
    setup()
    expect(screen.getByTestId('test-child').parentElement.className).toEqual('wrapping-container')
  })

  describe('when in a route that does not include the map', () => {
    test('does not render classname on saved projects', async () => {
      setup(['/contact-info'])
      expect(screen.getByTestId('test-child').parentElement.className).toEqual('wrapping-container')
    })
  })

  describe('when in a route that includes the map', () => {
    describe('project page', () => {
      test('does not include map classname on saved projects', async () => {
        setup(['/projects'])

        expect(screen.getByTestId('test-child').parentElement.className).toEqual('wrapping-container')
      })

      test('includes map classname on project page', async () => {
        const mockLocation = [{
          pathname: '/projects',
          search: '?projectid=1'
        }]

        setup(mockLocation)

        expect(screen.getByTestId('test-child').parentElement.className).toEqual('wrapping-container wrapping-container--map-page')
      })
    })

    describe('search page', () => {
      test('includes map classname on search route', async () => {
        setup(['/search'])

        expect(screen.getByTestId('test-child').parentElement.className).toEqual('wrapping-container wrapping-container--map-page')
      })
    })
  })
})
