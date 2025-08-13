import React from 'react'
import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { collectionListItemProps } from './mocks'
import { retrieveThumbnail } from '../../../util/retrieveThumbnail'

import { CollectionResultsItem } from '../CollectionResultsItem'

jest.mock('../../../../assets/images/image-unavailable.svg', () => 'test-file-stub')
jest.mock('../../../util/retrieveThumbnail')

// Return block is because `PortalFeatureContainer` is a named export
// https://stackoverflow.com/questions/71454705/element-type-is-invalid-expected-a-string-for-built-in-components-or-a-class
jest.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => jest.fn(({ children }) => (
  <div>{children}</div>
)))

const setup = setupTest({
  Component: CollectionResultsItem,
  defaultProps: collectionListItemProps,
  defaultZustandState: {
    focusedCollection: {
      viewCollectionDetails: jest.fn(),
      viewCollectionGranules: jest.fn()
    },
    project: {
      addProjectCollection: jest.fn(),
      removeProjectCollection: jest.fn()
    }
  },
  defaultReduxState: {
    metadata: {
      collections: {
        collectionId1: collectionListItemProps.collectionMetadata
      }
    }
  },
  withRedux: true
})

describe('CollectionResultsList component', () => {
  test('renders itself correctly', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByTestId('collection-results-item').className).toEqual('collection-results-item')
    })
  })

  test('calls viewCollectionGranules when clicked', async () => {
    const { user, zustandState } = setup()

    const collectionResultLink = screen.getByRole('button', {
      name: /Test Collection/
    })

    await user.click(collectionResultLink)

    expect(zustandState.focusedCollection.viewCollectionGranules).toHaveBeenCalledWith('collectionId1')
    expect(zustandState.focusedCollection.viewCollectionGranules).toHaveBeenCalledTimes(1)
  })

  test('renders the add button under PortalFeatureContainer', async () => {
    setup()

    const portalFeatureContainerButton = screen.getByRole('button', {
      name: /Add collection to the current project/i
    })

    await waitFor(() => {
      expect(portalFeatureContainerButton).toBeInTheDocument()
    })
  })

  describe('Browse image thumbnail', () => {
    describe('while the image is loading', () => {
      test('renders with the loading state', async () => {
        const retrieveThumbnailResponse = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        retrieveThumbnail.mockResolvedValueOnce(retrieveThumbnailResponse)

        setup({
          overrideProps: {
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isDefaultImage: false
            }
          }
        })

        const image = screen.getByAltText('Thumbnail for Test Collection')
        expect(image.className).toEqual('collection-results-item__thumb-image collection-results-item__thumb-image--is-loading')

        await waitFor(() => {
          expect(image.className).toEqual('collection-results-item__thumb-image collection-results-item__thumb-image--is-loaded')
        })
      })

      test('renders with a spinner', async () => {
        setup({
          overrideProps: {
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isDefaultImage: false
            }
          }
        })

        expect(screen.getByTestId('collection-results-item-spinner')).toBeInTheDocument()

        await waitFor(() => {
          expect(screen.queryByTestId('collection-results-item-spinner')).not.toBeInTheDocument()
        })
      })
    })

    describe('when the image has loaded', () => {
      test('renders with the loaded state', async () => {
        const retrieveThumbnailResponse = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        retrieveThumbnail.mockResolvedValueOnce(retrieveThumbnailResponse)

        setup()

        await waitFor(() => {
          const image = screen.getByAltText('Thumbnail for Test Collection')
          expect(image.className).toContain('collection-results-item__thumb-image--is-loaded')
        })

        await waitFor(() => {
          const spinner = screen.queryByTestId('collection-results-item-spinner')
          expect(spinner).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('on keypress', () => {
    test('does nothing on non-enter press', async () => {
      const { user, zustandState } = setup()

      const collectionDetailsButton = screen.getByRole('button', { name: 'View collection details' })
      await user.type(collectionDetailsButton, '{a}')

      expect(zustandState.focusedCollection.viewCollectionGranules).toHaveBeenCalledTimes(0)
    })

    test('calls viewCollectionGranules on enter press', async () => {
      const { user, zustandState } = setup()

      const collectionDetailsButton = screen.getByRole('button', { name: 'View collection details' })
      await user.type(collectionDetailsButton, '{Enter}')

      expect(zustandState.focusedCollection.viewCollectionGranules).toHaveBeenCalledTimes(1)
      expect(zustandState.focusedCollection.viewCollectionGranules).toHaveBeenCalledWith('collectionId1')
    })
  })

  test('renders thumbnail correctly', async () => {
    const retrieveThumbnailResponse = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    retrieveThumbnail.mockResolvedValueOnce(retrieveThumbnailResponse)

    setup({
      overrideProps: {
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          thumbnail: 'default-image',
          isDefaultImage: false
        }
      }
    })

    const image = screen.getByAltText('Thumbnail for Test Collection')

    await waitFor(() => {
      expect(image.src).toEqual(retrieveThumbnailResponse)
    })

    expect(image.alt).toEqual('Thumbnail for Test Collection')
    expect(image.height).toEqual(85)
    expect(image.width).toEqual(85)
  })

  test('renders thumbnail correctly with default image', async () => {
    setup({
      overrideProps: {
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          thumbnail: 'http://testing-page/default-image',
          isDefaultImage: true
        }
      }
    })

    const image = screen.getByRole('img', { name: 'Thumbnail for Test Collection' })

    await waitFor(() => {
      expect(image.src).toEqual('http://testing-page/default-image')
    })

    expect(image.alt).toEqual('Thumbnail for Test Collection')
    expect(image.height).toEqual(85)
    expect(image.width).toEqual(85)
  })

  test('renders title correctly', async () => {
    setup()

    expect(screen.getByText('Test Collection')).toBeInTheDocument()
  })

  describe('collection metadata', () => {
    test('renders a cwic collection correctly', () => {
      setup({
        overrideProps: {
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            isOpenSearch: true
          }
        }
      })

      expect(screen.getByText(/Int'l \/ Interagency/i)).toBeInTheDocument()
    })

    test('renders single granule correctly', () => {
      setup({
        overrideProps: {
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            granuleCount: 1
          }
        }
      })

      expect(screen.getByText('1 Granule')).toBeInTheDocument()
    })

    test('renders no granules correctly', () => {
      setup({
        overrideProps: {
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            granuleCount: 0
          }
        }
      })

      expect(screen.getByText('0 Granules')).toBeInTheDocument()
    })

    describe('date range', () => {
      test('with a range', () => {
        setup()

        expect(screen.getByText('2010-10-10 to 2011-10-10')).toBeInTheDocument()
      })

      test('with no end time', () => {
        setup({
          overrideProps: {
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              temporalRange: '2010-10-10 to Present'
            }
          }
        })

        expect(screen.getByText('2010-10-10 to Present')).toBeInTheDocument()
      })

      test('with no start time', () => {
        setup({
          overrideProps: {
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              temporalRange: 'Up to 2011-10-10'
            }
          }
        })

        expect(screen.getByText('Up to 2011-10-10')).toBeInTheDocument()
      })
    })

    describe('map imagery', () => {
      describe('when map imagery is not available', () => {
        test('renders the badge correctly and tooltip correctly', async () => {
          const { user } = setup({
            overrideProps: {
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                hasMapImagery: false
              }
            }
          })

          const icon = await screen.findByText('No map imagery')

          await waitFor(async () => {
            await user.hover(icon)
          })

          expect(screen.getByText('No map visualization support')).toBeInTheDocument()
        })
      })

      describe('when map imagery is available', () => {
        test('renders the badge correctly and tooltip correctly', async () => {
          const { user } = setup({
            overrideProps: {
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                hasMapImagery: true
              }
            }
          })

          const icon = await screen.findByText('Map Imagery')

          await waitFor(async () => {
            await user.hover(icon)
          })

          expect(screen.getByText('Supports advanced map visualizations using the GIBS tile service')).toBeInTheDocument()
        })
      })
    })

    describe('near real time', () => {
      test('does not render when hasMapImagery not set', () => {
        setup()

        expect(screen.queryByText('Near Real Time')).not.toBeInTheDocument()
      })

      describe('renders correctly when set', () => {
        test('renders the label correctly', () => {
          setup({
            overrideProps: {
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                collectionDataType: 'EXPEDITED',
                isNrt: true
              }
            }
          })

          expect(screen.getByText('Near Real Time')).toBeInTheDocument()
        })

        test('renders the metadata correctly', () => {
          setup({
            overrideProps: {
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                collectionDataType: 'EXPEDITED',
                isNrt: true,
                nrt: {
                  label: '1 to 4 days',
                  description: 'Data is available 1 to 4 days after being acquired by the instrument on the satellite'
                }
              }
            }
          })

          expect(screen.getByText('1 to 4 days')).toBeInTheDocument()
        })
      })

      test('renders a tooltip correctly', async () => {
        const { user } = setup({
          overrideProps: {
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              collectionDataType: 'EXPEDITED',
              isNrt: true,
              nrt: {
                label: '1 to 4 days',
                description: 'Data is available 1 to 4 days after being acquired by the instrument on the satellite'
              }
            }
          }
        })

        await waitFor(async () => {
          await user.hover(screen.getByText('Near Real Time'))
        })

        expect(screen.getByText('Data is available 1 to 4 days after being acquired by the instrument on the satellite')).toBeInTheDocument()
      })
    })

    describe('customizations', () => {
      describe('when customizations are available', () => {
        test('renders the badge correctly and tooltip correctly', async () => {
          const { user } = setup({
            overrideProps: {
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                hasVariables: true
              }
            }
          })

          const icon = await screen.findByText('Customize')

          await waitFor(async () => {
            await user.hover(icon)
          })

          expect(screen.getByText('Supports customization:')).toBeInTheDocument()
          expect(screen.getByText('Variable subset')).toBeInTheDocument()
        })
      })

      describe('when customizations are not available', () => {
        test('renders the badge correctly and tooltip correctly', async () => {
          const { user } = setup()

          const icon = await screen.findByText('No customizations')

          await waitFor(async () => {
            await user.hover(icon)
          })

          expect(screen.getByText('No customization support')).toBeInTheDocument()
        })
      })
    })
  })

  describe('cloud hosted', () => {
    describe('when the collection is not hosted in the cloud', () => {
      test('renders the badge correctly and tooltip correctly', async () => {
        const { user } = setup()

        const icon = await screen.findByText('Not hosted in Earthdata Cloud')

        await waitFor(async () => {
          await user.hover(icon)
        })

        expect(screen.getByText('Dataset is not available in the Earthdata Cloud')).toBeInTheDocument()
      })
    })

    describe('when the collection is hosted in the cloud', () => {
      test('renders the badge correctly and tooltip correctly', async () => {
        const { user } = setup({
          overrideProps: {
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              cloudHosted: true
            }
          }
        })

        const icon = await screen.findByText('Earthdata Cloud')

        await waitFor(async () => {
          await user.hover(icon)
        })

        expect(screen.getByText('Dataset is available in the Earthdata Cloud')).toBeInTheDocument()
      })
    })
  })

  describe('view collection details button', () => {
    test('calls viewCollectionDetails when clicked', async () => {
      const { user, zustandState } = setup()

      await user.click(screen.getByRole('button', { name: 'View collection details' }))

      expect(zustandState.focusedCollection.viewCollectionDetails).toHaveBeenCalledTimes(1)
      expect(zustandState.focusedCollection.viewCollectionDetails).toHaveBeenCalledWith('collectionId1')
    })
  })

  describe('attribution information', () => {
    describe('short name and version information', () => {
      test('renders correctly', () => {
        setup()

        expect(screen.getByText('cId1 v2 - TESTORG')).toBeInTheDocument()
      })
    })

    describe('CSDA', () => {
      test('does not render when isCSDA is not set', () => {
        setup()

        expect(screen.queryByText('CSDA')).not.toBeInTheDocument()
      })

      describe('renders correctly when set', () => {
        test('renders the metadata correctly', () => {
          setup({
            overrideProps: {
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                isCSDA: true
              }
            }
          })

          expect(screen.getByText('CSDA')).toBeInTheDocument()
        })

        test('renders a tooltip correctly', async () => {
          const { user } = setup({
            overrideProps: {
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                isCSDA: true
              }
            }
          })

          await waitFor(async () => {
            await user.hover(screen.getByText('CSDA'))
          })

          expect(screen.getByText('Commercial Smallsat Data Acquisition Program')).toBeInTheDocument()
        })
      })
    })

    describe('consortium metadata', () => {
      test('does not render when the consortium is not set', () => {
        setup()

        expect(screen.queryByText('CWIC')).not.toBeInTheDocument()
      })

      describe('with a single consortium', () => {
        describe('renders correctly when set', () => {
          describe('when CWIC is defined', () => {
            test('renders the metadata correctly', () => {
              setup({
                overrideProps: {
                  collectionMetadata: {
                    ...collectionListItemProps.collectionMetadata,
                    consortiums: ['CWIC']
                  }
                }
              })

              expect(screen.getByText('CWIC')).toBeInTheDocument()
            })

            test('renders a tooltip correctly', async () => {
              const { user } = setup({
                overrideProps: {
                  collectionMetadata: {
                    ...collectionListItemProps.collectionMetadata,
                    consortiums: ['CWIC']
                  }
                }
              })

              await waitFor(async () => {
                await user.hover(screen.getByText('CWIC'))
              })

              expect(screen.getByText('CEOS WGISS Integrated Catalog')).toBeInTheDocument()
            })
          })

          describe('when GEOSS is defined', () => {
            test('renders the metadata correctly', () => {
              setup({
                overrideProps: {
                  collectionMetadata: {
                    ...collectionListItemProps.collectionMetadata,
                    consortiums: ['GEOSS']
                  }
                }
              })

              expect(screen.getByText('GEOSS')).toBeInTheDocument()
            })

            test('renders a tooltip correctly', async () => {
              const { user } = setup({
                overrideProps: {
                  collectionMetadata: {
                    ...collectionListItemProps.collectionMetadata,
                    consortiums: ['GEOSS']
                  }
                }
              })

              await waitFor(async () => {
                await user.hover(screen.getByText('GEOSS'))
              })

              expect(screen.getByText('Global Earth Observation System of Systems')).toBeInTheDocument()
            })
          })

          describe('when FEDEO is defined', () => {
            test('renders the metadata correctly', () => {
              setup({
                overrideProps: {
                  collectionMetadata: {
                    ...collectionListItemProps.collectionMetadata,
                    consortiums: ['FEDEO']
                  }
                }
              })

              expect(screen.getByText('FEDEO')).toBeInTheDocument()
            })

            test('renders a tooltip correctly', async () => {
              const { user } = setup({
                overrideProps: {
                  collectionMetadata: {
                    ...collectionListItemProps.collectionMetadata,
                    consortiums: ['FEDEO']
                  }
                }
              })

              await waitFor(async () => {
                await user.hover(screen.getByText('FEDEO'))
              })

              expect(screen.getByText('Federated EO Gateway')).toBeInTheDocument()
            })
          })

          describe('when CEOS is defined', () => {
            test('renders the metadata correctly', () => {
              setup({
                overrideProps: {
                  collectionMetadata: {
                    ...collectionListItemProps.collectionMetadata,
                    consortiums: ['CEOS']
                  }
                }
              })

              expect(screen.getByText('CEOS')).toBeInTheDocument()
            })

            test('renders a tooltip correctly', async () => {
              const { user } = setup({
                overrideProps: {
                  collectionMetadata: {
                    ...collectionListItemProps.collectionMetadata,
                    consortiums: ['CEOS']
                  }
                }
              })

              await waitFor(async () => {
                await user.hover(screen.getByText('CEOS'))
              })

              expect(screen.getByText('Committee on Earth Observation Satellites')).toBeInTheDocument()
            })
          })
        })
      })

      describe('with a multiple consortiums', () => {
        describe('renders correctly when set', () => {
          test('renders the metadata correctly', () => {
            setup({
              overrideProps: {
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['CWIC', 'GEOSS']
                }
              }
            })

            expect(screen.getByText('CWIC')).toBeInTheDocument()
            expect(screen.getByText('GEOSS')).toBeInTheDocument()
          })

          test('renders a tooltips correctly', async () => {
            const { user } = setup({
              overrideProps: {
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['CWIC', 'GEOSS']
                }
              }
            })

            await waitFor(async () => {
              await user.hover(screen.getByText('CWIC'))
            })

            expect(screen.getByText('CEOS WGISS Integrated Catalog')).toBeInTheDocument()

            await waitFor(async () => {
              await user.hover(screen.getByText('GEOSS'))
            })

            expect(screen.getByText('Global Earth Observation System of Systems')).toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('addToProjectButton', () => {
    test('shows the add button when the collection is not in the project', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Add collection to the current project' })).toBeInTheDocument()
      })
    })

    test('clicking the button calls onMetricsAddCollectionProject', async () => {
      const { props, user } = setup()

      const addProjectButton = screen.getByRole('button', { name: 'Add collection to the current project' })
      await user.click(addProjectButton)

      await waitFor(() => {
        expect(props.onMetricsAddCollectionProject).toHaveBeenCalledTimes(1)
      })

      expect(props.onMetricsAddCollectionProject).toHaveBeenCalledWith({
        collectionConceptId: 'collectionId1',
        view: 'list',
        page: 'collections'
      })
    })

    test('clicking the button adds the collection to the project', async () => {
      const { user, zustandState } = setup()

      const addProjectButton = screen.getByRole('button', { name: 'Add collection to the current project' })
      await user.click(addProjectButton)

      expect(zustandState.project.addProjectCollection).toHaveBeenCalledTimes(1)
      expect(zustandState.project.addProjectCollection).toHaveBeenCalledWith('collectionId1')
    })
  })

  describe('removeFromProjectButton', () => {
    test('shows the remove button when the collection is in the project', async () => {
      setup({
        overrideProps: {
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            isCollectionInProject: true
          }
        }
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Remove collection from the current project' })).toBeInTheDocument()
      })
    })

    test('clicking the button removes the collection from the project', async () => {
      const { user, zustandState } = setup({
        overrideProps: {
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            isCollectionInProject: true
          }
        }
      })

      const addProjectButton = screen.getByRole('button', { name: 'Remove collection from the current project' })
      await user.click(addProjectButton)

      expect(zustandState.project.removeProjectCollection).toHaveBeenCalledTimes(1)
      expect(zustandState.project.removeProjectCollection).toHaveBeenCalledWith('collectionId1')
    })
  })
})
