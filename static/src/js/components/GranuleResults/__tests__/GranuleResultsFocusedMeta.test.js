import React from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import GranuleResultsFocusedMeta from '../GranuleResultsFocusedMeta'

describe('GranuleResultsFocusedMeta component', () => {
  describe('when no links are provided', () => {
    test('should not render', () => {
      render(
        <GranuleResultsFocusedMeta
          earthdataEnvironment="prod"
          focusedGranuleMetadata={{
            browseFlag: false,
            title: '1234 Test'
          }}
          focusedGranuleId="G-1234-TEST"
        />
      )

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).not.toBeInTheDocument()
    })
  })

  describe('when the browse flag is false', () => {
    test('should not render', () => {
      render(
        <GranuleResultsFocusedMeta
          earthdataEnvironment="prod"
          focusedGranuleMetadata={{
            browseFlag: false,
            links: [{
              href: 'http://test.com/test.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            }],
            title: '1234 Test'
          }}
          focusedGranuleId="G-1234-TEST"
        />
      )

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).not.toBeInTheDocument()
    })
  })

  describe('when links are provided', () => {
    test('should render', () => {
      render(
        <GranuleResultsFocusedMeta
          earthdataEnvironment="prod"
          focusedGranuleMetadata={{
            browseFlag: true,
            links: [{
              href: 'http://test.com/test.jpg',
              rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
            }],
            title: '1234 Test'
          }}
          focusedGranuleId="G-1234-TEST"
        />
      )

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).toBeInTheDocument()
    })

    describe('when clicking the expand button', () => {
      test('should render a modal', async () => {
        const user = userEvent.setup()

        render(
          <GranuleResultsFocusedMeta
            earthdataEnvironment="prod"
            focusedGranuleMetadata={{
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }}
            focusedGranuleId="G-1234-TEST"
          />
        )

        const expandButton = screen.getByLabelText('Expand browse image')

        await user.click(expandButton)

        const modal = screen.getByTestId('granule-results-focused-meta-modal')

        expect(modal).toBeInTheDocument()
      })

      test('should not render modal navigation', async () => {
        const user = userEvent.setup()

        render(
          <GranuleResultsFocusedMeta
            earthdataEnvironment="prod"
            focusedGranuleMetadata={{
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }}
            focusedGranuleId="G-1234-TEST"
          />
        )

        const expandButton = screen.getByLabelText('Expand browse image')

        await user.click(expandButton)

        const modal = screen.getByTestId('granule-results-focused-meta-modal')
        const modalPrev = within(modal).queryByLabelText('Previous browse image')
        const modalNext = within(modal).queryByLabelText('Next browse image')
        const modalPopoverButton = within(modal).queryByLabelText('View available browse imagery')

        expect(modalPrev).not.toBeInTheDocument()
        expect(modalNext).not.toBeInTheDocument()
        expect(modalPopoverButton).not.toBeInTheDocument()
      })
    })

    describe('when multiple links are provided', () => {
      test('should render the navigation', () => {
        render(
          <GranuleResultsFocusedMeta
            earthdataEnvironment="prod"
            focusedGranuleMetadata={{
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
            }}
            focusedGranuleId="G-1234-TEST"
          />
        )

        const prevButton = screen.queryByLabelText('Previous browse image thumbnail')
        const nextButton = screen.queryByLabelText('Next browse image thumbnail')
        const pagination = screen.queryByText('1/3')
        const popoverListButton = screen.queryByLabelText('View available browse imagery')

        expect(prevButton).toBeInTheDocument()
        expect(nextButton).toBeInTheDocument()
        expect(pagination).toBeInTheDocument()
        expect(popoverListButton).toBeInTheDocument()
      })

      describe('when the selection button is clicked', () => {
        test('should render the popover selection menu', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              earthdataEnvironment="prod"
              focusedGranuleMetadata={{
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
              }}
              focusedGranuleId="G-1234-TEST"
            />
          )

          const popoverListButton = screen.getByLabelText('View available browse imagery')

          await user.click(popoverListButton)

          const popoverList = screen.getAllByTestId('granule-results-focused-meta-list')
          const popoverListItems = screen.getAllByText('.jpg', { exact: false })

          expect(popoverList.length).toEqual(1)
          expect(popoverListItems.length).toEqual(3)
        })

        test('should hide the tooltip', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              earthdataEnvironment="prod"
              focusedGranuleMetadata={{
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
              }}
              focusedGranuleId="G-1234-TEST"
            />
          )

          const overlayWrapper = screen.getByTestId('granule-results-focused-meta-overlay-wrapper')
          const popoverListButton = screen.getByLabelText('View available browse imagery')

          await user.hover(overlayWrapper)

          await waitFor(async () => {
            const tooltip = screen.queryByTestId('granule-results-focused-meta-tooltip')
            expect(tooltip).toBeInTheDocument()
            await user.click(popoverListButton)

            const tooltipAfter = screen.queryByTestId('granule-results-focused-meta-tooltip')
            expect(tooltipAfter).not.toBeInTheDocument()
          })
        })
      })

      describe('when clicking the next button', () => {
        test('should cycle the images', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              earthdataEnvironment="prod"
              focusedGranuleMetadata={{
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
              }}
              focusedGranuleId="G-1234-TEST"
            />
          )
          const nextButton = screen.queryByLabelText('Next browse image thumbnail')

          await user.click(nextButton)

          const images = screen.queryAllByTestId('granule-results-focused-meta-image')
          const pagination = screen.queryByText('2/3')

          expect(images.length).toEqual(3)
          expect(images[1]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()
        })
      })

      describe('when clicking the previous button', () => {
        test('should cycle the images', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              earthdataEnvironment="prod"
              focusedGranuleMetadata={{
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
              }}
              focusedGranuleId="G-1234-TEST"
            />
          )

          const nextButton = screen.queryByLabelText('Next browse image thumbnail')
          const prevButton = screen.queryByLabelText('Previous browse image thumbnail')

          await user.click(nextButton)
          await user.click(prevButton)

          const images = screen.queryAllByTestId('granule-results-focused-meta-image')
          const pagination = screen.queryByText('1/3')

          expect(images.length).toEqual(3)
          expect(images[0]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()
        })
      })

      describe('when clicking the list button', () => {
        test('should select the image and close the popover', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              earthdataEnvironment="prod"
              focusedGranuleMetadata={{
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
              }}
              focusedGranuleId="G-1234-TEST"
            />
          )

          const popoverListButton = screen.queryByLabelText('View available browse imagery')

          await user.click(popoverListButton)

          const popoverList = screen.queryByTestId('granule-results-focused-meta-list')

          const popoverListItem = within(popoverList).queryByText('test-3.jpg')

          await user.click(popoverListItem)

          const pagination = screen.queryByText('3/3')
          const images = screen.queryAllByTestId('granule-results-focused-meta-image')

          expect(popoverList).not.toBeInTheDocument()
          expect(images[2]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()
        })
      })

      describe('when clicking fully through the images with the next button', () => {
        test('should repeat the images', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              earthdataEnvironment="prod"
              focusedGranuleMetadata={{
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
              }}
              focusedGranuleId="G-1234-TEST"
            />
          )
          const nextButton = screen.queryByLabelText('Next browse image thumbnail')

          await user.click(nextButton)
          await user.click(nextButton)

          const images = screen.queryAllByTestId('granule-results-focused-meta-image')
          const pagination = screen.queryByText('1/2')

          expect(images.length).toEqual(2)
          expect(images[0]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()
        })
      })

      describe('when clicking fully through the images with the previous button', () => {
        test('should repeat the images', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              earthdataEnvironment="prod"
              focusedGranuleMetadata={{
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
              }}
              focusedGranuleId="G-1234-TEST"
            />
          )
          const prevButton = screen.queryByLabelText('Previous browse image thumbnail')

          await user.click(prevButton)

          const images = screen.queryAllByTestId('granule-results-focused-meta-image')
          const pagination = screen.queryByText('2/2')

          expect(images.length).toEqual(2)
          expect(images[1]).toHaveClass('granule-results-focused-meta__thumb--is-active')
          expect(pagination).toBeInTheDocument()
        })
      })

      describe('when clicking the expand button', () => {
        test('should render modal navigation', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              earthdataEnvironment="prod"
              focusedGranuleMetadata={{
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
              }}
              focusedGranuleId="G-1234-TEST"
            />
          )

          const expandButton = screen.getByLabelText('Expand browse image')

          await user.click(expandButton)

          const modal = screen.getByTestId('granule-results-focused-meta-modal')
          const modalPrev = within(modal).queryByLabelText('Previous browse image')
          const modalNext = within(modal).queryByLabelText('Next browse image')
          const modalPopoverButton = within(modal).queryByLabelText('View available browse imagery')

          expect(modalPrev).toBeInTheDocument()
          expect(modalNext).toBeInTheDocument()
          expect(modalPopoverButton).toBeInTheDocument()
        })

        describe('when clicking the close button', () => {
          test('should close the modal', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                earthdataEnvironment="prod"
                focusedGranuleMetadata={{
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
                }}
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = screen.getByLabelText('Expand browse image')

            await user.click(expandButton)

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalCloseButton = within(modal).queryByText('Close')

            await user.click(modalCloseButton)

            expect(modal).not.toBeInTheDocument()
          })
        })

        describe('when clicking the next button', () => {
          test('should cycle the images', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                earthdataEnvironment="prod"
                focusedGranuleMetadata={{
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
                }}
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = screen.getByLabelText('Expand browse image')

            await user.click(expandButton)

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalNext = within(modal).queryByLabelText('Next browse image')

            await user.click(modalNext)

            const images = within(modal).queryAllByTestId('granule-results-focused-meta-modal-image')
            const pagination = within(modal).queryByText('2/3')

            expect(images.length).toEqual(3)
            expect(images[1]).toHaveClass('granule-results-focused-meta__full--is-active')
            expect(pagination).toBeInTheDocument()
          })
        })

        describe('when clicking the previous button', () => {
          test('should cycle the images', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                earthdataEnvironment="prod"
                focusedGranuleMetadata={{
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
                }}
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = screen.getByLabelText('Expand browse image')

            await user.click(expandButton)

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalNext = within(modal).queryByLabelText('Next browse image')
            const modalPrev = within(modal).queryByLabelText('Previous browse image')

            await user.click(modalNext)
            await user.click(modalPrev)

            const images = within(modal).queryAllByTestId('granule-results-focused-meta-modal-image')
            const pagination = within(modal).queryByText('1/3')

            expect(images.length).toEqual(3)
            expect(images[0]).toHaveClass('granule-results-focused-meta__full--is-active')
            expect(pagination).toBeInTheDocument()
          })
        })

        describe('when clicking the list button', () => {
          test('should select the image and close the popover', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                earthdataEnvironment="prod"
                focusedGranuleMetadata={{
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
                }}
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = screen.getByLabelText('Expand browse image')

            await user.click(expandButton)

            const modal = screen.getByTestId('granule-results-focused-meta-modal')

            const popoverListButton = within(modal).queryByLabelText('View available browse imagery')

            await user.click(popoverListButton)

            const popoverList = screen.queryByTestId('granule-results-focused-meta-modal-popover-list')
            const popoverListItem = within(popoverList).queryByText('test-3.jpg')

            await user.click(popoverListItem)

            const pagination = within(modal).queryByText('3/3')
            const images = within(modal).queryAllByTestId('granule-results-focused-meta-modal-image')

            expect(popoverList).not.toBeInTheDocument()
            expect(images[2]).toHaveClass('granule-results-focused-meta__full--is-active')
            expect(pagination).toBeInTheDocument()
          })
        })

        describe('when clicking fully through the images with the next button', () => {
          test('should repeat the images', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                earthdataEnvironment="prod"
                focusedGranuleMetadata={{
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
                }}
                focusedGranuleId="G-1234-TEST"
              />
            )
            const expandButton = screen.getByLabelText('Expand browse image')

            await user.click(expandButton)

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalNext = within(modal).queryByLabelText('Next browse image')

            await user.click(modalNext)
            await user.click(modalNext)

            const images = within(modal).queryAllByTestId('granule-results-focused-meta-modal-image')
            const pagination = within(modal).queryByText('1/2')

            expect(images.length).toEqual(2)
            expect(images[0]).toHaveClass('granule-results-focused-meta__full--is-active')
            expect(pagination).toBeInTheDocument()
          })
        })

        describe('when clicking fully through the images with the previous button', () => {
          test('should repeat the images', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                earthdataEnvironment="prod"
                focusedGranuleMetadata={{
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
                }}
                focusedGranuleId="G-1234-TEST"
              />
            )
            const expandButton = screen.getByLabelText('Expand browse image')

            await user.click(expandButton)

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalPrev = within(modal).queryByLabelText('Previous browse image')

            await user.click(modalPrev)

            const images = within(modal).queryAllByTestId('granule-results-focused-meta-modal-image')
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
