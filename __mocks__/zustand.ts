// Mock Zustand for tests
// https://zustand.docs.pmnd.rs/guides/testing#vitest

// `vitest` does not automatically clean up between tests
// eslint-disable-next-line testing-library/no-manual-cleanup
import { act, cleanup } from '@testing-library/react'
import { cloneDeep } from 'lodash-es'
import type * as ZustandExportedTypes from 'zustand'

export * from 'zustand'

const { create: actualCreate, createStore: actualCreateStore } = await vi.importActual<typeof ZustandExportedTypes>('zustand')

// A variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>()

const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>
) => {
  const store = actualCreate(stateCreator)
  const initialState = cloneDeep(store.getInitialState())
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })

  return store
}

// When creating a store, we get its initial state, create a reset function and add it in the set
export const create = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>
) => (typeof stateCreator === 'function'
  // To support curried version of create
  ? createUncurried(stateCreator)
  : createUncurried)
) as typeof ZustandExportedTypes.create

const createStoreUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>
) => {
  const store = actualCreateStore(stateCreator)
  const initialState = cloneDeep(store.getInitialState())
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })

  return store
}

// When creating a store, we get its initial state, create a reset function and add it in the set
export const createStore = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>
) => (typeof stateCreator === 'function'
  // To support curried version of createStore
  ? createStoreUncurried(stateCreator)
  : createStoreUncurried)) as typeof ZustandExportedTypes.createStore

// Reset all stores after each test run
afterEach(() => {
  // We need this because vitest does not automatically clean up between tests
  // https://testing-library.com/docs/react-testing-library/api#cleanup
  cleanup()

  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn()
    })
  })
})
