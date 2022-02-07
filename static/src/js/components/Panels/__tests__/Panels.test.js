import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Panels from '../Panels'
import PanelSection from '../PanelSection'
import PanelGroup from '../PanelGroup'
import PanelItem from '../PanelItem'

import * as triggerKeyboardShortcut from '../../../util/triggerKeyboardShortcut'

Enzyme.configure({ adapter: new Adapter() })

const windowEventMap = {}
const documentEventMap = {}

beforeEach(() => {
  jest.useRealTimers()
  jest.clearAllMocks()

  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })

  window.removeEventListener = jest.fn()

  window.requestAnimationFrame = jest.fn()

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
    expect(sectionOne.find(PanelGroup).at(1).props().primaryHeading).toEqual('Panel Group 0.1')
    expect(sectionTwo.find(PanelGroup).at(0).props().primaryHeading).toEqual('Panel Group 1.0')
    expect(sectionTwo.find(PanelGroup).at(1).props().primaryHeading).toEqual('Panel Group 1.1')
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

  describe('After closing the panel', () => {
    test('updates the state', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.setProps({
        show: false
      })

      expect(enzymeWrapper.state().show).toBeFalsy()
    })
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

  describe('When mounting', () => {
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

  describe('When unmounting', () => {
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
      const resizeEvent = window.removeEventListener.mock.calls.filter((evt) => evt[0] === 'resize')[0]

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

  describe('When dragging the panel', () => {
    describe('if the panel is being closed', () => {
      test('calls props onPanelClose callback', () => {
        const { enzymeWrapper, props } = setup()
        enzymeWrapper.instance().clickStartWidth = 0
        enzymeWrapper.instance().clickStartX = 0
        enzymeWrapper.instance().pageX = 0
        enzymeWrapper.instance().handleClickIsValid = false

        enzymeWrapper.instance().onPanelDragEnd()
        expect(props.onPanelClose).toHaveBeenCalledTimes(1)
      })
    })

    describe('if the panel is being opened', () => {
      test('calls props onPanelOpen callback', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.instance().clickStartWidth = 600
        enzymeWrapper.instance().clickStartX = 600
        enzymeWrapper.instance().pageX = 500
        enzymeWrapper.instance().handleClickIsValid = false

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
          enzymeWrapper.instance().width = 600

          enzymeWrapper.instance().onWindowResize()

          expect(onCalculateMaxWidth).toHaveBeenCalledTimes(1)
          expect(enzymeWrapper.state().maxWidth).toEqual(550)
          expect(enzymeWrapper.instance().width).toEqual(550)
        })
      })

      describe('if the current panel size is smaller than the min', () => {
        test('sets the panel to the minimum width', () => {
          const onCalculateMaxWidth = jest.fn(() => 550)

          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().calculateMaxWidth = onCalculateMaxWidth
          enzymeWrapper.instance().width = 300

          enzymeWrapper.instance().onWindowResize()

          expect(onCalculateMaxWidth).toHaveBeenCalledTimes(1)
          expect(enzymeWrapper.state().maxWidth).toEqual(550)
          expect(enzymeWrapper.instance().width).toEqual(400)
        })
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
      enzymeWrapper.instance().width = 550

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
  })

  describe('onMouseMove', () => {
    test('clears the click timeout', () => {
      jest.useFakeTimers('legacy')

      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().handleClickCancelTimeout = '1234'
      enzymeWrapper.instance().onMouseUp()

      expect(clearTimeout).toHaveBeenCalledTimes(1)
      expect(clearTimeout).toHaveBeenCalledWith('1234')
    })

    test('removes the event listeners', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onMouseUp()

      expect(document.removeEventListener).toHaveBeenCalledTimes(2)
      expect(document.removeEventListener.mock.calls).toEqual([
        ['mousemove', enzymeWrapper.instance().onMouseMove],
        ['mouseup', enzymeWrapper.instance().onMouseUp]
      ])
    })

    test('calls onPanelDragEnd', () => {
      const onPanelDragEndMock = jest.fn()
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onPanelDragEnd = onPanelDragEndMock
      enzymeWrapper.instance().onMouseUp()

      expect(onPanelDragEndMock).toHaveBeenCalledTimes(1)
      expect(onPanelDragEndMock).toHaveBeenCalledWith()
    })
  })

  describe('onMouseMove', () => {
    test('sets the pageX in the instance', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onMouseMove({ pageX: 100 })

      expect(enzymeWrapper.instance().pageX).toEqual(100)
    })

    describe('when dragging is false', () => {
      test('does not run update', () => {
        const { enzymeWrapper } = setup()

        enzymeWrapper.setState({ dragging: false })

        enzymeWrapper.instance().onMouseMove({ pageX: 100 })

        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0)
      })
    })

    describe('when dragging is true', () => {
      test('runs update is an requestAnimationFrame', () => {
        const { enzymeWrapper } = setup()

        enzymeWrapper.setState({ dragging: true })

        enzymeWrapper.instance().onMouseMove({ pageX: 100 })

        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('onUpdate', () => {
    describe('when the panel is closed', () => {
      describe('when the handle is dragged less than the unminimize width', () => {
        test('does not change the state and open the panel', () => {
          const { enzymeWrapper } = setup()
          enzymeWrapper.instance().width = 400
          enzymeWrapper.instance().pageX = 450
          enzymeWrapper.instance().clickStartX = 400

          enzymeWrapper.setState({
            show: false
          })

          enzymeWrapper.instance().onUpdate()

          expect(enzymeWrapper.state().show).toEqual(false)
          expect(enzymeWrapper.instance().width).toEqual(400)
        })
      })

      describe('when the handle is dragged more than the unminimize width', () => {
        test('changes the state and opens the panel to the min width', () => {
          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().width = 400
          enzymeWrapper.instance().pageX = 601
          enzymeWrapper.instance().clickStartX = 400
          enzymeWrapper.instance().clickStartWidth = 400

          enzymeWrapper.setState({
            show: false
          })

          enzymeWrapper.instance().onUpdate()

          expect(enzymeWrapper.state().show).toEqual(true)
          expect(enzymeWrapper.instance().width).toEqual(400)
        })
      })

      describe('when the handle is dragged more than the minimum width', () => {
        test('changes the state and opens the panel to the desired width', () => {
          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().width = 400
          enzymeWrapper.instance().pageX = 1000
          enzymeWrapper.instance().clickStartX = 400
          enzymeWrapper.instance().clickStartWidth = 400

          enzymeWrapper.setState({
            show: false
          })

          enzymeWrapper.instance().onUpdate()

          expect(enzymeWrapper.state().show).toEqual(true)
          expect(enzymeWrapper.instance().width).toEqual(600)
        })
      })

      describe('when the handle is dragged more than the maximum width', () => {
        test('changes the state and opens the panel to the desired width', () => {
          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().width = 400
          enzymeWrapper.instance().pageX = 1450
          enzymeWrapper.instance().clickStartX = 400
          enzymeWrapper.instance().clickStartWidth = 400

          enzymeWrapper.setState({
            maxWidth: 1000,
            show: false
          })

          enzymeWrapper.instance().onUpdate()

          expect(enzymeWrapper.state().show).toEqual(true)
          expect(enzymeWrapper.instance().width).toEqual(1000)
        })
      })
    })

    describe('when the panel is open', () => {
      describe('if the panel should minimize at its current width', () => {
        test('sets willMinimize to true', () => {
          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().width = 400
          enzymeWrapper.instance().pageX = 100
          enzymeWrapper.instance().clickStartX = 400
          enzymeWrapper.instance().clickStartWidth = 400

          enzymeWrapper.setState({
            maxWidth: 1000,
            show: true,
            willMinimize: false
          })

          enzymeWrapper.instance().onUpdate()

          expect(enzymeWrapper.state().show).toEqual(true)
          expect(enzymeWrapper.state().willMinimize).toEqual(true)
        })
      })

      describe('if the panel should not minimize at its current width', () => {
        test('sets willMinimize to false', () => {
          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().width = 400
          enzymeWrapper.instance().pageX = 600
          enzymeWrapper.instance().clickStartX = 400
          enzymeWrapper.instance().clickStartWidth = 400

          enzymeWrapper.setState({
            maxWidth: 1000,
            show: true,
            willMinimize: true
          })

          enzymeWrapper.instance().onUpdate()

          expect(enzymeWrapper.state().show).toEqual(true)
          expect(enzymeWrapper.state().willMinimize).toEqual(false)
        })
      })
    })

    describe('if the panel has been dragged less than the minimum width, but greater than the minimize width', () => {
      test('sets the width to the min width', () => {
        const { enzymeWrapper } = setup()

        enzymeWrapper.instance().width = 400
        enzymeWrapper.instance().pageX = 300
        enzymeWrapper.instance().clickStartX = 400
        enzymeWrapper.instance().clickStartWidth = 400

        enzymeWrapper.setState({
          maxWidth: 1000,
          show: true
        })

        enzymeWrapper.instance().onUpdate()

        expect(enzymeWrapper.state().show).toEqual(true)
        expect(enzymeWrapper.instance().width).toEqual(400)
      })
    })

    describe('if the panel has been dragged greater than the max width', () => {
      test('sets the width to the max width', () => {
        const { enzymeWrapper } = setup()

        enzymeWrapper.instance().width = 400
        enzymeWrapper.instance().pageX = 1500
        enzymeWrapper.instance().clickStartX = 400
        enzymeWrapper.instance().clickStartWidth = 400

        enzymeWrapper.setState({
          maxWidth: 1000,
          show: true
        })

        enzymeWrapper.instance().onUpdate()

        expect(enzymeWrapper.state().show).toEqual(true)
        expect(enzymeWrapper.instance().width).toEqual(1000)
      })
    })

    describe('if the panel has been dragged to a valid width', () => {
      test('sets the width', () => {
        const { enzymeWrapper } = setup()

        enzymeWrapper.instance().width = 400
        enzymeWrapper.instance().pageX = 600
        enzymeWrapper.instance().clickStartX = 400
        enzymeWrapper.instance().clickStartWidth = 400

        enzymeWrapper.setState({
          maxWidth: 1000,
          show: true
        })

        enzymeWrapper.instance().onUpdate()

        expect(enzymeWrapper.state().show).toEqual(true)
        expect(enzymeWrapper.instance().width).toEqual(600)
      })
    })
  })

  describe('onPanelDragStart', () => {
    test('sets the state', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().clickStartX = 0
      enzymeWrapper.instance().clickStartWidth = 0

      enzymeWrapper.setState({
        dragging: false
      })

      enzymeWrapper.instance().onPanelDragStart(400, 500)

      expect(enzymeWrapper.instance().clickStartWidth).toEqual(400)
      expect(enzymeWrapper.instance().clickStartX).toEqual(500)
      expect(enzymeWrapper.state().dragging).toEqual(true)
    })
  })

  describe('updatePanelWidth', () => {
    test('sets the width', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().updatePanelWidth(567)

      expect(enzymeWrapper.instance().width).toEqual(567)
    })

    test('sets the style on the container', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().updatePanelWidth(567)

      expect(enzymeWrapper.instance().container.style.width).toEqual('567px')
    })

    test('calls updateResponsiveClassNames', () => {
      const updateResponsiveClassNamesMock = jest.fn()
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().updateResponsiveClassNames = updateResponsiveClassNamesMock

      enzymeWrapper.instance().updatePanelWidth(567)

      expect(updateResponsiveClassNamesMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateResponsiveClassNames', () => {
    test('adds and removes class names', () => {
      const classListAddMock = jest.fn()
      const classListRemoveMock = jest.fn()

      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().responsiveContainer.classList.add = classListAddMock
      enzymeWrapper.instance().responsiveContainer.classList.remove = classListRemoveMock
      enzymeWrapper.instance().width = 400

      enzymeWrapper.instance().updateResponsiveClassNames()

      enzymeWrapper.instance().width = 700

      enzymeWrapper.instance().updateResponsiveClassNames()

      expect(classListAddMock).toHaveBeenCalledTimes(5)
      expect(classListAddMock.mock.calls).toEqual([
        ['panels--xs'],
        ['panels--600'],
        ['panels--xs'],
        ['panels--sm'],
        ['panels--md']
      ])
      expect(classListRemoveMock).toHaveBeenCalledTimes(7)
      expect(classListRemoveMock.mock.calls).toEqual([
        ['panels--600'],
        ['panels--sm'],
        ['panels--md'],
        ['panels--lg'],
        ['panels--xl'],
        ['panels--lg'],
        ['panels--xl']
      ])
    })
  })

  describe('calculateMaxWidth', () => {
    test('calculates the correct width', () => {
      const querySelectorMock = jest.fn((selector) => {
        if (selector === '.route-wrapper__content') {
          return {
            offsetWidth: 1200
          }
        }

        return {}
      })

      document.querySelector = querySelectorMock

      const { enzymeWrapper } = setup()

      const maxWidth = enzymeWrapper.instance().calculateMaxWidth()

      // 1020 = 1200 - 150 - 30
      expect(maxWidth).toEqual(1145)
    })
  })

  describe('onWindowKeyUp', () => {
    describe('when the ] key is pressed', () => {
      test('toggles the panel state correctly', () => {
        const preventDefaultMock = jest.fn()
        const stopPropagationMock = jest.fn()

        const shortcutSpy = jest.spyOn(triggerKeyboardShortcut, 'triggerKeyboardShortcut')

        const { enzymeWrapper } = setup()

        // Test thats the panel starts open
        expect(enzymeWrapper.state().show).toEqual(true)
        expect(enzymeWrapper.state().willMinimize).toEqual(false)

        // Trigger the simulated window event
        windowEventMap.keyup({
          key: ']',
          tagName: 'body',
          type: 'keyup',
          preventDefault: preventDefaultMock,
          stopPropagation: stopPropagationMock
        })

        // Test that the panel is closed and the event propagation has been prevented
        expect(shortcutSpy).toHaveBeenCalledTimes(1)
        expect(preventDefaultMock).toHaveBeenCalledTimes(1)
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
        expect(enzymeWrapper.state().show).toEqual(false)
        expect(enzymeWrapper.state().willMinimize).toEqual(true)
      })
    })
  })
})
