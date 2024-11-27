import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { Dropdown } from 'react-bootstrap'
import {
  GranuleResultsDownloadNotebookButton,
  CustomDownloadNotebookToggle
} from '../GranuleResultsDownloadNotebookButton'
import Button from '../../Button/Button'

Enzyme.configure({ adapter: new Adapter() })

Object.defineProperty(window, 'location', {
  get() {
    return { href: 'https://www.test-location.com/?param=value' }
  }
})

function setup(overrideProps) {
  const props = {
    collectionQuerySpatial: {},
    generateNotebook: {},
    generateNotebookTag: {
      variableConceptId: 'V-123456789-TESTPROV'
    },
    granuleId: 'G123456789-TESTPROV',
    onGenerateNotebook: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsDownloadNotebookButton {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()

  const rootNode = document.createElement('div')
  rootNode.id = 'root'
  document.body.appendChild(rootNode)
})

afterEach(() => {
  const rootNode = document.getElementById('root')
  document.body.removeChild(rootNode)
})

describe('GranuleResultsDownloadNotebookButton component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    // Console.log(enzymeWrapper.debug())

    expect(enzymeWrapper.type()).toBe(Dropdown)
  })

  describe('when a bounding box is not applied', () => {
    describe('when the Generate Notebook button is clicked', () => {
      test('calls onGenerateNotebook without a bounding box', () => {
        const { enzymeWrapper, props } = setup()

        const button = enzymeWrapper.find(Button)

        console.log(button.debug())

        button.simulate('click')

        expect(props.onGenerateNotebook).toHaveBeenCalledWith(
          {
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value',
            variableId: 'V-123456789-TESTPROV'
          }
        )
      })
    })
  })

  describe('when a bounding box is applied', () => {
    describe('when the Generate Notebook button is clicked', () => {
      test('calls onGenerateNotebook with a bounding box', () => {
        const { enzymeWrapper, props } = setup({
          collectionQuerySpatial: {
            boundingBox: ['-1,0,1,0']
          }
        })

        const button = enzymeWrapper.find(Button)

        console.log(button.debug())

        button.simulate('click')

        expect(props.onGenerateNotebook).toHaveBeenCalledWith(
          {
            boundingBox: '-1,0,1,0',
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value',
            variableId: 'V-123456789-TESTPROV'
          }
        )
      })
    })
  })

  describe('when a variable id is not applied', () => {
    describe('when the Generate Notebook button is clicked', () => {
      test('calls onGenerateNotebook without a variable id', () => {
        const { enzymeWrapper, props } = setup({
          generateNotebookTag: {}
        })

        const button = enzymeWrapper.find(Button)

        button.simulate('click')

        expect(props.onGenerateNotebook).toHaveBeenCalledWith(
          {
            granuleId: 'G123456789-TESTPROV',
            referrerUrl: 'https://www.test-location.com/?param=value'
          }
        )
      })
    })
  })

  describe('when a click bubbles up to the dropdown', () => {
    test('calls stopPropagation', () => {
      const { enzymeWrapper } = setup()

      const stopPropagationMock = jest.fn()

      enzymeWrapper.simulate('click', { stopPropagation: stopPropagationMock })

      expect(stopPropagationMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('CustomDownloadNotebookToggle component', () => {
  test('calls expected event methods on download click', () => {
    const mockClickEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    }

    const mockClickCallback = jest.fn()

    shallow(<CustomDownloadNotebookToggle id="G-123456789" onClick={mockClickCallback} />)
      .simulate('click', mockClickEvent)

    expect(mockClickEvent.stopPropagation).toHaveBeenCalled()
    expect(mockClickEvent.preventDefault).toHaveBeenCalled()
    expect(mockClickCallback).toHaveBeenCalled()
  })
})
