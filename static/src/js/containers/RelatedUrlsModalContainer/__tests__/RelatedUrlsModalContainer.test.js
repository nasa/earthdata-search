import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { RelatedUrlsModalContainer } from '../RelatedUrlsModalContainer'
import { RelatedUrlsModal } from '../../../components/CollectionDetails/RelatedUrlsModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionMetadata: {
      some: 'metadata'
    },
    isOpen: true,
    onToggleRelatedUrlsModal: jest.fn()
  }

  const enzymeWrapper = shallow(<RelatedUrlsModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('RelatedUrlsModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(RelatedUrlsModal).length).toBe(1)
    expect(enzymeWrapper.find(RelatedUrlsModal).props().collectionMetadata).toEqual({
      some: 'metadata'
    })
    expect(enzymeWrapper.find(RelatedUrlsModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(RelatedUrlsModal).props().onToggleRelatedUrlsModal).toEqual('function')
  })
})
