import { detect } from 'detect-browser'

import { UPDATE_BROWSER_VERSION } from '../constants/actionTypes'

export const updateBrowserVersion = () => ({
  type: UPDATE_BROWSER_VERSION,
  payload: detect()
})

export default updateBrowserVersion
