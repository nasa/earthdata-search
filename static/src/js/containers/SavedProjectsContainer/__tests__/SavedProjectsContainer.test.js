import React from 'react'
import { render, screen } from '@testing-library/react'

import actions from '../../../actions'
import {
  mapStateToProps,
  mapDispatchToProps,
  SavedProjectsContainer
} from '../SavedProjectsContainer'
import { SavedProjects } from '../../../components/SavedProjects/SavedProjects'

jest.mock('../../../components/SavedProjects/SavedProjects', () => ({
  SavedProjects: jest.fn(() => (
    <div data-testid="saved-projects">Saved Projects</div>
  ))
}))

describe('mapDispatchToProps', () => {
  it('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')
    mapDispatchToProps(dispatch).onChangePath('path')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })
})

describe('mapStateToProps', () => {
  it('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      earthdataEnvironment: 'prod-env'
    }

    expect(mapStateToProps(store)).toEqual({
      authToken: 'mock-token',
      earthdataEnvironment: 'prod-env'
    })
  })
})

describe('SavedProjectsContainer', () => {
  it('renders SavedProjects and passes authToken, environment, and onChangePath', () => {
    const mockOnChange = jest.fn()

    render(
      <SavedProjectsContainer
        authToken="TEST123"
        earthdataEnvironment="uat"
        onChangePath={mockOnChange}
      />
    )

    expect(screen.getByTestId('saved-projects')).toBeInTheDocument()

    expect(SavedProjects).toHaveBeenCalledTimes(1)
    expect(SavedProjects).toHaveBeenCalledWith(
      expect.objectContaining({
        authToken: 'TEST123',
        earthdataEnvironment: 'uat',
        onChangePath: mockOnChange
      }),
      {}
    )
  })
})
