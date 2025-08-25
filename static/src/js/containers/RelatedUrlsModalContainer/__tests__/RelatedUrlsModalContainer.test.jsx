import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  RelatedUrlsModalContainer
} from '../RelatedUrlsModalContainer'
import RelatedUrlsModal from '../../../components/CollectionDetails/RelatedUrlsModal'

jest.mock('../../../components/CollectionDetails/RelatedUrlsModal', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: RelatedUrlsModalContainer,
  defaultProps: {
    isOpen: true,
    onToggleRelatedUrlsModal: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onToggleRelatedUrlsModal calls actions.toggleRelatedUrlsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleRelatedUrlsModal')

    mapDispatchToProps(dispatch).onToggleRelatedUrlsModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        relatedUrlsModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('RelatedUrlsModalContainer component', () => {
  test('passes its props and renders a RelatedUrlsModal component', () => {
    setup()

    expect(RelatedUrlsModal).toHaveBeenCalledTimes(1)
    expect(RelatedUrlsModal).toHaveBeenCalledWith({
      isOpen: true,
      onToggleRelatedUrlsModal: expect.any(Function)
    }, {})
  })
})
