import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { JSDOM } from 'jsdom'
import TextWindowActions from '../TextWindowActions'
import * as DownloadableFile from '../../../util/files/constructDownloadableFile'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'
import Button from '../../Button/Button'
import { getOperatingSystem } from '../../../util/files/parseUserAgent'

Enzyme.configure({ adapter: new Adapter() })

const dom = new JSDOM()
global.document = dom.window.document

const queryCommandSupportedMock = jest.fn(() => true)
const queryCommandNotSupportedMock = jest.fn(() => false)
const execCommandMock = jest.fn()

global.document.execCommand = execCommandMock
global.document.queryCommandSupported = queryCommandSupportedMock

const constructDownloadableFileMock = jest.spyOn(DownloadableFile, 'constructDownloadableFile')

jest.mock('../../../util/files/constructDownloadableFile', () => ({
  constructDownloadableFile: jest.fn()
}))

jest.mock('../../../util/files/parseUserAgent', () => ({
  getOperatingSystem: jest.fn()
}))

const { assign } = window.location

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()

  delete window.location
  window.location = { assign: jest.fn() }
})

afterEach(() => {
  jest.clearAllMocks()
  window.location.assign = assign
})

function setup(overrideProps, shouldMount) {
  const props = {
    eddLink: 'earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata&downloadId=shortName_versionId&token=Bearer mock-token',
    ...overrideProps
  }

  const enzymeWrapper = shouldMount
    ? mount(<TextWindowActions {...props} />)
    : shallow(<TextWindowActions {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TextWindowActions component', () => {
  const { enzymeWrapper } = setup()

  test('should render an svg progress ring', () => {
    expect(enzymeWrapper.find('.text-window-actions').type()).toEqual('div')
  })

  test('renders the expand button', () => {
    const expandButton = enzymeWrapper.find('.text-window-actions__action--expand')

    expect(expandButton.length).toEqual(1)
  })

  test('renders the links modal closed by default', () => {
    const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)

    expect(linksModal.props().isOpen).toEqual(false)
  })

  describe('when clicking the expand button', () => {
    const { enzymeWrapper } = setup()
    const expandButton = enzymeWrapper.find('.text-window-actions__action--expand')

    test('opens the linksModal', () => {
      expandButton.simulate('click')
      const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)

      expect(linksModal.props().isOpen).toEqual(true)
    })
  })

  describe('when clicking the download with edd button', () => {
    test('opens the eddModal and opens EDD', () => {
      const { enzymeWrapper } = setup()
      const downloadWithEddButton = enzymeWrapper.find('.text-window-actions__action--edd')

      downloadWithEddButton.simulate('click')
      const eddModal = enzymeWrapper.find(EDSCModalContainer).at(1)

      expect(eddModal.props().isOpen).toEqual(true)

      expect(window.location.assign).toHaveBeenCalledTimes(1)
      expect(window.location.assign).toHaveBeenCalledWith('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata&downloadId=shortName_versionId&token=Bearer mock-token')
    })
  })

  describe('when the linksModal is open', () => {
    describe('when the browser does supports copy/paste', () => {
      test('renders the copy button', () => {
        const { enzymeWrapper } = setup({
          clipboardContents: 'test clipboard contents'
        }, true)

        const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
        expandButton.simulate('click')

        const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)
        expect(linksModal.props().isOpen).toEqual(true)
      })

      describe('when clicking the copy button', () => {
        test('should do run the copy command', () => {
          const { enzymeWrapper } = setup({
            clipboardContents: 'test clipboard contents'
          }, true)

          const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
          expandButton.simulate('click')

          const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)

          const copyButton = linksModal.find('.text-window-actions__modal-action--copy').filter(Button)
          copyButton.simulate('click')

          expect(document.execCommand).toHaveBeenCalledTimes(1)
        })
      })

      describe('when the browser does not support copy/paste', () => {
        test('does not render the copy button', () => {
          global.document.queryCommandSupported = queryCommandNotSupportedMock

          const { enzymeWrapper } = setup()

          const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
          expandButton.simulate('click')

          const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)
          expect(linksModal.find('.text-window-actions__modal-action--copy').filter(Button).length).toEqual(0)
          // Reset the queryCommandSupported function
          global.document.queryCommandSupported = queryCommandSupportedMock
        })
      })
    })

    describe('when file contents are set', () => {
      test('renders the save button', () => {
        const { enzymeWrapper } = setup({
          fileContents: 'test file contents',
          fileName: 'test file contents'
        }, true)

        const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
        expandButton.simulate('click')

        const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)

        const saveButton = linksModal.find('.text-window-actions__modal-action--save').filter(Button)

        expect(saveButton.length).toEqual(1)
      })

      describe('when clicking the save button', () => {
        test('saves the file', () => {
          const stopPropagationMock = jest.fn()

          const { enzymeWrapper } = setup({
            fileContents: 'test file contents',
            fileName: 'test file contents'
          }, true)

          const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
          expandButton.simulate('click')

          const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)

          const saveButton = linksModal.find('.text-window-actions__modal-action--save').filter(Button)

          saveButton.simulate('click', {
            stopPropagation: stopPropagationMock
          })

          expect(constructDownloadableFileMock).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
  describe('when the eddModal is open', () => {
    describe('when clicking the Open Earthdata Download button ', () => {
      test('renders the save button', () => {
        const { enzymeWrapper } = setup({}, true)

        const eddButton = enzymeWrapper.find('.text-window-actions__action--edd').filter(Button)
        eddButton.simulate('click')

        const eddModal = enzymeWrapper.find(EDSCModalContainer).at(1)

        const openButton = eddModal.find('.text-window-actions__modal-action--open-edd').filter(Button)
        openButton.simulate('click')

        expect(window.location.assign).toHaveBeenCalledTimes(1)
        expect(window.location.assign).toHaveBeenCalledWith('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata&downloadId=shortName_versionId&token=Bearer mock-token')
      })

      test('Download link render correctly based on operating system', () => {
        getOperatingSystem.mockImplementation(() => 'Windows')
        const windowsDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
        const { enzymeWrapper } = setup({}, true)

        const eddButton = enzymeWrapper.find('.text-window-actions__action--edd').filter(Button)
        eddButton.simulate('click')

        const eddModal = enzymeWrapper.find(EDSCModalContainer).at(1)
        const link = eddModal.find('a').at(1).prop('href')

        expect(link).toEqual(windowsDownloadLink)
      })
    })
  })

  describe('when closing the linksModal', () => {
    test('closes the linksModal', () => {
      const { enzymeWrapper } = setup()
      const expandButton = enzymeWrapper.find('.text-window-actions__action--expand')
      expandButton.simulate('click')
      const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)
      expect(linksModal.props().isOpen).toEqual(true)

      linksModal.props().onClose()

      const linksModalAfter = enzymeWrapper.find(EDSCModalContainer).at(0)

      expect(linksModalAfter.props().isOpen).toEqual(false)
    })
  })

  describe('when closing the eddModal', () => {
    test('closes the eddModal', () => {
      const { enzymeWrapper } = setup()
      const downloadWithEddButton = enzymeWrapper.find('.text-window-actions__action--edd')
      downloadWithEddButton.simulate('click')

      const eddModal = enzymeWrapper.find(EDSCModalContainer).at(1)
      expect(eddModal.props().isOpen).toEqual(true)

      eddModal.props().onClose()

      const eddModalAfter = enzymeWrapper.find(EDSCModalContainer).at(1)

      expect(eddModalAfter.props().isOpen).toEqual(false)
    })
  })

  describe('when file contents are set', () => {
    const { enzymeWrapper } = setup({
      fileContents: 'test file contents',
      fileName: 'test file contents'
    })

    const saveButton = enzymeWrapper.find('.text-window-actions__action--save')

    test('renders the save button', () => {
      expect(saveButton.length).toEqual(1)
    })

    describe('when clicking the save button', () => {
      test('saves the file', () => {
        const stopPropagationMock = jest.fn()
        saveButton.simulate('click', {
          stopPropagation: stopPropagationMock
        })

        expect(constructDownloadableFileMock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when the browser does supports copy/paste', () => {
    test('renders the copy button', () => {
      const { enzymeWrapper } = setup({
        clipboardContents: 'test clipboard contents'
      }, true)
      expect(enzymeWrapper.find('.text-window-actions__action--copy').filter(Button).length).toEqual(1)
    })

    describe('when clicking the copy button', () => {
      test('should do run the copy command', () => {
        const { enzymeWrapper } = setup({
          clipboardContents: 'test clipboard contents'
        }, true)
        const copyButton = enzymeWrapper.find('.text-window-actions__action--copy').filter(Button)

        copyButton.simulate('click')

        expect(document.execCommand).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the browser does not support copy/paste', () => {
      global.document.queryCommandSupported = queryCommandNotSupportedMock

      const { enzymeWrapper } = setup()

      test('does not render the copy button', () => {
        expect(enzymeWrapper.find('.text-window-actions__action--copy').length).toEqual(0)
      })

      // Reset the queryCommandSupported function
      global.document.queryCommandSupported = queryCommandSupportedMock
    })

    describe('when disabling the copy button', () => {
      const { enzymeWrapper } = setup({
        disableCopy: true
      })

      test('hides the copy button', () => {
        expect(enzymeWrapper.find('.text-window-actions__action--copy').length).toEqual(0)
      })

      describe('when the modal is open', () => {
        const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
        expandButton.simulate('click')

        const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)
        expect(linksModal.props().isOpen).toEqual(true)

        test('hides the copy button', () => {
          expect(enzymeWrapper.find('.text-window-actions__modal-action--copy').length).toEqual(0)
        })
      })
    })

    describe('when disabling the save button', () => {
      const { enzymeWrapper } = setup({
        disableSave: true
      })

      test('hides the save button', () => {
        expect(enzymeWrapper.find('.text-window-actions__action--save').length).toEqual(0)
      })

      describe('when the modal is open', () => {
        const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
        expandButton.simulate('click')

        const linksModal = enzymeWrapper.find(EDSCModalContainer).at(0)
        expect(linksModal.props().isOpen).toEqual(true)

        test('hides the save button', () => {
          expect(enzymeWrapper.find('.text-window-actions__modal-action--save').length).toEqual(0)
        })
      })
    })
  })
})
