import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Panels from '../Panels'
import PanelSection from '../PanelSection'
import PanelGroup from '../PanelGroup'
import PanelItem from '../PanelItem'

Enzyme.configure({ adapter: new Adapter() })

const windowEventMap = {}
const documentEventMap = {}

beforeEach(() => {
  jest.clearAllMocks()

  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })

  window.removeEventListener = jest.fn()

  window.cancelAnimationFrame = jest.fn()

  document.addEventListener = jest.fn((event, cb) => {
    documentEventMap[event] = cb
  })

  document.removeEventListener = jest.fn()
})

function setup() {
  const props = {
    show: true,
    activePanel: '0.0.0',
    onPanelClose: jest.fn(),
    onPanelOpen: jest.fn(),
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

  describe('when mounting', () => {
    test('assigns the resize event listener', () => {
      const onWindowResizeMock = jest.fn()

      jest.spyOn(Panels.prototype, 'onWindowResize').mockImplementationOnce(onWindowResizeMock)

      setup()

      windowEventMap.resize()

      expect(onWindowResizeMock).toHaveBeenCalledTimes(1)
    })

    test('calculates the max width', () => {
      const onCalculateMaxWidth = jest.fn()

      jest.spyOn(Panels.prototype, 'calculateMaxWidth').mockImplementationOnce(onCalculateMaxWidth)

      setup()

      expect(onCalculateMaxWidth).toHaveBeenCalledTimes(1)
    })

    test('sets the maxWidth in the state', () => {
      const onCalculateMaxWidth = jest.fn(() => 1234)

      jest.spyOn(Panels.prototype, 'calculateMaxWidth').mockImplementationOnce(onCalculateMaxWidth)

      const { enzymeWrapper } = setup()

      expect(onCalculateMaxWidth).toHaveBeenCalledTimes(1)
      expect(enzymeWrapper.state().maxWidth).toEqual(1234)
    })
  })

  describe('when unmounting', () => {
    test('cancels the animation frame', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().rafId = 12345

      enzymeWrapper.unmount()

      expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1)
      expect(window.cancelAnimationFrame).toHaveBeenCalledWith(12345)
    })

    test('removes the resize event listener', () => {
      const onWindowResizeMock = jest.fn(() => 'resize mock')

      jest.spyOn(Panels.prototype, 'onWindowResize').mockImplementationOnce(onWindowResizeMock)

      const { enzymeWrapper } = setup()

      enzymeWrapper.unmount()

      // React appears to call removeEventListener a ton of times here, so the call
      //  we want to check against will show up in an array of possibly unknown size.
      // Here we filter out the event based on its name, and inspect the arguments
      // that were passed.
      const resizeEvent = window.removeEventListener.mock.calls.filter(evt => evt[0] === 'resize')[0]

      expect(resizeEvent.length).toEqual(2)
      expect(resizeEvent[0]).toEqual('resize')
      expect(resizeEvent[1]()).toEqual('resize mock')
    })

    test('removes the document event listeners', () => {
      const onMouseMoveMock = jest.fn()
      const onMouseUpMock = jest.fn()

      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onMouseMove = onMouseMoveMock
      enzymeWrapper.instance().onMouseUp = onMouseUpMock

      enzymeWrapper.unmount()

      expect(document.removeEventListener).toHaveBeenCalledTimes(2)
      expect(document.removeEventListener.mock.calls[0]).toEqual([
        'mousemove',
        onMouseMoveMock
      ])
      expect(document.removeEventListener.mock.calls[1]).toEqual([
        'mouseup',
        onMouseUpMock
      ])
    })
  })

  describe('when dragging the panel', () => {
    describe('if the panel is being closed', () => {
      test('calls props onPanelClose callback', () => {
        const { enzymeWrapper, props } = setup()
        enzymeWrapper.setState({
          clickStartWidth: 0,
          pageX: 0,
          clickStartX: 0
        })
        enzymeWrapper.instance().onPanelDragEnd()
        expect(props.onPanelClose).toHaveBeenCalledTimes(1)
      })
    })

    describe('if the panel is being opened', () => {
      test('calls props onPanelOpen callback', () => {
        const { enzymeWrapper, props } = setup()
        enzymeWrapper.setState({
          clickStartWidth: 600,
          pageX: 500,
          clickStartX: 600
        })
        enzymeWrapper.instance().onPanelDragEnd()
        expect(props.onPanelOpen).toHaveBeenCalledTimes(1)
      })
    })

    describe('onWindowResize', () => {
      describe('if the current panel size is within the min and max', () => {
        test('recalculates the maxWidth and leaves the width alone', () => {
          const onCalculateMaxWidth = jest.fn(() => 1000)

          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().calculateMaxWidth = onCalculateMaxWidth

          enzymeWrapper.setState({
            width: 600
          })

          enzymeWrapper.instance().onWindowResize()

          expect(onCalculateMaxWidth).toHaveBeenCalledTimes(1)
          expect(enzymeWrapper.state().maxWidth).toEqual(1000)
          expect(enzymeWrapper.state().width).toEqual(600)
        })
      })

      describe('if the current panel size is bigger than the max', () => {
        test('recalculates the maxWidth and sets the width to the new max', () => {
          const onCalculateMaxWidth = jest.fn(() => 550)

          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().calculateMaxWidth = onCalculateMaxWidth

          enzymeWrapper.setState({
            width: 600
          })

          enzymeWrapper.instance().onWindowResize()

          expect(onCalculateMaxWidth).toHaveBeenCalledTimes(1)
          expect(enzymeWrapper.state().maxWidth).toEqual(550)
          expect(enzymeWrapper.state().width).toEqual(550)
        })
      })

      describe('if the current panel size is smaller than the min', () => {
        test('sets the panel to the minimum width', () => {
          const onCalculateMaxWidth = jest.fn(() => 550)

          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().calculateMaxWidth = onCalculateMaxWidth

          enzymeWrapper.setState({
            width: 300
          })

          enzymeWrapper.instance().onWindowResize()

          expect(onCalculateMaxWidth).toHaveBeenCalledTimes(1)
          expect(enzymeWrapper.state().maxWidth).toEqual(550)
          expect(enzymeWrapper.state().width).toEqual(400)
        })
      })
    })

    describe('onMouseDown', () => {
      test('applies the event listeners', () => {
        const { enzymeWrapper } = setup()
        const eventData = {
          button: 0,
          stopPropagation: jest.fn(),
          preventDefault: jest.fn()
        }
        enzymeWrapper.instance().onMouseDown(eventData)

        expect(document.addEventListener).toHaveBeenCalledTimes(2)
      })

      test('calls onPanelDragStart', () => {
        const onPanelDragStartMock = jest.fn()
        const { enzymeWrapper } = setup()
        enzymeWrapper.setState({
          width: 550
        })
        const eventData = {
          button: 0,
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
          pageX: 551
        }
        enzymeWrapper.instance().onPanelDragStart = onPanelDragStartMock
        enzymeWrapper.instance().onMouseDown(eventData)

        expect(onPanelDragStartMock).toHaveBeenCalledTimes(1)
        expect(onPanelDragStartMock).toHaveBeenCalledWith(550, 551)
      })

      test('prevents default click behaviors', () => {
        const { enzymeWrapper } = setup()
        const eventData = {
          button: 0,
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
        }

        enzymeWrapper.instance().onMouseDown(eventData)

        expect(eventData.stopPropagation).toHaveBeenCalledTimes(1)
        expect(eventData.preventDefault).toHaveBeenCalledTimes(1)
      })
    })

    // TODO:
    // describe('onMouseUp', () => {
    // })

    // describe('onMouseMove', () => {
    // })

    // describe('onUpdate', () => {
    // })

    // describe('onPanelDragStart', () => {
    // })

    // describe('calculateMaxWidth', () => {
    // })
  })
})
