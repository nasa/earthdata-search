import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Badge } from 'react-bootstrap'

import { collectionDetailsBodyProps } from './mocks'

import CollectionDetailsHeader from '../CollectionDetailsHeader'
import Skeleton from '../../Skeleton/Skeleton'
import { MoreActionsDropdown } from '../../MoreActionsDropdown/MoreActionsDropdown'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionSearch: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionDetailsHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetails component', () => {
  describe('when no metadata is provided', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Skeleton).length).toEqual(1)
    })
  })

  describe('when metadata is provided', () => {
    test('renders itself correctly with focused collection metadata', () => {
      const { enzymeWrapper } = setup({
        focusedCollectionMetadata: collectionDetailsBodyProps.focusedCollectionMetadata.metadata
      })
      expect(enzymeWrapper.type()).toEqual('div')
      expect(enzymeWrapper.props().className).toEqual('collection-details-header')
      expect(enzymeWrapper.find('.collection-details-header').length).toEqual(1)
      expect(enzymeWrapper.find('.collection-details-header__title').text()).toEqual(
        'Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050'
      )
      expect(enzymeWrapper.find(Badge).length).toEqual(2)
      expect(enzymeWrapper.find(Badge).at(0).text()).toEqual('1860_1993_2050_NITROGEN_830')
      expect(enzymeWrapper.find(Badge).at(1).text()).toEqual('Version 1')
      expect(enzymeWrapper.find(MoreActionsDropdown).length).toEqual(1)
    })
  })
})
