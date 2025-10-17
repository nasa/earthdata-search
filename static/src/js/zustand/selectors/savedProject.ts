import { EdscStore } from '../types'

/**
 * Retrieve the saved project
 */
export const getSavedProject = (state: EdscStore) => state.savedProject.project

/**
 * Retrieve the saved project name
 */
export const getSavedProjectName = (state: EdscStore) => {
  const project = getSavedProject(state)

  return project?.name
}
