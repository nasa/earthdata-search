import { LocationSlice, ImmerStateCreator } from '../types'

const { pathname, search } = window.location
console.log('🚀 ~ createLocationSlice.ts:4 ~ pathname:', pathname)
console.log('🚀 ~ createLocationSlice.ts:5 ~ search:', search)

const createLocationSlice: ImmerStateCreator<LocationSlice> = (set) => ({
  location: {
    location: {
      pathname,
      search
    },
    setLocation: (location) => {
      set((state) => {
        state.location.location = location
      })
    },
    navigate: () => {},
    setNavigate: (navigate) => {
      set((state) => {
        state.location.navigate = navigate
      })
    }
  }
})

export default createLocationSlice
