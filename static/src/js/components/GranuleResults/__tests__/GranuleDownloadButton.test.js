import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import GranuleDownloadButton from '../GranuleDownloadButton'
import Button from '../../Button/Button'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    badge: '294 Granules',
    buttonText: 'Download All',
    focusedCollectionId: 'collectionId',
    granuleCount: 294,
    granuleLimit: 1000000,
    initialLoading: false,
    isCollectionInProject: false,
    location: {
      pathname: '/search/granules',
      search: '?p=collectionId&ff=Map%20Imagery'
    },
    projectCollection: {},
    tooManyGranules: false,
    onAddProjectCollection: jest.fn(),
    onChangePath: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleDownloadButton {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GranuleDownloadButton component', () => {
  describe('when there are too many granules', () => {
    test('renders a disabled button', () => {
      const { enzymeWrapper } = setup({ tooManyGranules: true })

      const button = enzymeWrapper.find(Button)

      expect(button.props().disabled).toBeTruthy()
    })
  })

  describe('when the collection is already in the project', () => {
    test('clicking the button calls onAddProjectCollection and onChangePath', () => {
      const { enzymeWrapper, props } = setup({
        isCollectionInProject: true,
        location: {
          pathname: '/search/granules',
          search: '?p=collectionId!collectionId&pg[1][gsk]=start_date&ff=Map%20Imagery'
        }
      })

      const button = enzymeWrapper.find(Button)

      expect(button.props().disabled).toBeFalsy()

      const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)

      portalLinkContainer.props().onClick()

      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&pg[1][gsk]=start_date&ff=Map%20Imagery')
    })
  })

  describe('when the collection is not in the project', () => {
    describe('when there are no other pg paramters in the URL', () => {
      test('clicking the button calls onAddProjectCollection and onChangePath', () => {
        const { enzymeWrapper, props } = setup()

        const button = enzymeWrapper.find(Button)

        expect(button.props().disabled).toBeFalsy()

        const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)

        portalLinkContainer.props().onClick()

        expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
        expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
        expect(props.onChangePath).toHaveBeenCalledTimes(1)
        expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&ff=Map%20Imagery&pg[1][v]=t')
      })
    })

    describe('when there are some pg paramters in the URL', () => {
      test('clicking the button calls onAddProjectCollection and onChangePath', () => {
        const { enzymeWrapper, props } = setup({
          location: {
            pathname: '/search/granules',
            search: '?p=collectionId&pg[0][gsk]=start_date&ff=Map%20Imagery'
          }
        })

        const button = enzymeWrapper.find(Button)

        expect(button.props().disabled).toBeFalsy()

        const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)

        portalLinkContainer.props().onClick()

        expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
        expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
        expect(props.onChangePath).toHaveBeenCalledTimes(1)
        expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&pg[1][gsk]=start_date&pg[1][v]=t&ff=Map%20Imagery')
      })
    })
  })
})
