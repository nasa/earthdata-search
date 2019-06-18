import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Panels from '../Panels'
import PanelSection from '../PanelSection'
import PanelGroup from '../PanelGroup'
import PanelItem from '../PanelItem'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    show: true,
    activePanel: '0.0.0',
    onPanelClose: jest.fn(),
    onChangePanel: jest.fn()
  }

  const enzymeWrapper = mount(
    <Panels {...props}>
      <PanelSection>
        <PanelGroup
          primaryHeading="Panel Group 0.0"
          secondaryHeading="Secondary tile Panel 1"
          footer={<div className="footer">A group footer</div>}
        >
          <PanelItem>
            Panel 0.0.0 Content
          </PanelItem>
          <PanelItem>
            Panel 0.0.1 Content
          </PanelItem>
        </PanelGroup>
        <PanelGroup
          primaryHeading="Panel Group 0.1"
          secondaryHeading="Secondary tile Panel 2"
          footer={<div className="footer">Another group footer</div>}
        >
          <PanelItem hideFooter>
            Panel 0.1.0 Content
          </PanelItem>
        </PanelGroup>
      </PanelSection>
      <PanelSection>
        <PanelGroup
          primaryHeading="Panel Group 1.0"
          footer={<div className="footer">A group footer</div>}
        >
          <PanelItem footer={<div className="fake-footer">A fake footer</div>}>
            Panel 1.0.0 Content
          </PanelItem>
          <PanelItem>
            Panel 1.0.1 Content
          </PanelItem>
        </PanelGroup>
        <PanelGroup
          primaryHeading="Panel Group 1.1"
        >
          <PanelItem>
            Panel 1.1.0 Content
          </PanelItem>
          <PanelItem>
            Panel 1.1.1 Content
          </PanelItem>
        </PanelGroup>
      </PanelSection>
    </Panels>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('Panels component', () => {
  test('renders itself and its children correctly', () => {
    const { enzymeWrapper } = setup()
    const sectionOne = enzymeWrapper.find(PanelSection).at(0)
    const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
    expect(enzymeWrapper.find(PanelSection).length).toBe(2)
    expect(sectionOne.find(PanelGroup).length).toEqual(2)
    expect(sectionTwo.find(PanelGroup).length).toEqual(2)
    expect(sectionOne.find(PanelItem).length).toEqual(3)
    expect(sectionTwo.find(PanelItem).length).toEqual(4)
  })

  test('renders the panel sections correctly', () => {
    const { enzymeWrapper } = setup()
    const sectionOne = enzymeWrapper.find(PanelSection).at(0)
    const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
    expect(sectionOne.props().isOpen).toEqual(true)
    expect(sectionOne.props().isActive).toEqual(true)
    expect(sectionOne.props().panelSectionId).toEqual('0')
    expect(sectionTwo.props().isOpen).toEqual(false)
    expect(sectionTwo.props().isActive).toEqual(false)
    expect(sectionTwo.props().panelSectionId).toEqual('1')
  })

  test('renders the panel groups correctly', () => {
    const { enzymeWrapper } = setup()
    const sectionOne = enzymeWrapper.find(PanelSection).at(0)
    const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
    expect(sectionOne.find(PanelGroup).at(0).props().isOpen).toEqual(true)
    expect(sectionOne.find(PanelGroup).at(0).props().isActive).toEqual(true)
    expect(sectionOne.find(PanelGroup).at(0).props().panelGroupId).toEqual('0')
    expect(sectionOne.find(PanelGroup).at(1).props().isOpen).toEqual(false)
    expect(sectionOne.find(PanelGroup).at(1).props().isActive).toEqual(false)
    expect(sectionOne.find(PanelGroup).at(1).props().panelGroupId).toEqual('1')
    expect(sectionTwo.find(PanelGroup).at(0).props().isOpen).toEqual(false)
    expect(sectionTwo.find(PanelGroup).at(0).props().isActive).toEqual(false)
    expect(sectionTwo.find(PanelGroup).at(0).props().panelGroupId).toEqual('0')
  })

  test('renders the panel groups titles correctly', () => {
    const { enzymeWrapper } = setup()
    const sectionOne = enzymeWrapper.find(PanelSection).at(0)
    const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
    expect(sectionOne.find(PanelGroup).at(0).props().primaryHeading).toEqual('Panel Group 0.0')
    expect(sectionOne.find(PanelGroup).at(0).props().secondaryHeading).toEqual('Secondary tile Panel 1')
    expect(sectionOne.find(PanelGroup).at(1).props().primaryHeading).toEqual('Panel Group 0.1')
    expect(sectionOne.find(PanelGroup).at(1).props().secondaryHeading).toEqual('Secondary tile Panel 2')
    expect(sectionTwo.find(PanelGroup).at(0).props().primaryHeading).toEqual('Panel Group 1.0')
    expect(sectionTwo.find(PanelGroup).at(0).props().secondaryHeading).toEqual(null)
    expect(sectionTwo.find(PanelGroup).at(1).props().primaryHeading).toEqual('Panel Group 1.1')
    expect(sectionTwo.find(PanelGroup).at(1).props().secondaryHeading).toEqual(null)
  })

  test('renders the panel items correctly', () => {
    const { enzymeWrapper } = setup()
    const sectionOne = enzymeWrapper.find(PanelSection).at(0)
    const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
    expect(sectionOne.find(PanelItem).at(0).props().isActive).toEqual(true)
    expect(sectionOne.find(PanelItem).at(0).props().panelId).toEqual('0')
    expect(sectionOne.find(PanelItem).at(1).props().isActive).toEqual(false)
    expect(sectionOne.find(PanelItem).at(1).props().panelId).toEqual('1')
    expect(sectionOne.find(PanelItem).at(2).props().isActive).toEqual(false)
    expect(sectionOne.find(PanelItem).at(2).props().panelId).toEqual('0')
    expect(sectionTwo.find(PanelItem).at(0).props().isActive).toEqual(false)
    expect(sectionTwo.find(PanelItem).at(0).props().panelId).toEqual('0')
    expect(sectionTwo.find(PanelItem).at(1).props().isActive).toEqual(false)
    expect(sectionTwo.find(PanelItem).at(1).props().panelId).toEqual('1')
    expect(sectionTwo.find(PanelItem).at(2).props().isActive).toEqual(false)
    expect(sectionTwo.find(PanelItem).at(2).props().panelId).toEqual('0')
    expect(sectionTwo.find(PanelItem).at(3).props().isActive).toEqual(false)
    expect(sectionTwo.find(PanelItem).at(3).props().panelId).toEqual('1')
  })

  test('renders the panel footers correctly', () => {
    const { enzymeWrapper } = setup()
    const sectionOne = enzymeWrapper.find(PanelSection).at(0)
    const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
    expect(sectionOne.find(PanelGroup).at(0).find('.footer').at(0)
      .text()).toEqual('A group footer')
    expect(sectionOne.find(PanelGroup).at(0).find('.footer').at(1)
      .text()).toEqual('A group footer')
    expect(sectionOne.find(PanelGroup).at(1).find('.footer').length).toEqual(0)
    expect(sectionTwo.find(PanelGroup).at(0).find('.fake-footer').at(0)
      .text()).toEqual('A fake footer')
    expect(sectionTwo.find(PanelGroup).at(0).find('.footer').at(0)
      .text()).toEqual('A group footer')
  })

  describe('After switching a panel section', () => {
    test('renders the panel sections correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '1.0.0'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.props().isActive).toEqual(false)
      expect(sectionTwo.props().isActive).toEqual(true)
    })

    test('renders the panel groups correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '1.0.0'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.find(PanelGroup).at(0).props().isActive).toEqual(false)
      expect(sectionOne.find(PanelGroup).at(1).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelGroup).at(0).props().isActive).toEqual(true)
      expect(sectionTwo.find(PanelGroup).at(1).props().isActive).toEqual(false)
    })

    test('renders the panel items correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '1.0.0'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.find(PanelItem).at(0).props().isActive).toEqual(false)
      expect(sectionOne.find(PanelItem).at(1).props().isActive).toEqual(false)
      expect(sectionOne.find(PanelItem).at(2).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(0).props().isActive).toEqual(true)
      expect(sectionTwo.find(PanelItem).at(1).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(2).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(3).props().isActive).toEqual(false)
    })
  })

  describe('After switching a panel group', () => {
    test('renders the panel sections correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '0.1.0'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.props().isActive).toEqual(true)
      expect(sectionTwo.props().isActive).toEqual(false)
    })

    test('renders the panel groups correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '0.1.0'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.find(PanelGroup).at(0).props().isActive).toEqual(false)
      expect(sectionOne.find(PanelGroup).at(1).props().isActive).toEqual(true)
      expect(sectionTwo.find(PanelGroup).at(0).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelGroup).at(1).props().isActive).toEqual(false)
    })

    test('renders the panel items correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '0.1.0'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.find(PanelItem).at(0).props().isActive).toEqual(false)
      expect(sectionOne.find(PanelItem).at(1).props().isActive).toEqual(false)
      expect(sectionOne.find(PanelItem).at(2).props().isActive).toEqual(true)
      expect(sectionTwo.find(PanelItem).at(0).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(1).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(2).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(3).props().isActive).toEqual(false)
    })
  })

  describe('After switching a panel item', () => {
    test('renders the panel sections correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '0.0.1'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.props().isActive).toEqual(true)
      expect(sectionTwo.props().isActive).toEqual(false)
    })

    test('renders the panel groups correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '0.0.1'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.find(PanelGroup).at(0).props().isActive).toEqual(true)
      expect(sectionOne.find(PanelGroup).at(1).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelGroup).at(0).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelGroup).at(1).props().isActive).toEqual(false)
    })

    test('renders the panel items correctly', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        activePanel: '0.0.1'
      })
      const sectionOne = enzymeWrapper.find(PanelSection).at(0)
      const sectionTwo = enzymeWrapper.find(PanelSection).at(1)
      expect(sectionOne.find(PanelItem).at(0).props().isActive).toEqual(false)
      expect(sectionOne.find(PanelItem).at(1).props().isActive).toEqual(true)
      expect(sectionOne.find(PanelItem).at(2).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(0).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(1).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(2).props().isActive).toEqual(false)
      expect(sectionTwo.find(PanelItem).at(3).props().isActive).toEqual(false)
    })
  })

  test('calls props onPanelClose callback', () => {
    const { enzymeWrapper, props } = setup()
    enzymeWrapper.instance().onPanelsClose()
    expect(props.onPanelClose).toHaveBeenCalledTimes(1)
  })

  test('calls props onChangePanel callback', () => {
    const { enzymeWrapper, props } = setup()
    enzymeWrapper.instance().onChangePanel('0.0.1')
    expect(props.onChangePanel).toHaveBeenCalledTimes(1)
    expect(props.onChangePanel).toHaveBeenCalledWith('0.0.1')
  })
})
