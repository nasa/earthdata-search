import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { collectionListItemProps } from './mocks'
import { retrieveThumbnail } from '../../../util/retrieveThumbnail'

import { CollectionResultsItem } from '../CollectionResultsItem'

jest.mock('../../../../assets/images/image-unavailable.svg', () => 'test-file-stub')
jest.mock('../../../util/retrieveThumbnail')

// Return block is because `PortalFeatureContainer` is a named export
// https://stackoverflow.com/questions/71454705/element-type-is-invalid-expected-a-string-for-built-in-components-or-a-class
jest.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => {
  const mockPortalFeatureContainer = jest.fn(({ children }) => (
    <mock-mockPortalFeatureContainer data-testid="mockPortalFeatureContainer">
      {children}
    </mock-mockPortalFeatureContainer>
  ))

  return mockPortalFeatureContainer
})

const setup = (propsOverride) => {
  const user = userEvent.setup()
  const props = {
    ...collectionListItemProps,
    ...propsOverride
  }
  render(<CollectionResultsItem {...props} />)

  return {
    props,
    user
  }
}

describe('CollectionResultsList component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders itself correctly', async () => {
    setup()
    await waitFor(() => {
      expect(screen.getByTestId('collection-results-item').className).toEqual('collection-results-item')
    })
  })

  test('calls onViewCollectionGranules when clicked', async () => {
    const { props, user } = setup()

    const { onViewCollectionGranules } = props
    const collectionResultLink = screen.getByTestId('collection-result-item_collectionId1')
    user.click(collectionResultLink)

    await waitFor(() => {
      expect(onViewCollectionGranules).toHaveBeenCalledWith('collectionId1')
    })

    expect(onViewCollectionGranules).toHaveBeenCalledTimes(1)
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
        setup()

        const image = screen.getByAltText('Thumbnail for Test Collection')
        expect(image.className).toEqual('collection-results-item__thumb-image collection-results-item__thumb-image--is-loading')
        await waitFor(() => {
          expect(image.className).toEqual('collection-results-item__thumb-image collection-results-item__thumb-image--is-loaded')
        })
      })

      test('renders with a spinner', async () => {
        setup()
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
      const { props, user } = setup()
      const { onViewCollectionGranules } = props
      const collectionDetailsButton = screen.getByRole('button', { name: 'View collection details' })

      user.type(collectionDetailsButton, '{a}')

      await waitFor(() => {
        expect(onViewCollectionGranules).toBeCalledTimes(0)
      })
    })

    test('calls onViewCollectionGranules on enter press', async () => {
      const { props, user } = setup()
      const { onViewCollectionGranules } = props
      const collectionDetailsButton = screen.getByRole('button', { name: 'View collection details' })

      user.type(collectionDetailsButton, '{Enter}')

      await waitFor(() => {
        expect(onViewCollectionGranules).toBeCalledTimes(1)
      })
    })
  })

  test('renders thumbnail correctly', async () => {
    const retrieveThumbnailResponse = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    retrieveThumbnail.mockResolvedValueOnce(retrieveThumbnailResponse)
    setup({
      collectionMetadata: {
        ...collectionListItemProps.collectionMetadata,
        thumbnail: 'default-image',
        isDefaultImage: false
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
      collectionMetadata: {
        ...collectionListItemProps.collectionMetadata,
        thumbnail: 'http://testing-page/default-image',
        isDefaultImage: true
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

    await waitFor(() => {
      const collectionTitle = screen.getByText('Test Collection')
      expect(collectionTitle).toBeInTheDocument()
    })
  })

  describe('collection metadata', () => {
    test('renders a cwic collection correctly', async () => {
      setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          isOpenSearch: true
        }
      })

      await waitFor(() => {
        const cwicTitle = screen.getByText(/Int'l \/ Interagency/i)
        expect(cwicTitle).toBeInTheDocument()
      })
    })

    test('renders single granule correctly', async () => {
      setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          granuleCount: 1
        }
      })

      await waitFor(() => {
        const granuleCount = screen.getByText('1 Granule')
        expect(granuleCount).toBeInTheDocument()
      })
    })

    test('renders no granules correctly', async () => {
      setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          granuleCount: 0
        }
      })

      await waitFor(() => {
        const granuleCount = screen.getByText('0 Granules')
        expect(granuleCount).toBeInTheDocument()
      })
    })

    describe('date range', () => {
      test('with a range', async () => {
        setup()

        await waitFor(() => {
          expect(screen.getByText('2010-10-10 to 2011-10-10')).toBeInTheDocument()
        })
      })

      test('with no end time', async () => {
        setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            temporalRange: '2010-10-10 to Present'
          }
        })

        await waitFor(() => {
          expect(screen.getByText('2010-10-10 to Present')).toBeInTheDocument()
        })
      })

      test('with no start time', async () => {
        setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            temporalRange: 'Up to 2011-10-10'
          }
        })

        await waitFor(() => {
          expect(screen.getByText('Up to 2011-10-10')).toBeInTheDocument()
        })
      })
    })

    describe('map imagery', () => {
      describe('when map imagery is not available', () => {
        test('renders the badge correctly and tooltip correctly', async () => {
          const { user } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasMapImagery: false
            }
          })

          const icon = await screen.findByText('No map imagery')

          await waitFor(() => {
            expect(icon).toBeInTheDocument()
          })

          await waitFor(async () => {
            await user.hover(icon)
          })

          expect(screen.getByText('No map visualization support')).toBeInTheDocument()
        })
      })

      describe('when map imagery is available', () => {
        test('renders the badge correctly and tooltip correctly', async () => {
          const { user } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasMapImagery: true
            }
          })

          const icon = await screen.findByText('Map Imagery')

          await waitFor(() => {
            expect(icon).toBeInTheDocument()
          })

          await waitFor(async () => {
            await user.hover(icon)
          })

          expect(screen.getByText('Supports advanced map visualizations using the GIBS tile service')).toBeInTheDocument()
        })
      })
    })

    describe('near real time', () => {
      test('does not render when hasMapImagery not set', async () => {
        setup()

        await waitFor(() => {
          expect(screen.queryByText('Near Real Time')).not.toBeInTheDocument()
        })
      })

      describe('renders correctly when set', () => {
        test('renders the label correctly', async () => {
          setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              collectionDataType: 'EXPEDITED',
              isNrt: true
            }
          })

          await waitFor(() => {
            expect(screen.getByText('Near Real Time')).toBeInTheDocument()
          })
        })

        test('renders the metadata correctly', async () => {
          setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              collectionDataType: 'EXPEDITED',
              isNrt: true,
              nrt: {
                label: '1 to 4 days',
                description: 'Data is available 1 to 4 days after being acquired by the instrument on the satellite'
              }
            }
          })

          await waitFor(() => {
            expect(screen.getByText('1 to 4 days')).toBeInTheDocument()
          })
        })
      })

      test('renders a tooltip correctly', async () => {
        const { user } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            collectionDataType: 'EXPEDITED',
            isNrt: true,
            nrt: {
              label: '1 to 4 days',
              description: 'Data is available 1 to 4 days after being acquired by the instrument on the satellite'
            }
          }
        })

        user.hover(screen.getByText('Near Real Time'))

        await waitFor(() => {
          expect(screen.getByText('Data is available 1 to 4 days after being acquired by the instrument on the satellite')).toBeInTheDocument()
        })
      })
    })

    describe('customizations', () => {
      describe('when customizations are not available', () => {
        test('renders the badge correctly and tooltip correctly', async () => {
          const { user } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasVariables: true
            }
          })

          const icon = await screen.findByText('Customize')

          await waitFor(() => {
            expect(icon).toBeInTheDocument()
          })

          await waitFor(async () => {
            await user.hover(icon)
          })

          expect(screen.getByText('Supports customization:')).toBeInTheDocument()
          expect(screen.getByText('Variable subset')).toBeInTheDocument()
        })
      })

      describe('when customizations are available', () => {
        test('renders the badge correctly and tooltip correctly', async () => {
          const { user } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata
            }
          })

          const icon = await screen.findByText('No customizations')

          await waitFor(() => {
            expect(icon).toBeInTheDocument()
          })

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
        const { user } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            cloudHosted: false
          }
        })

        const icon = await screen.findByText('Not hosted in Earthdata Cloud')

        await waitFor(() => {
          expect(icon).toBeInTheDocument()
        })

        await waitFor(async () => {
          await user.hover(icon)
        })

        expect(screen.getByText('Dataset is not available in the Earthdata Cloud')).toBeInTheDocument()
      })
    })

    describe('when the collection is hosted in the cloud', () => {
      test('renders the badge correctly and tooltip correctly', async () => {
        const { user } = setup({
          collectionMetadata: {
            ...collectionListItemProps.collectionMetadata,
            cloudHosted: true
          }
        })

        const icon = await screen.findByText('Earthdata Cloud')

        await waitFor(() => {
          expect(icon).toBeInTheDocument()
        })

        await waitFor(async () => {
          await user.hover(icon)
        })

        expect(screen.getByText('Dataset is available in the Earthdata Cloud')).toBeInTheDocument()
      })
    })
  })

  describe('view collection details button', () => {
    test('calls onViewCollectionGranules when clicked', async () => {
      const { props, user } = setup()
      const { onViewCollectionDetails } = props

      user.click(screen.getByRole('button', { name: 'View collection details' }))
      await waitFor(() => {
        expect(onViewCollectionDetails).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('attribution information', () => {
    describe('short name and version information', () => {
      test('renders correctly', async () => {
        setup()
        await waitFor(() => {
          expect(screen.getByText('cId1 v2 - TESTORG')).toBeInTheDocument()
        })
      })
    })

    describe('CSDA', () => {
      test('does not render when isCSDA is not set', async () => {
        setup()
        await waitFor(() => {
          expect(screen.queryByText('CSDA')).not.toBeInTheDocument()
        })
      })

      describe('renders correctly when set', () => {
        test('renders the metadata correctly', async () => {
          setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isCSDA: true
            }
          })

          await waitFor(() => {
            expect(screen.getByText('CSDA')).toBeInTheDocument()
          })
        })

        test('renders a tooltip correctly', async () => {
          const { user } = setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              isCSDA: true
            }
          })

          user.hover(screen.getByText('CSDA'))
          await waitFor(() => {
            expect(screen.getByText('Commercial Smallsat Data Acquisition Program')).toBeInTheDocument()
          })
        })
      })
    })

    describe('consortium metadata', () => {
      test('does not render when the consortium is not set', async () => {
        setup()

        await waitFor(() => {
          expect(screen.queryByText('CWIC')).not.toBeInTheDocument()
        })
      })

      describe('with a single consortium', () => {
        describe('renders correctly when set', () => {
          describe('when CWIC is defined', () => {
            test('renders the metadata correctly', async () => {
              setup({
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['CWIC']
                }
              })

              await waitFor(() => {
                expect(screen.getByText('CWIC')).toBeInTheDocument()
              })
            })

            test('renders a tooltip correctly', async () => {
              const { user } = setup({
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['CWIC']
                }
              })

              user.hover(screen.getByText('CWIC'))
              await waitFor(() => {
                expect(screen.getByText('CEOS WGISS Integrated Catalog')).toBeInTheDocument()
              })
            })
          })

          describe('when GEOSS is defined', () => {
            test('renders the metadata correctly', async () => {
              setup({
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['GEOSS']
                }
              })

              await waitFor(() => {
                expect(screen.getByText('GEOSS')).toBeInTheDocument()
              })
            })

            test('renders a tooltip correctly', async () => {
              const { user } = setup({
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['GEOSS']
                }
              })

              user.hover(screen.getByText('GEOSS'))
              await waitFor(() => {
                expect(screen.getByText('Global Earth Observation System of Systems')).toBeInTheDocument()
              })
            })
          })

          describe('when FEDEO is defined', () => {
            test('renders the metadata correctly', async () => {
              setup({
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['FEDEO']
                }
              })

              await waitFor(() => {
                expect(screen.getByText('FEDEO')).toBeInTheDocument()
              })
            })

            test('renders a tooltip correctly', async () => {
              const { user } = setup({
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['FEDEO']
                }
              })

              user.hover(screen.getByText('FEDEO'))
              await waitFor(() => {
                expect(screen.getByText('Federated EO Gateway')).toBeInTheDocument()
              })
            })
          })

          describe('when CEOS is defined', () => {
            test('renders the metadata correctly', async () => {
              setup({
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['CEOS']
                }
              })

              await waitFor(() => {
                expect(screen.getByText('CEOS')).toBeInTheDocument()
              })
            })

            test('renders a tooltip correctly', async () => {
              const { user } = setup({
                collectionMetadata: {
                  ...collectionListItemProps.collectionMetadata,
                  consortiums: ['CEOS']
                }
              })

              user.hover(screen.getByText('CEOS'))
              await waitFor(() => {
                expect(screen.getByText('Committee on Earth Observation Satellites')).toBeInTheDocument()
              })
            })
          })
        })
      })

      describe('with a multiple consortiums', () => {
        describe('renders correctly when set', () => {
          test('renders the metadata correctly', async () => {
            setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC', 'GEOSS']
              }
            })

            await waitFor(() => {
              expect(screen.getByText('CWIC')).toBeInTheDocument()
            })

            expect(screen.getByText('GEOSS')).toBeInTheDocument()
          })

          test('renders a tooltips correctly', async () => {
            const { user } = setup({
              collectionMetadata: {
                ...collectionListItemProps.collectionMetadata,
                consortiums: ['CWIC', 'GEOSS']
              }
            })

            user.hover(screen.getByText('CWIC'))
            await waitFor(() => {
              expect(screen.getByText('CEOS WGISS Integrated Catalog')).toBeInTheDocument()
            })

            user.hover(screen.getByText('GEOSS'))
            await waitFor(() => {
              expect(screen.getByText('Global Earth Observation System of Systems')).toBeInTheDocument()
            })
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
      user.click(addProjectButton)

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
      const { props, user } = setup()
      const { onAddProjectCollection } = props
      const addProjectButton = screen.getByRole('button', { name: 'Add collection to the current project' })
      user.click(addProjectButton)

      await waitFor(() => {
        expect(onAddProjectCollection).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('removeFromProjectButton', () => {
    test('shows the remove button when the collection is in the project', async () => {
      setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          isCollectionInProject: true
        }
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Remove collection from the current project' })).toBeInTheDocument()
      })
    })

    test('clicking the button removes the collection from the project', async () => {
      const { props, user } = setup({
        collectionMetadata: {
          ...collectionListItemProps.collectionMetadata,
          isCollectionInProject: true
        }
      })
      const { onRemoveCollectionFromProject } = props
      const addProjectButton = screen.getByRole('button', { name: 'Remove collection from the current project' })
      user.click(addProjectButton)

      await waitFor(() => {
        expect(onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
      })
    })
  })
})
