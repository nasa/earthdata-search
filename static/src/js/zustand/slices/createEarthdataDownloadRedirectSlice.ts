import { EarthdataDownloadRedirectSlice, ImmerStateCreator } from '../types'

// eslint-disable-next-line max-len
const createEarthdataDownloadRedirectSlice: ImmerStateCreator<EarthdataDownloadRedirectSlice> = (set) => ({
  earthdataDownloadRedirect: {
    redirect: '',
    setRedirect: (redirect) => {
      set((state) => {
        state.earthdataDownloadRedirect.redirect = redirect
      })
    },
    clearRedirect: () => {
      set((state) => {
        state.earthdataDownloadRedirect.redirect = ''
      })
    }
  }
})

export default createEarthdataDownloadRedirectSlice
