import React from 'react'
import { screen } from '@testing-library/react'
import { GrowthBookProvider, useFeatureIsOn } from '@growthbook/growthbook-react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import GrowthBookLoader from '../GrowthBookLoader'
import Spinner from '../../Spinner/Spinner'

vi.mock('../../Spinner/Spinner', () => ({ default: vi.fn(() => null) }))
vi.mock('@growthbook/growthbook-react', async () => {
  const actual = await vi.importActual('@growthbook/growthbook-react')

  return {
    ...actual,
    useFeatureIsOn: vi.fn().mockReturnValue(true)
  }
})

const TestComponent = () => (
  <GrowthBookProvider growthbook={{} as never}>
    <GrowthBookLoader>
      <div>Test Children</div>
    </GrowthBookLoader>
  </GrowthBookProvider>
)

const setup = setupTest({
  Component: TestComponent,
  defaultZustandState: {
    growthbook: {
      setFeatureFlags: vi.fn()
    }
  }
})

describe('GrowthBookLoader', () => {
  test('updates zustand store with feature flags', async () => {
    const { zustandState } = setup()

    expect(useFeatureIsOn).toHaveBeenCalledTimes(1)
    expect(useFeatureIsOn).toHaveBeenCalledWith('nlpSearch')

    expect(zustandState.growthbook.setFeatureFlags).toHaveBeenCalledTimes(1)
    expect(zustandState.growthbook.setFeatureFlags).toHaveBeenCalledWith('nlpSearch', true)
  })

  test('saves a user id and session id to localStorage and sessionStorage', async () => {
    const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    const localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    setup()

    expect(localStorageGetItemSpy).toHaveBeenCalledTimes(2)
    expect(localStorageGetItemSpy).toHaveBeenNthCalledWith(1, 'gbUserId')
    expect(localStorageGetItemSpy).toHaveBeenNthCalledWith(2, 'gbSessionId')

    expect(localStorageSetItemSpy).toHaveBeenCalledTimes(2)
    expect(localStorageSetItemSpy).toHaveBeenNthCalledWith(1, 'gbUserId', expect.any(String))
    expect(localStorageSetItemSpy).toHaveBeenNthCalledWith(2, 'gbSessionId', expect.any(String))
  })

  describe('when the user id and session id already exist in localStorage and sessionStorage', () => {
    test('does not overwrite the existing user id and session id', async () => {
      const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-value')
      const localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem')

      setup()

      expect(localStorageGetItemSpy).toHaveBeenCalledTimes(2)
      expect(localStorageGetItemSpy).toHaveBeenNthCalledWith(1, 'gbUserId')
      expect(localStorageGetItemSpy).toHaveBeenNthCalledWith(2, 'gbSessionId')

      expect(localStorageSetItemSpy).toHaveBeenCalledTimes(0)
    })
  })

  test('renders the spinner then the children', async () => {
    setup()

    expect(Spinner).toHaveBeenCalledTimes(1)
    expect(Spinner).toHaveBeenCalledWith({
      type: 'dots',
      className: 'root__spinner spinner spinner--dots spinner--small'
    }, {})

    expect(screen.queryByText('Test Children')).not.toBeInTheDocument()
  })
})
