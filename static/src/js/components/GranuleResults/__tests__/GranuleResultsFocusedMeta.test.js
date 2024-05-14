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

jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
describe('GranuleResultsFocusedMeta component', () => {
  describe('when no links are provided', () => {
    test('should not render', () => {
      render(
        <GranuleResultsFocusedMeta
          focusedGranuleMetadata={
            {
              browseFlag: false,
              title: '1234 Test'
            }
          }
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
          focusedGranuleMetadata={
            {
              browseFlag: false,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          }
          focusedGranuleId="G-1234-TEST"
        />
      )

      const focusedMeta = screen.queryByTestId('granule-results-focused-meta')

      expect(focusedMeta).not.toBeInTheDocument()
    })
  })

  describe('when links are provided', () => {
    test('should render', async () => {
      render(
        <GranuleResultsFocusedMeta
          focusedGranuleMetadata={
            {
              browseFlag: true,
              links: [{
                href: 'http://test.com/test.jpg',
                rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
              }],
              title: '1234 Test'
            }
          }
          focusedGranuleId="G-1234-TEST"
        />
      )

      const focusedMeta = await screen.findByTestId('granule-results-focused-meta')
      expect(focusedMeta).toBeInTheDocument()
    })

    describe('when clicking the expand button', () => {
      test('should render a modal', async () => {
        const user = userEvent.setup()

        render(
          <GranuleResultsFocusedMeta
            focusedGranuleMetadata={
              {
                browseFlag: true,
                links: [{
                  href: 'http://test.com/test.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            }
            focusedGranuleId="G-1234-TEST"
          />
        )

        const expandButton = screen.getByRole('button', { name: 'Expand browse image' })
        user.click(expandButton)

        await waitFor(() => {
          const modal = screen.getByTestId('granule-results-focused-meta-modal')
          expect(modal).toBeInTheDocument()
        })
      })

      test('should not render modal navigation', async () => {
        const user = userEvent.setup()
        render(
          <GranuleResultsFocusedMeta
            focusedGranuleMetadata={
              {
                browseFlag: true,
                links: [{
                  href: 'http://test.com/test.jpg',
                  rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#'
                }],
                title: '1234 Test'
              }
            }
            focusedGranuleId="G-1234-TEST"
          />
        )

        const expandButton = screen.getByRole('button', { name: 'Expand browse image' })

        user.click(expandButton)

        await waitFor(() => {
          const modal = screen.getByTestId('granule-results-focused-meta-modal')
          const modalPrev = within(modal).queryByLabelText('Previous browse image')
          const modalNext = within(modal).queryByLabelText('Next browse image')

          const modalPopoverButton = within(modal).queryByLabelText('View available browse imagery')
          expect(modalPrev).not.toBeInTheDocument()
          expect(modalNext).not.toBeInTheDocument()
          expect(modalPopoverButton).not.toBeInTheDocument()
        })
      })
    })

    describe('when multiple links are provided', () => {
      test('should render the navigation', async () => {
        render(
          <GranuleResultsFocusedMeta
            focusedGranuleMetadata={
              {
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
            }
            focusedGranuleId="G-1234-TEST"
          />
        )

        await waitFor(() => {
          const prevButton = screen.getByLabelText('Previous browse image thumbnail')
          const nextButton = screen.getByLabelText('Next browse image thumbnail')
          const pagination = screen.getByText('1/3')
          const popoverListButton = screen.getByLabelText('View available browse imagery')

          expect(prevButton).toBeInTheDocument()
          expect(pagination).toBeInTheDocument()
          expect(popoverListButton).toBeInTheDocument()
          expect(nextButton).toBeInTheDocument()
        })
      })

      describe('when the selection button is clicked', () => {
        test('should render the popover selection menu', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              focusedGranuleMetadata={
                {
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
              }
              focusedGranuleId="G-1234-TEST"
            />
          )

          const popoverListButton = screen.getByLabelText('View available browse imagery')

          user.click(popoverListButton)
          await waitFor(() => {
            const popoverList = screen.getAllByTestId('granule-results-focused-meta-list')
            const popoverListItems = screen.getAllByText('.jpg', { exact: false })

            expect(popoverList.length).toEqual(1)
            expect(popoverListItems.length).toEqual(3)
          })
        })

        test('should hide the tooltip', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              focusedGranuleMetadata={
                {
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
              }
              focusedGranuleId="G-1234-TEST"
            />
          )

          const overlayWrapper = await screen.findByTestId('granule-results-focused-meta-overlay-wrapper')
          const popoverListButton = await screen.findByLabelText('View available browse imagery')

          // Tool-tip however
          await user.hover(overlayWrapper)
          await waitFor(() => {
            const tooltip = screen.queryByTestId('granule-results-focused-meta-tooltip')
            expect(tooltip).toBeInTheDocument()
          })

          // Click to disappear tool-tip
          user.click(popoverListButton)
          await waitFor(() => {
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
              focusedGranuleMetadata={
                {
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
              }
              focusedGranuleId="G-1234-TEST"
            />
          )

          const nextButton = screen.getByRole('button', { name: 'Next browse image thumbnail' })
          user.click(nextButton)

          await waitFor(() => {
            const images = screen.queryAllByTestId('granule-results-focused-meta-image')
            const pagination = screen.queryByText('2/3')
            expect(images.length).toEqual(3)
            expect(images[1]).toHaveClass('granule-results-focused-meta__thumb--is-active')
            expect(pagination).toBeInTheDocument()
          })
        })
      })

      describe('when clicking the previous button', () => {
        test('should cycle the images', async () => {
          const user = userEvent.setup()

          render(
            <GranuleResultsFocusedMeta
              focusedGranuleMetadata={
                {
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
              }
              focusedGranuleId="G-1234-TEST"
            />
          )

          const nextButton = await screen.findByLabelText('Next browse image thumbnail')
          const prevButton = await screen.findByLabelText('Previous browse image thumbnail')

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
              focusedGranuleMetadata={
                {
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
              }
              focusedGranuleId="G-1234-TEST"
            />
          )

          const popoverListButton = await screen.findByLabelText('View available browse imagery')

          await waitFor(async () => {
            await user.click(popoverListButton)
          })

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
              focusedGranuleMetadata={
                {
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
              }
              focusedGranuleId="G-1234-TEST"
            />
          )

          const nextButton = await screen.findByLabelText('Next browse image thumbnail')

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
              focusedGranuleMetadata={
                {
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
              }
              focusedGranuleId="G-1234-TEST"
            />
          )

          const prevButton = await screen.findByLabelText('Previous browse image thumbnail')

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
              focusedGranuleMetadata={
                {
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
              }
              focusedGranuleId="G-1234-TEST"
            />
          )

          const expandButton = await screen.findByLabelText('Expand browse image')

          await waitFor(async () => {
            await user.click(expandButton)
            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalPrev = within(modal).queryByLabelText('Previous browse image')
            const modalNext = within(modal).queryByLabelText('Next browse image')
            const modalPopoverButton = within(modal).queryByLabelText('View available browse imagery')

            expect(modalPrev).toBeInTheDocument()
            expect(modalNext).toBeInTheDocument()
            expect(modalPopoverButton).toBeInTheDocument()
          })
        })

        describe('when clicking the close button', () => {
          test('should close the modal', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                focusedGranuleMetadata={
                  {
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
                }
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = await screen.findByLabelText('Expand browse image')

            await waitFor(async () => {
              await user.click(expandButton)

              const modal = screen.getByTestId('granule-results-focused-meta-modal')
              const modalCloseButton = within(modal).queryByText('Close')

              await user.click(modalCloseButton)

              expect(modal).not.toBeInTheDocument()
            })
          })
        })

        describe('when clicking the next button', () => {
          test('should cycle the images', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                focusedGranuleMetadata={
                  {
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
                }
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = await screen.findByLabelText('Expand browse image')
            await waitFor(async () => {
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
        })

        describe('when clicking the previous button', () => {
          test('should cycle the images', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                focusedGranuleMetadata={
                  {
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
                }
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = await screen.findByLabelText('Expand browse image')
            await waitFor(async () => {
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
        })

        describe('when clicking the list button', () => {
          test('should select the image and close the popover', async () => {
            const user = userEvent.setup()

            render(
              <GranuleResultsFocusedMeta
                focusedGranuleMetadata={
                  {
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
                }
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = await screen.findByLabelText('Expand browse image')

            await waitFor(async () => {
              await user.click(expandButton)
            })

            const modal = screen.getByTestId('granule-results-focused-meta-modal')

            const popoverListButton = within(modal).queryByLabelText('View available browse imagery')

            await waitFor(async () => {
              await user.click(popoverListButton)
            })

            const popoverList = screen.queryByTestId('granule-results-focused-meta-modal-popover-list')
            const popoverListItem = within(popoverList).queryByText('test-3.jpg')

            await waitFor(async () => {
              await user.click(popoverListItem)
            })

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
                focusedGranuleMetadata={
                  {
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
                }
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = screen.getByLabelText('Expand browse image')
            await waitFor(async () => {
              await user.click(expandButton)
            })

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
                focusedGranuleMetadata={
                  {
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
                }
                focusedGranuleId="G-1234-TEST"
              />
            )

            const expandButton = screen.getByRole('button', { name: 'Expand browse image' })
            user.click(expandButton)
            await waitFor(() => {
              expect(screen.getByTestId('granule-results-focused-meta-modal')).toBeInTheDocument()
            })

            const modal = screen.getByTestId('granule-results-focused-meta-modal')
            const modalPrev = within(modal).getByRole('button', { name: 'Previous browse image' })

            user.click(modalPrev)
            await waitFor(() => {
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
})
