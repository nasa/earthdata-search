import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import GranuleResultsActions from '../GranuleResultsActions'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import GranuleDownloadButton from '../GranuleDownloadButton'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    addedGranuleIds: [],
    focusedProjectCollection: {
      granules: {
        allIds: ['granuleId'],
        hits: 1
      }
    },
    removedGranuleIds: [],
    allGranulesInProject: false,
    focusedCollectionId: 'collectionId',
    granuleLimit: 10000000,
    searchGranuleCount: 5000,
    initialLoading: false,
    isCollectionInProject: false,
    location: {
      search: '?p=collectionId'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onChangePath: jest.fn(),
    subscriptions: [],
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsActions {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsActions component', () => {
  describe('when no granules are in the project', () => {
    test('renders a Download All button', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(GranuleDownloadButton).props().buttonText).toEqual('Download All')
      expect(enzymeWrapper.find(GranuleDownloadButton).props().badge.props.children[1]).toEqual('5,000')
    })
  })

  describe('when some granules are in the project', () => {
    test('renders a Download button', () => {
      const { enzymeWrapper } = setup({
        addedGranuleIds: ['one'],
        projectGranuleCount: 1,
        isCollectionInProject: true
      })
      expect(enzymeWrapper.find(GranuleDownloadButton).props().buttonText).toEqual('Download')
      expect(enzymeWrapper.find(GranuleDownloadButton).props().badge.props.children[1]).toEqual('1')
    })

    test('renders a project indicator', () => {
      const { enzymeWrapper } = setup({
        addedGranuleIds: ['one'],
        projectGranuleCount: 1,
        isCollectionInProject: true
      })

      expect(enzymeWrapper.find(GranuleDownloadButton).props().badge.props.children[1]).toEqual('1')
    })
  })

  describe('when all granules are in the project', () => {
    test('renders a Download All button', () => {
      const { enzymeWrapper } = setup({
        projectGranuleCount: 5000,
        isCollectionInProject: true
      })
      expect(enzymeWrapper.find(GranuleDownloadButton).props().buttonText).toEqual('Download All')
      expect(enzymeWrapper.find(GranuleDownloadButton).props().badge.props.children[1]).toEqual('5,000')
    })
  })

  test('renders a Download All button', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(GranuleDownloadButton).props().buttonText).toEqual('Download All')
    expect(enzymeWrapper.find(GranuleDownloadButton).props().badge.props.children[1]).toEqual('5,000')
  })

  test('renders a link to add the collection to the project', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists('.granule-results-actions__action--add')).toBeTruthy()
    expect(enzymeWrapper.exists('.remove-from-project')).toBeFalsy()
  })

  test('renders a link to remove the collection from the project', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({ isCollectionInProject: true })

    expect(enzymeWrapper.exists('.granule-results-actions__action--remove')).toBeTruthy()
    expect(enzymeWrapper.exists('.granule-results-actions__action--add')).toBeFalsy()
  })

  describe('addToProjectButton', () => {
    test('calls onAddProjectCollection', () => {
      const { enzymeWrapper, props } = setup()
      const button = enzymeWrapper.find('.granule-results-actions__action--add')

      button.simulate('click')
      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
    })

    test('renders the add button under PortalFeatureContainer', () => {
      const { enzymeWrapper } = setup()

      const button = enzymeWrapper
        .find(PortalFeatureContainer)
        .find('.granule-results-actions__action--add')
      const portalFeatureContainer = button.parents(PortalFeatureContainer)

      expect(button.exists()).toBeTruthy()
      expect(portalFeatureContainer.props().authentication).toBeTruthy()
    })
  })

  describe('removeFromProjectButton', () => {
    test('calls onRemoveCollectionFromProject', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({ isCollectionInProject: true })
      const button = enzymeWrapper.find('.granule-results-actions__action--remove')

      button.simulate('click')
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('downloadAllButton', () => {
    test('hides the granule count badge when loading', () => {
      const { enzymeWrapper } = setup({ searchGranuleCount: null })

      const button = enzymeWrapper.find(GranuleDownloadButton)

      expect(button.props().badge).toBeNull()
    })

    test('renders the download all button under PortalFeatureContainer', () => {
      const { enzymeWrapper } = setup()

      const button = enzymeWrapper
        .find(PortalFeatureContainer)
        .find(GranuleDownloadButton)
      const portalFeatureContainer = button.parents(PortalFeatureContainer)

      expect(button.exists()).toBeTruthy()
      expect(portalFeatureContainer.props().authentication).toBeTruthy()
    })
  })

  describe('when a user is not subscribed', () => {
    test('renders the correct subscription button', () => {
      const { enzymeWrapper } = setup()

      const subscriptionButton = enzymeWrapper.find('.granule-results-actions__action--subscriptions')

      expect(subscriptionButton.props().className).not.toContain('granule-results-actions__action--is-active')
    })
  })

  describe('when a user is subscribed', () => {
    test('renders the correct subscription button', () => {
      const { enzymeWrapper } = setup({
        subscriptions: [
          {
            name: 'Sub 1'
          }
        ]
      })

      const subscriptionButton = enzymeWrapper.find('.granule-results-actions__action--subscriptions')

      expect(subscriptionButton.props().className).toContain('granule-results-actions__action--is-active')
    })
  })
})
