import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import MoreActionsDropdownItem from '../../MoreActionsDropdown/MoreActionsDropdownItem'
import GranuleResultsTableHeaderCell from '../GranuleResultsTableHeaderCell'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    column: {
      customProps: {
        collectionId: 'collectionId',
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
        isCwic: false,
        dataLinks: [],
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
          isCwic: true,
          dataLinks: [],
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

  describe('when authentication is disabled', () => {
    test('hides the add to project button', () => {
      const { enzymeWrapper } = setup({
        column: {
          customProps: {
            collectionId: 'collectionId',
            location: {},
            isGranuleInProject: jest.fn(),
            portal: {
              features: {
                authentication: false
              }
            },
            onAddGranuleToProjectCollection: jest.fn(),
            onExcludeGranule: jest.fn(),
            onFocusedGranuleChange: jest.fn(),
            onMetricsDataAccess: jest.fn(),
            onRemoveGranuleFromProjectCollection: jest.fn()
          }
        }
      })

      const addButton = enzymeWrapper.find('.granule-results-table__granule-action--add')

      expect(addButton.exists()).toBeFalsy()
    })
  })
})
