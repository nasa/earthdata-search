import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleResultsActions from '../GranuleResultsActions'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    allGranulesInProject: false,
    collectionId: 'collectionId',
    granuleCount: 5000,
    initialLoading: false,
    isCollectionInProject: false,
    location: {
      search: '?p=collectionId'
    },
    portal: {
      features: {
        authentication: true
      }
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onChangePath: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsActions {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsActions component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
  })

  describe('when no granules are in the project', () => {
    test('renders a Download All button', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().children).toEqual('Download All')
      expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().badge).toEqual('5,000 Granules')
    })
  })

  describe('when some granules are in the project', () => {
    test('renders a Download button', () => {
      const { enzymeWrapper } = setup({
        granuleCount: 1,
        isCollectionInProject: true
      })
      expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().children).toEqual('Download')
      expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().badge).toEqual('1 Granule')
    })

    test('renders a project indicator', () => {
      const { enzymeWrapper } = setup({
        granuleCount: 1,
        isCollectionInProject: true
      })

      expect(enzymeWrapper.find('.granule-results-actions__project-pill')).toBeTruthy()
      expect(enzymeWrapper.find('.granule-results-actions__project-pill').find('span').text()).toEqual('1 Granule')
    })
  })

  describe('when the project indicator is clicked', () => {
    test('sets the panel section', () => {
      const { enzymeWrapper, props } = setup({
        granuleCount: 1,
        isCollectionInProject: true
      })

      const button = enzymeWrapper.find('.granule-results-actions__project-pill')
      button.props().onClick()

      expect(props.onSetActivePanelSection).toHaveBeenCalledTimes(1)
      expect(props.onSetActivePanelSection).toHaveBeenCalledWith('1')
    })

    test('changes the path', () => {
      const { enzymeWrapper, props } = setup({
        granuleCount: 1,
        isCollectionInProject: true
      })

      const button = enzymeWrapper.find('.granule-results-actions__project-pill')
      button.props().onClick()

      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/projects?p=collectionId')
    })
  })

  describe('when all granules are in the project', () => {
    test('renders a Download All button', () => {
      const { enzymeWrapper } = setup({
        allGranulesInProject: true,
        granuleCount: 5000,
        isCollectionInProject: true
      })
      expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().children).toEqual('Download All')
      expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().badge).toEqual('5,000 Granules')
    })
  })

  test('renders the granule count', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.granule-results-actions__granule-count').text()).toEqual('5,000 Granules')
  })

  test('renders a Download All button', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().children).toEqual('Download All')
    expect(enzymeWrapper.find('.granule-results-actions__download-all-button').find('Button').props().badge).toEqual('5,000 Granules')
  })

  test('renders a link to add the collection to the project', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists('.granule-results-actions__proj-action--add')).toBeTruthy()
    expect(enzymeWrapper.exists('.remove-from-project')).toBeFalsy()
  })

  test('renders a link to remove the collection from the project', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({ isCollectionInProject: true })

    expect(enzymeWrapper.exists('.granule-results-actions__proj-action--remove')).toBeTruthy()
    expect(enzymeWrapper.exists('.granule-results-actions__proj-action--add')).toBeFalsy()
  })

  describe('addToProjectButton', () => {
    test('calls onAddProjectCollection', () => {
      const { enzymeWrapper, props } = setup()
      const button = enzymeWrapper.find('.granule-results-actions__proj-action--add')

      button.simulate('click')
      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
    })

    test('hides the add to project button if authentication is disabled', () => {
      const { enzymeWrapper } = setup({
        portal: {
          features: {
            authentication: false
          }
        }
      })

      const button = enzymeWrapper.find('.granule-results-actions__proj-action--add')

      expect(button.exists()).toBeFalsy()
    })
  })

  describe('removeFromProjectButton', () => {
    test('calls onRemoveCollectionFromProject', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({ isCollectionInProject: true })
      const button = enzymeWrapper.find('.granule-results-actions__proj-action--remove')

      button.simulate('click')
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
      expect(props.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')
    })
  })

  describe('downloadAllButton', () => {
    test('calls onAddProjectCollection', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.granule-results-actions__download-all')

      button.simulate('click')
      expect(props.onAddProjectCollection).toHaveBeenCalledTimes(1)
      expect(props.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
    })

    test('correctly adjusts pg parameter when collection isn\'t in the project with one collection', () => {
      const { enzymeWrapper } = setup({
        location: {
          search: 'p=C1443528505-LAADS&pg[0][id]=MYD04_3K.A2019284.2350.061.2019285153056.hdf&ff=Customizable&tl=1555429846!4!!'
        }
      })

      expect(enzymeWrapper.find('.granule-results-actions__download-all').props().to).toEqual({
        pathname: '/projects',
        search:
          '?p=C1443528505-LAADS!collectionId&pg[1][id]=MYD04_3K.A2019284.2350.061.2019285153056.hdf&ff=Customizable&tl=1555429846!4!!'
      })
    })

    test('correctly adjusts pg parameter when collection isn\'t in the project multiple collections', () => {
      const { enzymeWrapper } = setup({
        location: {
          search: 'p=C1443528505-LAADS!C197265171-LPDAAC_ECS!C107705237-LPDAAC_ECS&pg[0][id]=MYD04_3K.A2019284.2350.061.2019285153056.hdf&pg[2][v]=t&g=G1645942017-LAADS&ff=Customizable&tl=1555434821!4!!'
        }
      })

      expect(enzymeWrapper.find('.granule-results-actions__download-all').props().to).toEqual({
        pathname: '/projects',
        search:
          '?p=C1443528505-LAADS!C197265171-LPDAAC_ECS!C107705237-LPDAAC_ECS!collectionId&pg[2][id]=MYD04_3K.A2019284.2350.061.2019285153056.hdf&g=G1645942017-LAADS&ff=Customizable&tl=1555434821!4!!'
      })
    })

    test('hides the granule count badge when loading', () => {
      const { enzymeWrapper } = setup({ granuleCount: null })

      const button = enzymeWrapper.find('.granule-results-actions__download-all-button')

      expect(button.props().badge).toBeNull()
    })

    test('hides the download all button when authentication is disabled', () => {
      const { enzymeWrapper } = setup({
        portal: {
          features: {
            authentication: false
          }
        }
      })

      const button = enzymeWrapper.find('.granule-results-actions__download-all-button')

      expect(button.exists()).toBeFalsy()
    })
  })
})
