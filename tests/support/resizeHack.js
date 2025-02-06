// When working to minimize the size of our bundled index.js file we moved to lazy load leaflet.
// This caused an issue only seen in Playwright when running webkit where leaflet was unable to correctly
// determine the size of it's container. This hack resizes the window to trigger leaflet to correctly
// calculate the size of the window.
export const resizeHack = async (page, browserName) => {
  if (browserName === 'webkit') {
    // Make the window bigger
    console.log('Resizing window to 1400x901')
    await page.setViewportSize({
      width: 1400,
      height: 901
    })

    // Reset the window size to the correct value
    console.log('Resizing window to 1400x900')
    await page.setViewportSize({
      width: 1400,
      height: 900
    })
  }
}
