import { PortalSlice, ImmerStateCreator } from '../types'

const createPortalSlice: ImmerStateCreator<PortalSlice> = () => ({
  portal: {} as PortalSlice['portal']
})

export default createPortalSlice
