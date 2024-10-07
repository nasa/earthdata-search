// Import React from 'react'
// import {
//   render,
//   fireEvent,
//   waitFor
// } from '@testing-library/react'
// import { STATUS, ACTIONS } from 'react-joyride'
// import SearchTour from '../SearchTour'
import '@testing-library/jest-dom/extend-expect'

describe('SearchTour Keyboard Navigation', () => {
//   Test('increments stepIndex when ArrowRight key is pressed', async () => {
//     const setRunTour = jest.fn()

  //     // Mock the target elements for the tour steps
  //     const { getByText, container } = render(
  //       <div>
  //         <div className="search">Search Element</div>
  //         {' '}
  //         <div className="sidebar__inner">Sidebar Content</div>
  //         {' '}
  //         <SearchTour runTour setRunTour={setRunTour} />
  //       </div>
  //     )

  //     // Assert the first step renders correctly
  //     expect(getByText(/Welcome to Earthdata Search!/i)).toBeInTheDocument()

  //     // Simulate ArrowRight key press to move to the next step
  //     fireEvent.keyDown(window, { key: 'ArrowRight' })

  //     // Wait for the next step to render (using waitFor for async behavior)
  //     await waitFor(() => expect(container.querySelector('.sidebar__inner')).toBeInTheDocument())
  //   })
  // })

  // describe('SearchTour Joyride Callback', () => {
  //   test('calls setRunTour(false) and setStepIndex(0) when tour is finished', async () => {
  //     const setRunTour = jest.fn()
  //     const setStepIndex = jest.fn()

  //     // Mock the Joyride callback handler within the component
  //     const handleJoyrideCallback = jest.fn((data) => {
  //       if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(data.status)
  //             || data.action === ACTIONS.CLOSE) {
  //         setRunTour(false)
  //         setStepIndex(0)
  //       }
  //     })

  //     // Render the component with mock functions
  //     const { getByText } = render(
  //       <div>
  //         <div className="search">Search Element</div>
  //         {' '}
  //         {/* Mock target for the first step */}
  //         <SearchTour runTour setRunTour={setRunTour} />
  //       </div>
  //     )

  //     // Assert the first step renders correctly
  //     await waitFor(() => getByText(/Welcome to Earthdata Search!/i))

  //     // Simulate the Joyride callback for tour finish
  //     const joyrideCallbackData = {
  //       status: STATUS.FINISHED,
  //       action: ACTIONS.CLOSE,
  //       index: 0,
  //       type: 'step:after'
  //     }

  //     // Manually invoke the callback
  //     handleJoyrideCallback(joyrideCallbackData)

//     // Assertions for setRunTour(false) and setStepIndex(0)
//     expect(setRunTour).toHaveBeenCalledWith(false)
//     expect(setStepIndex).toHaveBeenCalledWith(0)
//   })
})
