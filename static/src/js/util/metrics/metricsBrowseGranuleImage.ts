const { dataLayer = [] } = window

type BrowseGranuleImageParams = {
  /** Whether the browse granule image modal is open */
  modalOpen: boolean
  /** The ID of the granule */
  granuleId: string
  /** The value associated with the event */
  value: string
}

/**
* Pushes a browse-granule-image event on the dataLayer.
*/
export const metricsBrowseGranuleImage = ({
  modalOpen,
  granuleId,
  value
}: BrowseGranuleImageParams) => {
  dataLayer.push({
    event: 'browseGranuleImage',
    browseGranuleImageCategory: 'Browse Granule Image',
    browseGranuleImageModalOpen: modalOpen,
    browseGranuleImageGranuleId: granuleId,
    browseGranuleImageValue: value
  })
}
