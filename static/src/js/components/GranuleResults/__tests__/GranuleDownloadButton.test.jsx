import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import GranuleDownloadButton from '../GranuleDownloadButton'
import Button from '../../Button/Button'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    authToken: 'token',
    badge: '294 Granules',
    buttonText: 'Download All',
    earthdataEnvironment: 'prod',
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

      const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)

      expect(portalLinkContainer.props().disabled).toBeFalsy()

      portalLinkContainer.props().onClick()

      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&pg[1][gsk]=start_date&ff=Map%20Imagery')
    })
  })

  describe('when the collection is not in the project', () => {
    describe('when there are no other pg parameters in the URL', () => {
      describe('when the user is not logged in', () => {
        test('clicking the button calls onAddProjectCollection and onChangePath to EDL', () => {
          const { enzymeWrapper } = setup({ authToken: '' })
          const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)

          delete window.location
          window.location = {
            href: 'http://localhost',
            protocol: 'http:',
            host: 'localhost'
          }

          expect(portalLinkContainer.props().disabled).toBeFalsy()

          portalLinkContainer.props().onClick()
          expect(window.location.href).toEqual('http://localhost:3000/login?ee=prod&state=http%3A%2F%2Flocalhost%2Fprojects%3Fp%3DcollectionId!collectionId%26ff%3DMap%2520Imagery%26pg%5B1%5D%5Bv%5D%3Dt')
        })
      })

      test('clicking the button calls onAddProjectCollection and onChangePath', () => {
        const { enzymeWrapper, props } = setup()

        const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)

        expect(portalLinkContainer.props().disabled).toBeFalsy()

        portalLinkContainer.props().onClick()

        expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
        expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
        expect(props.onChangePath).toHaveBeenCalledTimes(1)
        expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&ff=Map%20Imagery&pg[1][v]=t')
      })
    })

    describe('when there are some pg parameters in the URL', () => {
      describe('when the user is not logged in', () => {
        test('clicking the button calls onAddProjectCollection and onChangePath to EDL', () => {
          const { enzymeWrapper } = setup({
            authToken: '',
            location: {
              pathname: '/search/granules',
              search: '?p=collectionId&pg[0][gsk]=start_date&ff=Map%20Imagery'
            }
          })
          const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)

          delete window.location
          window.location = {
            href: 'http://localhost',
            protocol: 'http:',
            host: 'localhost'
          }

          expect(portalLinkContainer.props().disabled).toBeFalsy()

          portalLinkContainer.props().onClick()

          expect(window.location.href).toEqual('http://localhost:3000/login?ee=prod&state=http%3A%2F%2Flocalhost%2Fprojects%3Fp%3DcollectionId!collectionId%26pg%5B1%5D%5Bgsk%5D%3Dstart_date%26pg%5B1%5D%5Bv%5D%3Dt%26ff%3DMap%2520Imagery')
        })
      })

      test('clicking the button calls onAddProjectCollection and onChangePath', () => {
        const { enzymeWrapper, props } = setup({
          location: {
            pathname: '/search/granules',
            search: '?p=collectionId&pg[0][gsk]=start_date&ff=Map%20Imagery'
          }
        })

        const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)
        expect(portalLinkContainer.props().disabled).toBeFalsy()

        portalLinkContainer.props().onClick()

        expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
        expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
        expect(props.onChangePath).toHaveBeenCalledTimes(1)
        expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId!collectionId&pg[1][gsk]=start_date&pg[1][v]=t&ff=Map%20Imagery')
      })
    })
  })

  describe('when the database components are disabled', () => {
    test('the granule download button is disabled', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const { enzymeWrapper } = setup({
        isCollectionInProject: true,
        location: {
          pathname: '/search/granules',
          search: '?p=collectionId!collectionId&pg[1][gsk]=start_date&ff=Map%20Imagery'
        }
      })

      const portalLinkContainer = enzymeWrapper.find(PortalLinkContainer)

      expect(portalLinkContainer.props().disabled).toBeTruthy()
    })
  })
})
