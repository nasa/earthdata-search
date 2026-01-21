import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import ProjectCollections from '../ProjectCollections'
import ProjectCollectionsList from '../ProjectCollectionsList'
import ProjectHeader from '../ProjectHeader'

import * as isProjectValid from '../../../util/isProjectValid'
import { validAccessMethod } from '../../../util/accessMethods'
import { metricsDataAccess } from '../../../util/metrics/metricsDataAccess'

vi.mock('../../../util/metrics/metricsDataAccess', () => ({
  metricsDataAccess: vi.fn()
}))

vi.mock('../ProjectCollectionsList', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../ProjectHeader', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: ProjectCollections,
  defaultZustandState: {
    collection: {
      collectionMetadata: {
        collectionId1: {
          mock: 'data 1'
        },
        collectionId2: {
          mock: 'data 2'
        }
      }
    },
    project: {
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false,
            granules: {
              hits: 1
            }
          },
          collectionId2: {
            isValid: false,
            granules: {
              hits: 1
            }
          }
        }
      },
      isSubmitting: false,
      getProjectGranules: vi.fn(),
      removeProjectCollection: vi.fn(),
      toggleCollectionVisibility: vi.fn()
    },
    projectPanels: {
      panels: {
        activePanel: '0.0.0',
        isOpen: false
      },
      setActivePanel: vi.fn(),
      setIsOpen: vi.fn(),
      setPanelSection: vi.fn()
    },
    query: {
      collection: {
        byId: {
          collectionId1: {
            granules: {}
          },
          collectionId2: {
            granules: {}
          }
        },
        pageNum: 1
      }
    }
  }
})

describe('ProjectCollectionsList component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(ProjectHeader).toHaveBeenCalledTimes(1)
    expect(ProjectHeader).toHaveBeenCalledWith({}, {})

    expect(ProjectCollectionsList).toHaveBeenCalledTimes(1)
    expect(ProjectCollectionsList).toHaveBeenCalledWith({
      collectionsMetadata: {
        collectionId1: { mock: 'data 1' },
        collectionId2: { mock: 'data 2' }
      },
      onSetActivePanel: expect.any(Function),
      onSetActivePanelSection: expect.any(Function),
      onTogglePanels: expect.any(Function),
      panels: {
        activePanel: '0.0.0',
        isOpen: false
      }
    }, {})

    const downloadButton = screen.getByRole('button', { name: 'Download project data' })
    expect(downloadButton).toBeInTheDocument()
    expect(downloadButton).toHaveAttribute('disabled')
  })

  describe('help text', () => {
    describe('when all project collections are valid', () => {
      test('displays the correct help text', () => {
        vi.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod
        }))

        setup()

        const message = screen.getByText(`Click ${String.fromCharCode(8220)}Edit Options${String.fromCharCode(8221)} to select options for each collection in your project.`)

        expect(message).toBeInTheDocument()
      })
    })

    describe('when an access method has not been selected', () => {
      test('displays the correct help text', () => {
        vi.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod,
          valid: false
        }))

        setup()

        const message = screen.getByText('Select a data access method for each collection in your project before downloading.')

        expect(message).toBeInTheDocument()
      })
    })

    describe('when an access method needs customization', () => {
      test('displays the correct help text', () => {
        vi.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod,
          valid: false,
          needsCustomization: true
        }))

        setup()

        const message = screen.getByText('One or more collections in your project have an access method selected that requires customization options. Please select a customization option or choose a different access method.')

        expect(message).toBeInTheDocument()
      })
    })

    describe('when a project collection has too many granules', () => {
      test('displays the correct help text', () => {
        vi.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod,
          valid: false,
          tooManyGranules: true
        }))

        setup()

        const message = screen.getByText('One or more collections in your project contains too many granules. Adjust temporal constraints or remove the collections before downloading.')

        expect(message).toBeInTheDocument()
      })
    })

    describe('when a project collection has no granules', () => {
      test('displays the correct help text', () => {
        vi.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
          ...validAccessMethod,
          valid: false,
          noGranules: true
        }))

        setup()

        const message = screen.getByText('One or more collections in your project does not contain granules. Adjust temporal constraints or remove the collections before downloading.')

        expect(message).toBeInTheDocument()
      })
    })
  })

  describe('Download Data button', () => {
    test('is enabled when the project is valid', () => {
      vi.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
        ...validAccessMethod
      }))

      setup()

      const button = screen.getByRole('button', { name: 'Download project data' })

      expect(button).toBeInTheDocument()
      expect(button).not.toHaveAttribute('disabled')
    })

    test('is disabled when the project is invalid', () => {
      vi.spyOn(isProjectValid, 'isProjectValid').mockImplementation(() => ({
        ...validAccessMethod,
        valid: false
      }))

      setup()

      const button = screen.getByRole('button', { name: 'Download project data' })

      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('componentDidUpdate', () => {
    test('calls metricsDataAccess', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId1', 'collectionId2'],
              byId: {
                collectionId1: {
                  isValid: true,
                  granules: {
                    hits: 1
                  }
                },
                collectionId2: {
                  isValid: true,
                  granules: {
                    hits: 1
                  }
                }
              }
            }
          }
        }
      })

      expect(metricsDataAccess).toHaveBeenCalledTimes(2) // 2 collections
      expect(metricsDataAccess).toHaveBeenCalledWith({
        collections: [{ collectionId: 'collectionId1' }],
        type: 'data_access_init'
      })

      expect(metricsDataAccess).toHaveBeenCalledWith({
        collections: [{ collectionId: 'collectionId2' }],
        type: 'data_access_init'
      })
    })
  })
})
