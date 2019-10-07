import browser from 'browser-detect'

import { UPDATE_BROWSER_VERSION } from '../constants/actionTypes'

export const updateBrowserVersion = () => ({
  type: UPDATE_BROWSER_VERSION,
  payload: browser()
})

export default updateBrowserVersion
