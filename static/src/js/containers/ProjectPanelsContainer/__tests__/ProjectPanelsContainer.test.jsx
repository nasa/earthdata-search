import React from 'react'

import actions from '../../../actions'
import { mapDispatchToProps, ProjectPanelsContainer } from '../ProjectPanelsContainer'
import ProjectPanels from '../../../components/ProjectPanels/ProjectPanels'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/ProjectPanels/ProjectPanels', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ProjectPanelsContainer,
  defaultProps: {
    onChangePath: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })
})

describe('ProjectPanelsContainer component', () => {
  test('passes its props and renders a single ProjectPanels component', () => {
    const { props } = setup()

    expect(ProjectPanels).toHaveBeenCalledTimes(1)
    expect(ProjectPanels).toHaveBeenCalledWith({
      onChangePath: props.onChangePath
    }, {})
  })
})
