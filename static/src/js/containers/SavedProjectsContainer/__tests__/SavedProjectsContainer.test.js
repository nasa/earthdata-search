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
    <div aria-label="Saved Projects">Saved Projects</div>
  ))
}))

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')
    mapDispatchToProps(dispatch).onChangePath('path')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
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
  test('renders SavedProjects and passes authToken, environment, and onChangePath', () => {
    const mockOnChange = jest.fn()

    render(
      <SavedProjectsContainer
        authToken="TEST123"
        earthdataEnvironment="uat"
        onChangePath={mockOnChange}
      />
    )

    expect(screen.getByText('Saved Projects')).toBeInTheDocument()

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
