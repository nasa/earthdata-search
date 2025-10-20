import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { SavedProjectsContainer } from '../SavedProjectsContainer'

import SavedProjects from '../../../components/SavedProjects/SavedProjects'

jest.mock('../../../components/SavedProjects/SavedProjects', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SavedProjectsContainer
})

describe('SavedProjectsContainer', () => {
  test('renders the SavedProjects component', async () => {
    setup()

    expect(SavedProjects).toHaveBeenCalledTimes(1)
    expect(SavedProjects).toHaveBeenCalledWith({}, {})
  })
})
