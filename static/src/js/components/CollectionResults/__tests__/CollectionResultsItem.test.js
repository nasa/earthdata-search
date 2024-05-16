import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { collectionListItemProps } from './mocks'
import { retrieveThumbnail } from '../../../util/retrieveThumbnail'
import '@testing-library/jest-dom'

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
  const props = {
    ...collectionListItemProps,
    ...propsOverride
  }
  render(<CollectionResultsItem {...props} />)

  return {
    props
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
    const user = userEvent.setup()
    const { props } = setup()

    const { onViewCollectionGranules } = props
    const collectionResultLink = screen.getByTestId('collection-result-item_collectionId1')
    user.click(collectionResultLink)

    await waitFor(() => {
      expect(onViewCollectionGranules).toHaveBeenCalledWith('collectionId1')
      expect(onViewCollectionGranules).toHaveBeenCalledTimes(1)
    })
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
      const user = userEvent.setup()
      const { props } = setup()
      const { onViewCollectionGranules } = props
      const collectionDetailsButton = screen.getByRole('button', { name: 'View collection details' })
      user.type(collectionDetailsButton, '{a}')

      await waitFor(() => {
        expect(onViewCollectionGranules).toBeCalledTimes(0)
      })
    })

    test('calls onViewCollectionGranules on enter press', async () => {
      const user = userEvent.setup()
      const { props } = setup()
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
      expect(image.alt).toEqual('Thumbnail for Test Collection')
      expect(image.height).toEqual(85)
      expect(image.width).toEqual(85)
    })
  })

  test('renders thumbnail correctly with default image', async () => {
    setup({
      collectionMetadata: {
        ...collectionListItemProps.collectionMetadata,
        thumbnail: 'http://testing-page/default-image',
        isDefaultImage: true
      }
    })

    const image = screen.getByRole('img')
    await waitFor(() => {
      expect(image.src).toEqual('http://testing-page/default-image')
      expect(image.alt).toEqual('Thumbnail for Test Collection')
      expect(image.height).toEqual(85)
      expect(image.width).toEqual(85)
    })
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
            temporalRange: '2010-10-10 ongoing'
          }
        })

        await waitFor(() => {
          expect(screen.getByText('2010-10-10 ongoing')).toBeInTheDocument()
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
      test('does not render when hasMapImagery not set', async () => {
        setup()

        await waitFor(() => {
          expect(screen.queryByText('Map Imagery')).not.toBeInTheDocument()
        })
      })

      describe('renders correctly when set', () => {
        test('renders the badge correctly', async () => {
          setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasMapImagery: true
            }
          })

          await waitFor(() => {
            expect(screen.getByText('Map Imagery')).toBeInTheDocument()
          })
        })

        test('renders a tooltip correctly', async () => {
          const user = userEvent.setup()

          setup({
            collectionMetadata: {
              ...collectionListItemProps.collectionMetadata,
              hasMapImagery: true
            }
          })

          user.hover(screen.getByText('Map Imagery'))
          await waitFor(() => {
            expect(screen.getByText('Supports advanced map visualizations using the GIBS tile service')).toBeInTheDocument()
          })
        })
      })
    })

    describe('near real time', () => {
      test('does not render when hasMapImagery not set', async () => {
        setup()

        await waitFor(() => {
          expect(screen.queryByText('Map Imagery')).not.toBeInTheDocument()
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
        const user = userEvent.setup()

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

        user.hover(screen.getByText('Near Real Time'))

        await waitFor(() => {
          expect(screen.getByText('Data is available 1 to 4 days after being acquired by the instrument on the satellite')).toBeInTheDocument()
        })
      })
    })

    // TODO what is the best way to test the absence of something like this
    describe('customize', () => {
      test('does not render when no customization flags are true', async () => {
        setup({
          collection: collectionListItemProps.collectionMetadata
        })

        await waitFor(() => {
        })

        // Const metaContainer = enzymeWrapper.find('.collection-results-item__meta')
        // const featureItem = metaContainer.find('#feature-icon-list-view__customize')
        // expect(featureItem.length).toEqual(0)
      })
    })
  })

  describe('view collection details button', () => {
    test('calls onViewCollectionGranules when clicked', async () => {
      const user = userEvent.setup()
      const { props } = setup()
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
          const user = userEvent.setup()
          setup({
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
              const user = userEvent.setup()
              setup({
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
              const user = userEvent.setup()
              setup({
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
              const user = userEvent.setup()
              setup({
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
              const user = userEvent.setup()
              setup({
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
              expect(screen.getByText('GEOSS')).toBeInTheDocument()
            })
          })

          test('renders a tooltips correctly', async () => {
            const user = userEvent.setup()
            setup({
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

    test('clicking the button adds the collection to the project', async () => {
      const user = userEvent.setup()
      const { props } = setup()
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
      const user = userEvent.setup()
      const { props } = setup({
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
