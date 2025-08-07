import React from 'react'

import AdminRetrievals from '../../../components/AdminRetrievals/AdminRetrievals'
import { AdminRetrievalsContainer } from '../AdminRetrievalsContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/AdminRetrievals/AdminRetrievals', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminRetrievalsContainer,
  defaultProps: {
    history: {
      push: jest.fn()
    }
  }
})

describe('when the container is rendered', () => {
  test('calls AdminRetrievals with the correct props', () => {
    const { props } = setup()

    expect(AdminRetrievals).toHaveBeenCalledTimes(1)

    expect(AdminRetrievals).toHaveBeenCalledWith({
      historyPush: props.history.push
    }, {})
  })
})
