import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import CollectionResultsTableHeaderCell from '../CollectionResultsTableHeaderCell'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    column: {
      customProps: {
        portal: {
          features: {
            authentication: true
          }
        },
        onViewCollectionGranules: jest.fn(),
        onAddProjectCollection: jest.fn(),
        onRemoveCollectionFromProject: jest.fn(),
        onViewCollectionDetails: jest.fn()
      }
    },
    cell: {
      value: 'test value'
    },
    row: {
      original: {
        collectionId: 'collectionId',
        isCollectionInProject: false
      }
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionResultsTableHeaderCell {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsTableHeaderCell component', () => {
  test('renders correctly', () => {
    const { enzymeWrapper } = setup()

    const titleButton = enzymeWrapper.find('.collection-results-table__title-button')
    expect(titleButton.props().label).toEqual('test value')
    expect(titleButton.find('h4').text()).toEqual('test value')
  })

  test('clicking the title button calls onViewCollectionGranules', () => {
    const { enzymeWrapper, props } = setup()

    const titleButton = enzymeWrapper.find('.collection-results-table__title-button')
    titleButton.simulate('click', { stopPropagation: jest.fn() })

    expect(props.column.customProps.onViewCollectionGranules).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onViewCollectionGranules).toHaveBeenCalledWith('collectionId')
  })

  test('clicking the details button calls onViewCollectionDetails', () => {
    const { enzymeWrapper, props } = setup()

    const detailsButton = enzymeWrapper.find('.collection-results-table__collection-action--info')
    detailsButton.simulate('click', { stopPropagation: jest.fn() })

    expect(props.column.customProps.onViewCollectionDetails).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onViewCollectionDetails).toHaveBeenCalledWith('collectionId')
  })

  test('clicking the add to project button calls onAddProjectCollection', () => {
    const { enzymeWrapper, props } = setup()

    const addButton = enzymeWrapper.find('.collection-results-table__collection-action--add')
    addButton.simulate('click', { stopPropagation: jest.fn() })

    expect(props.column.customProps.onAddProjectCollection).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onAddProjectCollection).toHaveBeenCalledWith('collectionId')
  })

  test('clicking the remove from project button calls onRemoveCollectionFromProject', () => {
    const { enzymeWrapper, props } = setup({
      row: {
        original: {
          collectionId: 'collectionId',
          isCollectionInProject: true
        }
      }
    })

    const removeButton = enzymeWrapper.find('.collection-results-table__collection-action--remove')
    removeButton.simulate('click', { stopPropagation: jest.fn() })

    expect(props.column.customProps.onRemoveCollectionFromProject).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onRemoveCollectionFromProject).toHaveBeenCalledWith('collectionId')
  })

  test('renders the add button under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup()

    const button = enzymeWrapper
      .find(PortalFeatureContainer)
      .find('.collection-results-table__collection-action--add')
    const portalFeatureContainer = button.parents(PortalFeatureContainer)

    expect(button.exists()).toBeTruthy()
    expect(portalFeatureContainer.props().authentication).toBeTruthy()
  })
})
