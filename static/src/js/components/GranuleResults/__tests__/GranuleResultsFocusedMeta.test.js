import React from 'react'

import {
  act,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import EDSCImage from '../../EDSCImage/EDSCImage'

import GranuleResultsFocusedMeta from '../GranuleResultsFocusedMeta'

jest.mock('../../EDSCImage/EDSCImage', () => jest.fn(({ className }) => <div className={className} data-testid="mock-edsc-image">EDSC Image</div>))

const setup = (overrideProps) => {
  const onMetricsBrowseGranuleImage = jest.fn()
  const props = {
    focusedGranuleMetadata: {
      browseFlag: false,
      title: '1234 Test'
    },
    focusedGranuleId: 'G-1234-TEST',
    onMetricsBrowseGranuleImage,
    ...overrideProps
  }

  render(
    <GranuleResultsFocusedMeta {...props} />
  )

  return {
    onMetricsBrowseGranuleImage
  }
}

describe('GranuleResultsFocusedMeta component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when no links are provided', () => {
    test('should not render', () => {
      setup()

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).not.toBeInTheDocument()
    })
  })

  describe('when the browse flag is false', () => {
    test('should not render', () => {
      setup({
        focusedGranuleMetadata: {
          browseFlag: false,
          links: [{
            href: 'http://test.com/test.jpg',
            rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
          }],
          title: '1234 Test'
        }
      })

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).not.toBeInTheDocument()
    })
  })

  describe('when links are provided', () => {
    test('should render', async () => {
      setup({
        focusedGranuleMetadata: {
          browseFlag: true,
          links: [{
            href: 'http://test.com/test.jpg',
            rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
          }],
          title: '1234 Test'
        }
      })

      const focusedMeta = await screen.findByTestId('granule-results-focused-meta')
      expect(focusedMeta).toBeInTheDocument()
    })

    describe('when clicking the expand button', () => {
      test('should render a modal', async () => {
        const user = userEvent.setup()

        const { onMetricsBrowseGranuleImage } = setup({
          focusedGranuleMetadata: {
            browseFlag: true,
            links: [{
              href: 'http://test.com/test.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            }],
            title: '1234 Test'
          }
        })

        const expandButton = screen.getByRole('button', { name: 'Expand browse image' })

        await act(async () => {
          await user.click(expandButton)
        })

        const modal = await screen.findByTestId('granule-results-focused-meta-modal')

        expect(modal).toBeInTheDocument()
        expect(onMetricsBrowseGranuleImage).toHaveBeenCalledTimes(1)
        expect(onMetricsBrowseGranuleImage).toHaveBeenCalledWith({
          modalOpen: false,
          granuleId: 'G-1234-TEST',
          value: 'Expand'
        })
      })

      test('should not render modal navigation', async () => {
        const user = userEvent.setup()

        setup({
          focusedGranuleMetadata: {
            browseFlag: true,
            links: [{
              href: 'http://test.com/test.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            }],
            title: '1234 Test'
          }
        })

        const expandButton = screen.getByRole('button', { name: 'Expand browse image' })

        await act(async () => {
          await user.click(expandButton)
        })

        const modal = await screen.findByTestId('granule-results-focused-meta-modal')
        const modalPrev = within(modal).queryByLabelText('Previous browse image')
        const modalNext = within(modal).queryByLabelText('Next browse image')

        const modalPopoverButton = within(modal).queryByLabelText('View available browse imagery')
        expect(modalPrev).not.toBeInTheDocument()
        expect(modalNext).not.toBeInTheDocument()
        expect(modalPopoverButton).not.toBeInTheDocument()
      })
    })

    describe('when multiple links are provided', () => {
      test('should render the navigation', async () => {
        setup({
          focusedGranuleMetadata: {
            browseFlag: true,
            links: [{
              href: 'http://test.com/test.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            },
            {
              href: 'http://test.com/test-2.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            },
            {
              href: 'http://test.com/test-3.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            }],
            title: '1234 Test'
          }
        })

        // Find the label to await for the changes to modal then do the rest of the assertions
        const prevButton = await screen.findByLabelText('Previous browse image thumbnail')
        const nextButton = screen.getByLabelText('Next browse image thumbnail')
        const pagination = screen.getByText('1/3')
        const popoverListButton = screen.getByLabelText('View available browse imagery')

        expect(prevButton).toBeInTheDocument()
        expect(pagination).toBeInTheDocument()
        expect(popoverListButton).toBeInTheDocument()
        expect(nextButton).toBeInTheDocument()
      })

      describe('when the selection button is clicked', () => {
        test('should render the popover selection menu', async () => {
          const user = userEvent.setup()

          setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-2.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-3.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          })

          const popoverListButton = screen.getByLabelText('View available browse imagery')

          await act(async () => {
            await user.click(popoverListButton)
          })

          const popoverList = await screen.findAllByTestId('granule-results-focused-meta-list')
          const popoverListItems = screen.getAllByText('.jpg', { exact: false })

          expect(popoverList.length).toEqual(1)
          expect(popoverListItems.length).toEqual(3)
        })

        test('should hide the tooltip', async () => {
          const user = userEvent.setup()

          setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-2.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-3.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          })

          const overlayWrapper = await screen.findByTestId('granule-results-focused-meta-overlay-wrapper')
          const popoverListButton = await screen.findByLabelText('View available browse imagery')

          // Tool-tip hover
          await user.hover(overlayWrapper)

          await waitFor(() => {
            const tooltip = screen.queryByTestId('granule-results-focused-meta-tooltip')
            expect(tooltip).toBeInTheDocument()
          })

          // Click to disappear tool-tip
          await act(async () => {
            await user.click(popoverListButton)
          })

          // Use `queryBy` since the element is expected to be gone
          await waitFor(() => {
            const tooltipAfter = screen.queryByTestId('granule-results-focused-meta-tooltip')
            expect(tooltipAfter).not.toBeInTheDocument()
          })
        })
      })

      describe('when clicking the next button', () => {
        test('should cycle the images', async () => {
          const user = userEvent.setup()

          const { onMetricsBrowseGranuleImage } = setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-2.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-3.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          })

          const nextButton = screen.getByRole('button', { name: 'Next browse image thumbnail' })

          await act(async () => {
            await user.click(nextButton)
          })

          const images = await screen.findAllByTestId('mock-edsc-image')
          const pagination = screen.queryByText('2/3')

          expect(images.length).toEqual(3)
          expect(images[1]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()

          expect(onMetricsBrowseGranuleImage).toBeCalledTimes(1)
          expect(onMetricsBrowseGranuleImage).toHaveBeenCalledWith({
            modalOpen: false,
            granuleId: 'G-1234-TEST',
            value: 'Next'
          })
        })
      })

      describe('when clicking the previous button', () => {
        test('should cycle the images', async () => {
          const user = userEvent.setup()

          const { onMetricsBrowseGranuleImage } = setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-2.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-3.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          })

          const nextButton = screen.getByLabelText('Next browse image thumbnail')
          const prevButton = screen.getByLabelText('Previous browse image thumbnail')

          await act(async () => {
            await user.click(nextButton)
            await user.click(prevButton)
          })

          const images = screen.queryAllByTestId('mock-edsc-image')
          const pagination = screen.queryByText('1/3')

          expect(images.length).toEqual(3)
          expect(images[0]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()

          expect(onMetricsBrowseGranuleImage).toBeCalledTimes(2)
          expect(onMetricsBrowseGranuleImage).toHaveBeenCalledWith({
            modalOpen: false,
            granuleId: 'G-1234-TEST',
            value: 'Previous'
          })
        })
      })

      describe('when clicking the list button', () => {
        test('should select the image and close the popover', async () => {
          const user = userEvent.setup()

          const { onMetricsBrowseGranuleImage } = setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-2.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-3.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          })

          const popoverListButton = screen.getByLabelText('View available browse imagery')

          await act(async () => {
            await user.click(popoverListButton)
          })

          const popoverList = await screen.findByTestId('granule-results-focused-meta-list')

          const popoverListItem = within(popoverList).queryByText('test-3.jpg')

          await user.click(popoverListItem)

          const pagination = screen.queryByText('3/3')
          const images = screen.queryAllByTestId('mock-edsc-image')

          expect(popoverList).not.toBeInTheDocument()
          expect(images[2]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()

          expect(onMetricsBrowseGranuleImage).toBeCalledTimes(1)
          expect(onMetricsBrowseGranuleImage).toHaveBeenCalledWith({
            modalOpen: false,
            granuleId: 'G-1234-TEST',
            value: 'View List'
          })
        })
      })

      describe('when clicking fully through the images with the next button', () => {
        test('should repeat the images', async () => {
          const user = userEvent.setup()

          setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-2.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          })

          const nextButton = screen.getByLabelText('Next browse image thumbnail')

          await act(async () => {
            await user.click(nextButton)
            await user.click(nextButton)
          })

          const images = screen.queryAllByTestId('mock-edsc-image')
          const pagination = screen.queryByText('1/2')

          expect(images.length).toEqual(2)
          expect(images[0]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()
        })
      })

      describe('when clicking fully through the images with the previous button', () => {
        test('should repeat the images', async () => {
          const user = userEvent.setup()

          setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-2.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'

            }
          })

          const prevButton = screen.getByLabelText('Previous browse image thumbnail')

          await act(async () => {
            await user.click(prevButton)
          })

          const images = screen.queryAllByTestId('mock-edsc-image')
          const pagination = screen.queryByText('2/2')

          expect(images.length).toEqual(2)
          expect(images[1]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()
        })
      })

      describe('when clicking the expand button', () => {
        test('should render modal navigation', async () => {
          const user = userEvent.setup()

          setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-2.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              },
              {
                href: 'http://test.com/test-3.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          })

          const expandButton = screen.getByLabelText('Expand browse image')

          await act(async () => {
            await user.click(expandButton)
          })

          const modal = await screen.findByTestId('granule-results-focused-meta-modal')
          const modalPrev = within(modal).queryByLabelText('Previous browse image')
          const modalNext = within(modal).queryByLabelText('Next browse image')
          const modalPopoverButton = await within(modal).findByLabelText('View available browse imagery')

          expect(modalPrev).toBeInTheDocument()
          expect(modalNext).toBeInTheDocument()
          expect(modalPopoverButton).toBeInTheDocument()
        })

        test('displays a larger image', async () => {
          const user = userEvent.setup()

          setup({
            focusedGranuleMetadata: {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          })

          const expandButton = screen.getByLabelText('Expand browse image')

          expect(EDSCImage).toHaveBeenCalledTimes(1)

          EDSCImage.mockClear()

          await act(async () => {
            await user.click(expandButton)
          })

          const modal = await screen.findByTestId('granule-results-focused-meta-modal')
          const image = within(modal).getByTestId('mock-edsc-image')

          expect(image).toBeInTheDocument()
          expect(EDSCImage).toHaveBeenLastCalledWith(expect.objectContaining({
            src: expect.stringContaining('/scale/granules/G-1234-TEST?h=538&w=538&imageSrc=http://test.com/test.jpg')
          }), {})
        })

        describe('when clicking the close button', () => {
          test('should close the modal', async () => {
            const user = userEvent.setup()

            setup({
              focusedGranuleMetadata: {
                browseFlag: true,
                links: [{
                  href: 'http://test.com/test.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-2.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-3.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            })

            const expandButton = screen.getByLabelText('Expand browse image')

            await act(async () => {
              await user.click(expandButton)
            })

            const modal = await screen.findByTestId('granule-results-focused-meta-modal')
            const modalCloseButton = within(modal).getByRole('button', { name: 'Close EDSCModal' })

            await act(async () => {
              await user.click(modalCloseButton)
            })

            // Must use `queryBy` since the element is no longer on the DOM
            const modalUpdated = screen.queryByTestId('granule-results-focused-meta-modal')

            expect(modalUpdated).not.toBeInTheDocument()
          })
        })

        describe('when clicking the next button', () => {
          test('should cycle the images', async () => {
            const user = userEvent.setup()

            const { onMetricsBrowseGranuleImage } = setup({
              focusedGranuleMetadata: {
                browseFlag: true,
                links: [{
                  href: 'http://test.com/test.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-2.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-3.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            })

            const expandButton = screen.getByLabelText('Expand browse image')

            await act(async () => {
              await user.click(expandButton)
            })

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalNext = within(modal).queryByLabelText('Next browse image')

            await user.click(modalNext)

            const images = within(modal).queryAllByTestId('mock-edsc-image')
            const pagination = within(modal).queryByText('2/3')

            expect(images.length).toEqual(3)
            expect(images[1]).toHaveClass('granule-results-focused-meta__full--is-active')
            expect(pagination).toBeInTheDocument()

            // Tracks Expand and Next
            expect(onMetricsBrowseGranuleImage).toBeCalledTimes(2)
            expect(onMetricsBrowseGranuleImage).toHaveBeenCalledWith({
              modalOpen: true,
              granuleId: 'G-1234-TEST',
              value: 'Next'
            })
          })
        })

        describe('when clicking the previous button', () => {
          test('should cycle the images', async () => {
            const user = userEvent.setup()

            const { onMetricsBrowseGranuleImage } = setup({
              focusedGranuleMetadata: {
                browseFlag: true,
                links: [{
                  href: 'http://test.com/test.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-2.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-3.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            })

            const expandButton = screen.getByLabelText('Expand browse image')

            await act(async () => {
              await user.click(expandButton)
            })

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalNext = within(modal).queryByLabelText('Next browse image')
            const modalPrev = within(modal).queryByLabelText('Previous browse image')

            await user.click(modalNext)
            await user.click(modalPrev)

            const images = within(modal).queryAllByTestId('mock-edsc-image')
            const pagination = within(modal).queryByText('1/3')

            expect(images.length).toEqual(3)
            expect(images[0]).toHaveClass('granule-results-focused-meta__full--is-active')
            expect(pagination).toBeInTheDocument()

            // Tracks Expand, Next, and Previous
            expect(onMetricsBrowseGranuleImage).toBeCalledTimes(3)
            expect(onMetricsBrowseGranuleImage).toHaveBeenCalledWith({
              modalOpen: true,
              granuleId: 'G-1234-TEST',
              value: 'Previous'
            })
          })
        })

        describe('when clicking the list button', () => {
          test('should select the image and close the popover', async () => {
            const user = userEvent.setup()

            const { onMetricsBrowseGranuleImage } = setup({
              focusedGranuleMetadata: {
                browseFlag: true,
                links: [{
                  href: 'http://test.com/test.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-2.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-3.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            })

            const expandButton = screen.getByLabelText('Expand browse image')

            await act(async () => {
              await user.click(expandButton)
            })

            const modal = screen.getByTestId('granule-results-focused-meta-modal')

            const popoverListButton = within(modal).queryByLabelText('View available browse imagery')

            await act(async () => {
              await user.click(popoverListButton)
            })

            const popoverList = screen.queryByTestId('granule-results-focused-meta-modal-popover-list')
            const popoverListItem = within(popoverList).queryByText('test-3.jpg')

            await user.click(popoverListItem)

            const pagination = within(modal).queryByText('3/3')
            const images = within(modal).queryAllByTestId('mock-edsc-image')

            expect(popoverList).not.toBeInTheDocument()
            expect(images[2]).toHaveClass('granule-results-focused-meta__full--is-active')
            expect(pagination).toBeInTheDocument()

            expect(onMetricsBrowseGranuleImage).toBeCalledTimes(2)
            expect(onMetricsBrowseGranuleImage).toHaveBeenCalledWith({
              modalOpen: true,
              granuleId: 'G-1234-TEST',
              value: 'View List'
            })
          })
        })

        describe('when clicking fully through the images with the next button', () => {
          test('should repeat the images', async () => {
            const user = userEvent.setup()

            setup({
              focusedGranuleMetadata: {
                browseFlag: true,
                links: [{
                  href: 'http://test.com/test.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-2.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            })

            const expandButton = screen.getByLabelText('Expand browse image')

            await act(async () => {
              await user.click(expandButton)
            })

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalNext = within(modal).queryByLabelText('Next browse image')

            await user.click(modalNext)
            await user.click(modalNext)

            const images = within(modal).queryAllByTestId('mock-edsc-image')
            const pagination = within(modal).queryByText('1/2')

            expect(images.length).toEqual(2)
            expect(images[0]).toHaveClass('granule-results-focused-meta__full--is-active')
            expect(pagination).toBeInTheDocument()
          })
        })

        describe('when attempting to download the image', () => {
          test('should select granule link to open', async () => {
            const user = userEvent.setup()
            const focusedGranuleLink = 'http://test.com/test.jpg'

            const { onMetricsBrowseGranuleImage } = setup({
              focusedGranuleMetadata: {
                browseFlag: true,
                links: [{
                  href: focusedGranuleLink,
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-2.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            })

            const expandButton = screen.getByLabelText('Expand browse image')
            await act(async () => {
              await user.click(expandButton)
            })

            const downloadButton = screen.getByRole('button', { name: 'Download browse image' })

            expect(downloadButton).toHaveAttribute('href', focusedGranuleLink)

            await user.click(downloadButton)

            expect(onMetricsBrowseGranuleImage).toBeCalledTimes(2)
            expect(onMetricsBrowseGranuleImage).toHaveBeenCalledWith({
              modalOpen: true,
              granuleId: 'G-1234-TEST',
              value: 'Download'
            })
          })
        })

        describe('when clicking fully through the images with the previous button', () => {
          test('should repeat the images', async () => {
            const user = userEvent.setup()

            setup({
              focusedGranuleMetadata: {
                browseFlag: true,
                links: [{
                  href: 'http://test.com/test.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                },
                {
                  href: 'http://test.com/test-2.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            })

            const expandButton = screen.getByRole('button', { name: 'Expand browse image' })
            await act(async () => {
              await user.click(expandButton)
            })

            const granuleResultsFocusedMeta = await screen.findByTestId('granule-results-focused-meta-modal')

            expect(granuleResultsFocusedMeta).toBeInTheDocument()

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalPrev = within(modal).getByRole('button', { name: 'Previous browse image' })

            await act(async () => {
              await user.click(modalPrev)
            })

            await waitFor(() => {
              const images = within(modal).queryAllByTestId('mock-edsc-image')
              const pagination = within(modal).queryByText('2/2')

              expect(images.length).toEqual(2)
              expect(images[1]).toHaveClass('granule-results-focused-meta__full--is-active')
              expect(pagination).toBeInTheDocument()
            })
          })
        })
      })
    })
  })
})
