import {
  screen,
  waitFor,
  createEvent,
  fireEvent
} from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import {
  GranuleResultsDownloadNotebookButton,
  CustomDownloadNotebookToggle
} from '../GranuleResultsDownloadNotebookButton'
import GET_NOTEBOOK_GRANULES from '../../../operations/queries/getNotebookGranules'
import { buildNotebook } from '../../../util/notebooks/buildNotebook'
import { constructDownloadableFile } from '../../../util/files/constructDownloadableFile'

vi.mock('../../../util/notebooks/buildNotebook', () => ({
  buildNotebook: vi.fn().mockReturnValue({
    fileName: 'test_notebook.ipynb',
    notebook: { mock: 'notebook' }
  })
}))

vi.mock('../../../util/files/constructDownloadableFile', () => ({
  constructDownloadableFile: vi.fn()
}))

Object.defineProperty(window, 'location', {
  get() {
    return { href: 'https://www.test-location.com/?param=value' }
  }
})

const setup = setupTest({
  Component: GranuleResultsDownloadNotebookButton,
  defaultProps: {
    collectionQuerySpatial: {},
    generateNotebookTag: {
      variable_concept_id: 'V2028632042-POCLOUD'
    },
    granuleId: 'G3879539904-POCLOUD'
  },
  defaultApolloClientMocks: [{
    request: {
      query: GET_NOTEBOOK_GRANULES,
      variables: {
        granulesParams: { conceptId: 'G3879539904-POCLOUD' },
        variablesParams: { conceptId: 'V2028632042-POCLOUD' }
      }
    },
    result: {
      data: {
        granules: {
          items: [
            {
              conceptId: 'G3879539904-POCLOUD',
              title: '20251124090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1',
              collection: {
                conceptId: 'C1996881146-POCLOUD',
                shortName: 'MUR-JPL-L4-GLOB-v4.1',
                title: 'GHRSST Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
                variables: {
                  items: [
                    {
                      name: 'analysed_sst'
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    }
  }],
  withApolloClient: true
})

describe('GranuleResultsDownloadNotebookButton component', () => {
  describe('when the Generate Notebook button is clicked', () => {
    describe('when a bounding box is not applied', () => {
      test('downloads the file', async () => {
        const { user } = setup()

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await user.click(dropdownButton)

        const downloadButton = screen.getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(buildNotebook).toHaveBeenCalledTimes(1)
        })

        expect(buildNotebook).toHaveBeenCalledWith({
          boundingBox: undefined,
          granuleId: 'G3879539904-POCLOUD',
          granules: {
            items: [{
              collection: {
                conceptId: 'C1996881146-POCLOUD',
                shortName: 'MUR-JPL-L4-GLOB-v4.1',
                title: 'GHRSST Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
                variables: { items: [{ name: 'analysed_sst' }] }
              },
              conceptId: 'G3879539904-POCLOUD',
              title: '20251124090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1'
            }]
          },
          referrerUrl: 'https://www.test-location.com/?param=value'
        })

        expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
        expect(constructDownloadableFile).toHaveBeenCalledWith(
          JSON.stringify({ mock: 'notebook' }),
          'test_notebook.ipynb',
          'application/x-ipynb+json'
        )
      })
    })

    describe('when a bounding box is applied', () => {
      test('calls onGenerateNotebook with a bounding box', async () => {
        const { user } = setup({
          overrideProps: {
            collectionQuerySpatial: {
              boundingBox: ['-1,0,1,0']
            }
          }
        })

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await user.click(dropdownButton)

        const downloadButton = screen.getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(buildNotebook).toHaveBeenCalledTimes(1)
        })

        expect(buildNotebook).toHaveBeenCalledWith({
          boundingBox: '-1,0,1,0',
          granuleId: 'G3879539904-POCLOUD',
          granules: {
            items: [{
              collection: {
                conceptId: 'C1996881146-POCLOUD',
                shortName: 'MUR-JPL-L4-GLOB-v4.1',
                title: 'GHRSST Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
                variables: { items: [{ name: 'analysed_sst' }] }
              },
              conceptId: 'G3879539904-POCLOUD',
              title: '20251124090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1'
            }]
          },
          referrerUrl: 'https://www.test-location.com/?param=value'
        })

        expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
        expect(constructDownloadableFile).toHaveBeenCalledWith(
          JSON.stringify({ mock: 'notebook' }),
          'test_notebook.ipynb',
          'application/x-ipynb+json'
        )
      })
    })

    describe('when a variable id is not applied', () => {
      test('calls onGenerateNotebook without a variable id', async () => {
        const { user } = setup({
          overrideProps: {
            generateNotebookTag: {}
          },
          overrideApolloClientMocks: [{
            request: {
              query: GET_NOTEBOOK_GRANULES,
              variables: {
                granulesParams: { conceptId: 'G3879539904-POCLOUD' },
                variablesParams: { conceptId: undefined }
              }
            },
            result: {
              data: {
                granules: {
                  items: [
                    {
                      conceptId: 'G3879539904-POCLOUD',
                      title: '20251124090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1',
                      collection: {
                        conceptId: 'C1996881146-POCLOUD',
                        shortName: 'MUR-JPL-L4-GLOB-v4.1',
                        title: 'GHRSST Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
                        variables: {
                          items: [{
                            name: 'analysed_sst'
                          }, {
                            name: 'analysis_error'
                          }, {
                            name: 'lat'
                          }, {
                            name: 'lon'
                          }, {
                            name: 'mask'
                          }, {
                            name: 'sea_ice_fraction'
                          }, {
                            name: 'sst_anomaly'
                          }, {
                            name: 'time'
                          }]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }]
        })

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await user.click(dropdownButton)

        const downloadButton = screen.getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(buildNotebook).toHaveBeenCalledTimes(1)
        })

        expect(buildNotebook).toHaveBeenCalledWith({
          boundingBox: undefined,
          granuleId: 'G3879539904-POCLOUD',
          granules: {
            items: [{
              collection: {
                conceptId: 'C1996881146-POCLOUD',
                shortName: 'MUR-JPL-L4-GLOB-v4.1',
                title: 'GHRSST Level 4 MUR Global Foundation Sea Surface Temperature Analysis (v4.1)',
                variables: {
                  items: [{
                    name: 'analysed_sst'
                  }, {
                    name: 'analysis_error'
                  }, {
                    name: 'lat'
                  }, {
                    name: 'lon'
                  }, {
                    name: 'mask'
                  }, {
                    name: 'sea_ice_fraction'
                  }, {
                    name: 'sst_anomaly'
                  }, {
                    name: 'time'
                  }]
                }
              },
              conceptId: 'G3879539904-POCLOUD',
              title: '20251124090000-JPL-L4_GHRSST-SSTfnd-MUR-GLOB-v02.0-fv04.1'
            }]
          },
          referrerUrl: 'https://www.test-location.com/?param=value'
        })

        expect(constructDownloadableFile).toHaveBeenCalledTimes(1)
        expect(constructDownloadableFile).toHaveBeenCalledWith(
          JSON.stringify({ mock: 'notebook' }),
          'test_notebook.ipynb',
          'application/x-ipynb+json'
        )
      })
    })

    describe('when the request fails', () => {
      test('calls handleError', async () => {
        const { user, zustandState } = setup({
          overrideProps: {
            generateNotebookTag: {}
          },
          overrideApolloClientMocks: [{
            request: {
              query: GET_NOTEBOOK_GRANULES,
              variables: {
                granulesParams: { conceptId: 'G3879539904-POCLOUD' },
                variablesParams: { conceptId: undefined }
              }
            },
            error: new ApolloError({ errorMessage: 'Network error' })
          }],
          overrideZustandState: {
            errors: {
              handleError: vi.fn()
            }
          }
        })

        const dropdownButton = screen.getByLabelText('Download sample notebook')

        await user.click(dropdownButton)

        const downloadButton = screen.getByRole('button', { name: 'Download Notebook' })

        await user.click(downloadButton)

        await waitFor(() => {
          expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        })

        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          action: 'generateNotebook',
          error: new ApolloError({ errorMessage: 'Network error' })
        })

        expect(buildNotebook).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('when clicking the dropdown', () => {
    test('calls stopPropagation', async () => {
      const stopPropagationMock = vi.fn()

      const { user } = setup()

      const dropdownButton = screen.getByLabelText('Download sample notebook')

      await user.click(dropdownButton)

      // eslint-disable-next-line capitalized-comments
      // createEvent and fireEvent are used here to enable mocking of stopPropagation
      const clickEvent = createEvent.click(dropdownButton)
      clickEvent.stopPropagation = stopPropagationMock

      fireEvent(dropdownButton, clickEvent)

      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })
  })
})

const setupCustomToggle = setupTest({
  Component: CustomDownloadNotebookToggle,
  defaultProps: {
    id: 'G-123456789',
    onClick: vi.fn()
  }
})

describe('CustomDownloadNotebookToggle component', () => {
  test('calls expected event methods on download click', async () => {
    const stopPropagationMock = vi.fn()
    const preventDefaultMock = vi.fn()

    const mockClickEvent = {
      stopPropagation: stopPropagationMock,
      preventDefault: preventDefaultMock
    }

    const { props } = setupCustomToggle()

    const dropdownButton = screen.getByLabelText('Download sample notebook')

    // eslint-disable-next-line capitalized-comments
    // createEvent and fireEvent are used here to enable mocking of stopPropagation
    const clickEvent = createEvent.click(dropdownButton)

    clickEvent.stopPropagation = stopPropagationMock
    clickEvent.preventDefault = preventDefaultMock

    fireEvent(dropdownButton, clickEvent)

    expect(mockClickEvent.stopPropagation).toHaveBeenCalledTimes(1)
    expect(mockClickEvent.stopPropagation).toHaveBeenCalledWith()

    expect(mockClickEvent.preventDefault).toHaveBeenCalledTimes(1)
    expect(mockClickEvent.preventDefault).toHaveBeenCalledWith()

    expect(props.onClick).toHaveBeenCalledTimes(1)
    expect(props.onClick).toHaveBeenCalledWith(expect.objectContaining({
      type: 'click'
    }))
  })
})
