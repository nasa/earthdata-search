import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'

import { mapDispatchToProps, SavedProjectsContainer } from '../SavedProjectsContainer'

import SavedProjects from '../../../components/SavedProjects/SavedProjects'

jest.mock('../../../components/SavedProjects/SavedProjects', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SavedProjectsContainer,
  defaultProps: {
    onHandleError: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onHandleError calls actions.handleError', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'handleError')
    const errorConfig = { error: 'test-error' }

    mapDispatchToProps(dispatch).onHandleError(errorConfig)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(errorConfig)
  })
})

describe('SavedProjectsContainer', () => {
  test('renders the SavedProjects component', async () => {
    const { props } = setup()

    expect(SavedProjects).toHaveBeenCalledTimes(1)
    expect(SavedProjects).toHaveBeenCalledWith({
      onHandleError: props.onHandleError
    }, {})
  })
})
