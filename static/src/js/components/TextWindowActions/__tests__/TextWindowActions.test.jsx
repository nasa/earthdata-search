import React from 'react'
import { screen, within } from '@testing-library/react'

import { Download } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import setupTest from '../../../../../../vitestConfigs/setupTest'

import TextWindowActions from '../TextWindowActions'
import * as DownloadableFile from '../../../util/files/constructDownloadableFile'
import Button from '../../Button/Button'

const queryCommandSupportedMock = vi.fn(() => true)
const queryCommandNotSupportedMock = vi.fn(() => false)
const execCommandMock = vi.fn()

global.document.execCommand = execCommandMock
global.document.queryCommandSupported = queryCommandSupportedMock

const constructDownloadableFileMock = vi.spyOn(DownloadableFile, 'constructDownloadableFile')

// Mock the Button component but keep the actual implementation
vi.mock('../../Button/Button', async () => {
  const ActualButton = (await vi.importActual('../../Button/Button')).default

  return {
    __esModule: true,
    default: vi.fn((props) => <ActualButton {...props} />)
  }
})

vi.mock('../../../util/files/constructDownloadableFile', () => ({
  constructDownloadableFile: vi.fn()
}))

vi.mock('../../../util/files/parseUserAgent', () => ({
  getOperatingSystem: vi.fn()
}))

vi.mock('../../../util/renderTooltip', () => ({
  __esModule: true,
  default: vi.fn()
}))

const setup = setupTest({
  Component: TextWindowActions,
  defaultProps: {
    eddLink: 'earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata&downloadId=shortName_versionId&token=Bearer mock-token'
  }
})

const { assign } = window.location

beforeEach(() => {
  vi.restoreAllMocks()

  delete window.location
  window.location = { assign: vi.fn() }
})

afterEach(() => {
  window.location.assign = assign
})

