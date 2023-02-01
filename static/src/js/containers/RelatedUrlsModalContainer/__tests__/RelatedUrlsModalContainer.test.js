import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, RelatedUrlsModalContainer } from '../RelatedUrlsModalContainer'
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

describe('mapDispatchToProps', () => {
  test('onToggleRelatedUrlsModal calls actions.toggleRelatedUrlsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleRelatedUrlsModal')

    mapDispatchToProps(dispatch).onToggleRelatedUrlsModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      ui: {
        relatedUrlsModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      collectionMetadata: {},
      isOpen: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

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
