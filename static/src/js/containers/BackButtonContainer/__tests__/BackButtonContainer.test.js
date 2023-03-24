import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'

import BackButtonContainer, { mapDispatchToProps } from '../BackButtonContainer'

import configureStore from '../../../store/configureStore'

import actions from '../../../actions'

const store = configureStore()

const setup = () => {
  const history = createMemoryHistory({
    initialEntries: ['/search']
  })

  render(
    <Provider store={store}>
      <Router history={history}>
        <BackButtonContainer />
      </Router>
    </Provider>
  )

  return { history }
}

beforeEach(() => {
  jest.restoreAllMocks()
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('/search')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('/search')
  })
})

// TODO this test isn't activating the history.listen that is setup in the useEffect
describe.skip('BackButtonContainer', () => {
  test('calls onChangePath when the history is POPed', async () => {
    const changePathMock = jest.spyOn(actions, 'changePath').mockImplementation(() => jest.fn())

    const { history } = setup()

    history.push({
      pathname: '/projects'
    })

    expect(changePathMock).toHaveBeenCalledTimes(0)

    expect(history.location).toEqual(expect.objectContaining({
      pathname: '/projects'
    }))

    history.goBack()
    expect(changePathMock).toHaveBeenCalledTimes(1)

    expect(history.location).toEqual(expect.objectContaining({
      pathname: '/search'
    }))
  })
})