describe('TextWindowActions component', () => {
  describe('when clicking the expand button', () => {
    test('opens the linksModal', async () => {
      const { user } = setup()

      const expandButton = screen.getByRole('button', { name: 'Expand' })
      await user.click(expandButton)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      expect(within(dialog).getByText('Copy')).toBeInTheDocument()
    })
  })

  describe('when clicking the download with edd button', () => {
    test('opens the eddModal and opens EDD', async () => {
      const { user } = setup()

      const downloadWithEddButton = screen.getByRole('button', { name: 'Download Files' })
      await user.click(downloadWithEddButton)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()

      expect(within(dialog).getByText('Opening Earthdata Download to download your files...')).toBeInTheDocument()

      expect(window.location.assign).toHaveBeenCalledTimes(1)
      expect(window.location.assign).toHaveBeenCalledWith('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata&downloadId=shortName_versionId&token=Bearer mock-token')

      const openButton = within(dialog).getByRole('button', { name: 'Open Earthdata Download' })
      expect(openButton).toHaveAttribute('href', 'earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata&downloadId=shortName_versionId&token=Bearer mock-token')
    })
  })

  describe('when the linksModal is open', () => {
    describe('when the browser does supports copy/paste', () => {
      describe('when clicking the copy button', () => {
        test('should do run the copy command', async () => {
          const { user } = setup({
            overrideProps: {
              clipboardContents: 'test clipboard contents'
            }
          })

          const expandButton = screen.getByRole('button', { name: 'Expand' })
          await user.click(expandButton)

          const dialog = screen.getByRole('dialog')

          const copyButton = within(dialog).getByRole('button', { name: 'Copy' })
          await user.click(copyButton)

          expect(document.execCommand).toHaveBeenCalledTimes(1)
        })
      })

      describe('when the browser does not support copy/paste', () => {
        test('does not render the copy button', async () => {
          global.document.queryCommandSupported = queryCommandNotSupportedMock

          const { user } = setup({
            overrideProps: {
              clipboardContents: 'test clipboard contents'
            }
          })

          const expandButton = screen.getByRole('button', { name: 'Expand' })
          await user.click(expandButton)

          const dialog = screen.getByRole('dialog')
          expect(within(dialog).queryByRole('button', { name: 'Copy' })).toBeNull()
          // Reset the queryCommandSupported function
          global.document.queryCommandSupported = queryCommandSupportedMock
        })
      })
    })

    describe('when file contents are set', () => {
      describe('when clicking the save button', () => {
        test('saves the file', async () => {
          const { user } = setup({
            overrideProps: {
              fileContents: 'test file contents',
              fileName: 'test file contents'
            }
          })

          const expandButton = screen.getByRole('button', { name: 'Expand' })
          await user.click(expandButton)

          const dialog = screen.getByRole('dialog')

          const saveButton = within(dialog).getByRole('button', { name: 'Save' })

          await user.click(saveButton)

          expect(constructDownloadableFileMock).toHaveBeenCalledTimes(1)
          expect(constructDownloadableFileMock).toHaveBeenCalledWith('test file contents', 'test file contents')
        })
      })
    })
  })

  describe('when closing the linksModal', () => {
    test('closes the linksModal', async () => {
      const { user } = setup()

      const expandButton = screen.getByRole('button', { name: 'Expand' })
      await user.click(expandButton)

      const dialog = screen.getByRole('dialog')
      const closeButton = within(dialog).getByRole('button', { name: 'Close' })
      await user.click(closeButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('when closing the eddModal', () => {
    test('closes the eddModal', async () => {
      const { user } = setup()

      const downloadWithEddButton = screen.getByRole('button', { name: 'Download Files' })
      await user.click(downloadWithEddButton)

      const dialog = screen.getByRole('dialog')
      const closeButton = within(dialog).getByRole('button', { name: 'Close' })
      await user.click(closeButton)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('when file contents are set', () => {
    describe('when clicking the save button', () => {
      test('saves the file', async () => {
        const { user } = setup({
          overrideProps: {
            fileContents: 'test file contents',
            fileName: 'test file contents'
          }
        })

        const saveButton = screen.getByRole('button', { name: 'Save' })
        await user.click(saveButton)

        expect(constructDownloadableFileMock).toHaveBeenCalledTimes(1)
        expect(constructDownloadableFileMock).toHaveBeenCalledWith('test file contents', 'test file contents')
      })
    })
  })

  describe('when the modals are closed', () => {
    describe('when the browser supports copy/paste', () => {
      describe('when clicking the copy button', () => {
        test('should do run the copy command', async () => {
          const { user } = setup({
            overrideProps: {
              clipboardContents: 'test clipboard contents'
            }
          })

          const copyButton = screen.getByRole('button', { name: 'Copy' })
          await user.click(copyButton)

          expect(document.execCommand).toHaveBeenCalledTimes(1)
          expect(document.execCommand).toHaveBeenCalledWith('copy')
        })
      })

      describe('when the browser does not support copy/paste', () => {
        test('does not render the copy button', () => {
          global.document.queryCommandSupported = queryCommandNotSupportedMock

          setup()

          expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()

          // Reset the queryCommandSupported function
          global.document.queryCommandSupported = queryCommandSupportedMock
        })
      })

      describe('when disabling the copy button', () => {
        test('hides the copy button', () => {
          setup({
            overrideProps: {
              disableCopy: true
            }
          })

          expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()
        })

        describe('when the modal is open', () => {
          test('hides the copy button', async () => {
            const { user } = setup({
              overrideProps: {
                disableCopy: true
              }
            })

            const expandButton = screen.getByRole('button', { name: 'Expand' })
            await user.click(expandButton)

            const dialog = screen.getByRole('dialog')
            expect(within(dialog).queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()
          })
        })
      })

      describe('when disabling the save button', () => {
        test('hides the save button', () => {
          setup({
            overrideProps: {
              disableSave: true
            }
          })

          expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
        })

        describe('when the modal is open', () => {
          test('hides the save button', async () => {
            const { user } = setup({
              overrideProps: {
                disableSave: true
              }
            })

            const expandButton = screen.getByRole('button', { name: 'Expand' })
            await user.click(expandButton)

            const dialog = screen.getByRole('dialog')
            expect(within(dialog).queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
          })
        })
      })

      describe('when hiding the edd button', () => {
        test('hides the edd button', () => {
          setup({
            overrideProps: {
              hideEdd: true
            }
          })

          expect(screen.queryByRole('button', { name: 'Download Files' })).not.toBeInTheDocument()
        })
      })

      describe('when disabling the edd button while a job is in progress', () => {
        test('disables the button and displays the correct tooltip message', () => {
          setup({
            overrideProps: {
              eddLink: null,
              disableEddInProgress: true,
              disableCopy: true,
              disableSave: true
            }
          })

          const downloadWithEddButton = screen.getByRole('button', { name: 'Download Files' })

          expect(downloadWithEddButton).toBeInTheDocument()
          expect(downloadWithEddButton).toBeDisabled()

          expect(Button).toHaveBeenCalledTimes(2)
          expect(Button).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              bootstrapSize: 'sm',
              bootstrapVariant: 'primary',
              children: 'Download Files',
              className: 'text-window-actions__action text-window-actions__action--edd',
              disabled: true,
              icon: Download,
              onClick: expect.any(Function),
              tooltip: expect.objectContaining({
                props: expect.objectContaining({
                  children: 'Download files with Earthdata Download when the job is complete'
                })
              }),
              tooltipId: 'text-window-actions__tooltip--null'
            }),
            {}
          )

          expect(Button).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
              label: 'Expand'
            }),
            {}
          )
        })
      })
    })
  })
})
