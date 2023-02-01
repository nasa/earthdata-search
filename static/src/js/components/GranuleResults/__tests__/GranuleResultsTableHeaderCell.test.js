import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import MoreActionsDropdownItem from '../../MoreActionsDropdown/MoreActionsDropdownItem'
import GranuleResultsTableHeaderCell from '../GranuleResultsTableHeaderCell'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    column: {
      customProps: {
        collectionId: 'collectionId',
        directDistributionInformation: {},
        location: {},
        isGranuleInProject: jest.fn(),
        portal: {
          features: {
            authentication: true
          }
        },
        onAddGranuleToProjectCollection: jest.fn(),
        onExcludeGranule: jest.fn(),
        onFocusedGranuleChange: jest.fn(),
        onMetricsDataAccess: jest.fn(),
        onRemoveGranuleFromProjectCollection: jest.fn()
      }
    },
    cell: {
      value: 'test value'
    },
    row: {
      original: {
        id: 'one',
        isOpenSearch: false,
        dataLinks: [],
        s3Links: [],
        onlineAccessFlag: true,
        handleClick: jest.fn()
      }
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleResultsTableHeaderCell {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsTableHeaderCell component', () => {
  test('renders correctly', () => {
    const { enzymeWrapper } = setup()

    const titleElement = enzymeWrapper.find('.granule-results-table__granule-name')
    expect(titleElement.text()).toEqual('test value')
  })

  test('clicking the details button calls onViewCollectionDetails', () => {
    const { enzymeWrapper, props } = setup()

    const detailsButton = enzymeWrapper.find('MoreActionsDropdown').childAt(0)
    detailsButton.simulate('click', { stopPropagation: jest.fn() })

    expect(props.column.customProps.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onFocusedGranuleChange).toHaveBeenCalledWith('one')
  })

  test('clicking the remove from granule button calls onExcludeGranule', () => {
    const { enzymeWrapper, props } = setup()

    const removeButton = enzymeWrapper.find(MoreActionsDropdownItem).at(1)

    removeButton.props().onClick({
      stopPropagation: () => {}
    })

    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledWith({ collectionId: 'collectionId', granuleId: 'one' })
  })

  test('clicking the remove from granule button calls onExcludeGranule with a hashed id for CWIC collections', () => {
    const { enzymeWrapper, props } = setup({
      row: {
        original: {
          id: 'one',
          isOpenSearch: true,
          dataLinks: [],
          s3Links: [],
          onlineAccessFlag: true,
          handleClick: jest.fn()
        }
      }
    })

    const removeButton = enzymeWrapper.find(MoreActionsDropdownItem).at(1)

    removeButton.props().onClick({
      stopPropagation: () => {}
    })

    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledTimes(1)
    expect(props.column.customProps.onExcludeGranule).toHaveBeenCalledWith({ collectionId: 'collectionId', granuleId: '2257684172' })
  })

  test('renders the add button under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup(undefined)

    const button = enzymeWrapper
      .find(PortalFeatureContainer)
      .find('.granule-results-table__granule-action--add')
    const portalFeatureContainer = button.parents(PortalFeatureContainer)

    expect(button.exists()).toBeTruthy()
    expect(portalFeatureContainer.props().authentication).toBeTruthy()
  })
})
