import useEdscStore from '../../useEdscStore'

import { getSavedProject, getSavedProjectName } from '../savedProject'

const mockProject = {
  id: '123',
  name: 'Test Project',
  path: '/path/to/project'
}

describe('savedProject selectors', () => {
  describe('getSavedProject', () => {
    test('returns the saved project', () => {
      useEdscStore.setState((state) => {
        state.savedProject.project = mockProject
      })

      const savedProject = getSavedProject(useEdscStore.getState())
      expect(savedProject).toEqual(mockProject)
    })
  })

  describe('getSavedProjectName', () => {
    test('returns the saved project name', () => {
      useEdscStore.setState((state) => {
        state.savedProject.project = mockProject
      })

      const savedProjectName = getSavedProjectName(useEdscStore.getState())
      expect(savedProjectName).toEqual(mockProject.name)
    })
  })
})
