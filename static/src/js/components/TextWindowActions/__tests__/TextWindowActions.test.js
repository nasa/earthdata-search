import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'
import TextWindowActions from '../TextWindowActions'
import * as DownloadableFile from '../../../util/files/constructDownloadableFile'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'
import Button from '../../Button/Button'

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

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

function setup(overrideProps, shouldMount) {
  const props = {
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

  test('renders the modal closed by default', () => {
    const modal = enzymeWrapper.find(EDSCModalContainer)

    expect(modal.props().isOpen).toEqual(false)
  })

  describe('when clicking the expand button', () => {
    const { enzymeWrapper } = setup()
    const expandButton = enzymeWrapper.find('.text-window-actions__action--expand')

    test('opens the modal', () => {
      expandButton.simulate('click')
      const modal = enzymeWrapper.find(EDSCModalContainer)

      expect(modal.props().isOpen).toEqual(true)
    })
  })

  describe('when the modal is open', () => {
    describe('when the browser does supports copy/paste', () => {
      test('renders the copy button', () => {
        const { enzymeWrapper } = setup({
          clipboardContents: 'test clipboard contents'
        }, true)

        const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
        expandButton.simulate('click')

        const modal = enzymeWrapper.find(EDSCModalContainer)
        expect(modal.props().isOpen).toEqual(true)
      })

      describe('when clicking the copy button', () => {
        test('should do run the copy command', () => {
          const { enzymeWrapper } = setup({
            clipboardContents: 'test clipboard contents'
          }, true)

          const expandButton = enzymeWrapper.find('.text-window-actions__action--expand').filter(Button)
          expandButton.simulate('click')

          const modal = enzymeWrapper.find(EDSCModalContainer)

          const copyButton = modal.find('.text-window-actions__modal-action--copy').filter(Button)
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

          const modal = enzymeWrapper.find(EDSCModalContainer)
          expect(modal.find('.text-window-actions__modal-action--copy').filter(Button).length).toEqual(0)
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

        const modal = enzymeWrapper.find(EDSCModalContainer)

        const saveButton = modal.find('.text-window-actions__modal-action--save').filter(Button)

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

          const modal = enzymeWrapper.find(EDSCModalContainer)

          const saveButton = modal.find('.text-window-actions__modal-action--save').filter(Button)

          saveButton.simulate('click', {
            stopPropagation: stopPropagationMock
          })

          expect(constructDownloadableFileMock).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('when closing the modal', () => {
    test('closes the modal', () => {
      const { enzymeWrapper } = setup()
      const expandButton = enzymeWrapper.find('.text-window-actions__action--expand')
      expandButton.simulate('click')
      const modal = enzymeWrapper.find(EDSCModalContainer)
      expect(modal.props().isOpen).toEqual(true)

      modal.props().onClose()

      const modalAfter = enzymeWrapper.find(EDSCModalContainer)

      expect(modalAfter.props().isOpen).toEqual(false)
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

        const modal = enzymeWrapper.find(EDSCModalContainer)
        expect(modal.props().isOpen).toEqual(true)

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

        const modal = enzymeWrapper.find(EDSCModalContainer)
        expect(modal.props().isOpen).toEqual(true)

        test('hides the save button', () => {
          expect(enzymeWrapper.find('.text-window-actions__modal-action--save').length).toEqual(0)
        })
      })
    })
  })
})
