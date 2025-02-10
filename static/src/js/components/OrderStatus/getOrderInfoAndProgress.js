/**
 * @typedef {Object} OrderStatusInfoAndProgress
 * @property {Array} browseUrls List of browse URLs
 * @property {String} contactEmail Email of the contact
 * @property {String} contactName Name of the contact
 * @property {Array} downloadUrls List of download URLs
 * @property {Boolean} messageIsError Is the message an error
 * @property {Array} messages List of messages
 * @property {String} orderInfo Information about the order
 * @property {Number} percentDoneDownloadLinks Percentage done downloading links
 * @property {Number} progressPercentage Percentage of progress
 * @property {Array} s3Urls List of S3 URLs
 * @property {Array} stacLinks List of STAC links
 * @property {Boolean} stacLinksIsLoading Are the STAC links loading
 * @property {Number} totalCompleteOrders Total number of complete orders
 * @property {Number} totalOrders Total number of orders
 */

/**
 * Helper function to determine all the order information and progress information displayed by OrderStatusInfo
 * @param {Object} params
 * @param {Object} params.granuleLinks Granule links object retrieved from the order
 * @param {Boolean} params.isDownload Is the Access Method download
 * @param {Boolean} params.isEchoOrders Is the Access Method ECHO ORDERS
 * @param {Boolean} params.isEsi Is the Access Method ESI
 * @param {Boolean} params.isHarmony Is the Access Method Harmony
 * @param {Boolean} params.isOpendap Is the Access Method Opendap
 * @param {Boolean} params.isSwodlr Is the Access Method SWODLR
 * @param {Array} params.orders Orders array retrieved from the order
 * @param {String} params.stateFromOrderStatus State from the order status
 * @returns {OrderStatusInfoAndProgress} Object containing all the order information and progress information
 */
const getOrderInfoAndProgress = ({
  granuleLinks,
  isDownload,
  isEchoOrders,
  isEsi,
  isHarmony,
  isOpendap,
  isSwodlr,
  orders,
  stateFromOrderStatus
}) => {
  const messages = []
  let messageIsError = false
  let orderInfo = null

  let browseUrls = []
  let downloadUrls = []
  let s3Urls = []
  let totalOrders = 0
  let totalCompleteOrders = 0
  let percentDoneDownloadLinks
  let progressPercentage = 0
  let contactName = null
  let contactEmail = null
  let stacLinksIsLoading = false
  let stacLinks = []

  const { links: granuleDownloadLinks = {} } = granuleLinks
  const {
    browse: browseLinks = [],
    download: downloadLinks = [],
    s3: s3Links = []
  } = granuleDownloadLinks
  if (browseLinks.length > 0) browseUrls = [...browseLinks]
  if (downloadLinks.length > 0) downloadUrls = [...downloadLinks]
  if (s3Links.length > 0) s3Urls = [...s3Links]

  if (isDownload) {
    ({ percentDone: percentDoneDownloadLinks } = granuleLinks)
    progressPercentage = 100
    orderInfo = 'Download your data directly from the links below, or use the provided download script.'
  }

  if (isOpendap) {
    progressPercentage = 100
    orderInfo = 'Download your data directly from the links below, or use the provided download script.'
  }

  if (isEchoOrders) {
    if (stateFromOrderStatus === 'creating' || stateFromOrderStatus === 'in_progress') {
      progressPercentage = 0
      orderInfo = 'Your order has been created and sent to the data provider. You will receive an email when your order is processed and ready to download.'
    }

    if (stateFromOrderStatus === 'complete') {
      progressPercentage = 100
      orderInfo = 'The data provider has completed processing your order. You should have received an email with information regarding how to access your data from the data provider.'
    }

    if (stateFromOrderStatus === 'failed') {
      progressPercentage = 100
      orderInfo = 'The data provider is reporting the order has failed processing.'
    }
  }

  if (isSwodlr) {
    if (stateFromOrderStatus === 'creating') {
      progressPercentage = 0

      orderInfo = 'Your orders are pending generation. This may take some time.'
    }

    if (stateFromOrderStatus === 'in_progress') {
      orderInfo = 'Your orders are currently being generated. Once generation is finished, links will be displayed below and sent to the email you\'ve provided.'
    }

    if (stateFromOrderStatus === 'complete') {
      orderInfo = 'Your orders have been generated and are available for download.'
    }

    if (stateFromOrderStatus === 'failed') {
      progressPercentage = 0
      orderInfo = 'The order has failed.'
    }

    let totalNumber = 0
    let totalProcessed = 0

    orders.forEach((order) => {
      const {
        error,
        state,
        order_information: orderInformation = {}
      } = order

      const { reason, granules = [] } = orderInformation

      totalNumber += 1
      totalOrders += 1

      if (state === 'complete') {
        granules.forEach((granule) => {
          const { uri } = granule
          downloadUrls.push(uri)
          totalCompleteOrders += 1
        })

        totalProcessed += 1
      } else if (state === 'failed') {
        progressPercentage = 100
        if (error) {
          messages.push(error)
        } else if (reason) {
          messages.push(reason)
        }

        messageIsError = messageIsError || true
      }
    })

    progressPercentage = Math.floor((totalProcessed / totalNumber) * 100)
  }

  if (isEsi || isHarmony) {
    if (stateFromOrderStatus === 'creating') {
      progressPercentage = 0

      orderInfo = 'Your orders are pending processing. This may take some time.'
    }

    if (stateFromOrderStatus === 'in_progress') {
      orderInfo = 'Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.'
    }

    if (stateFromOrderStatus === 'complete') {
      orderInfo = 'Your orders are done processing and are available for download.'
    }

    if (stateFromOrderStatus === 'failed') {
      progressPercentage = 0
      orderInfo = 'The order has failed processing.'
    }

    if (stateFromOrderStatus === 'canceled') {
      progressPercentage = 0
      orderInfo = 'The order has been canceled.'
    }

    if (isEsi) {
      let totalNumber = 0
      let totalProcessed = 0

      if (orders.length) {
        const { order_information: orderInformation } = orders[0]
        const { contactInformation = {} } = orderInformation;
        ({ contactName, contactEmail } = contactInformation)
      }

      orders.forEach((order) => {
        const {
          error,
          order_information: orderInformation = {}
        } = order

        if (error) messages.push(error)

        const {
          downloadUrls: currentDownloadUrlsObject = {},
          processInfo = {},
          requestStatus = {}
        } = orderInformation

        // Display the message field from processInfo if it exists
        const { message } = processInfo

        // Wrap the message in an array, then flatten the array to ensure both string and array messages are the same
        // Only display the first message provided
        if (message) messages.push([message].flat()[0])

        const { downloadUrl: currentDownloadUrls = [] } = currentDownloadUrlsObject

        const {
          status: currentStatus,
          numberProcessed: currentNumberProcessed = 0,
          totalNumber: currentTotalNumber = 0
        } = requestStatus

        if (currentStatus === 'complete' || currentStatus === 'failed') {
          totalCompleteOrders += 1
        }

        // The XML Parser seems to add an extra, empty string to the end of download urls -- filter falsey data
        downloadUrls.push(...currentDownloadUrls.filter(Boolean))
        totalNumber += currentTotalNumber
        totalProcessed += currentNumberProcessed
        totalOrders += 1
      })

      const currentPercentProcessed = Math.floor((totalProcessed / totalNumber) * 100)

      if (currentPercentProcessed) {
        progressPercentage = Math.floor((totalProcessed / totalNumber) * 100)
      }
    }

    if (isHarmony) {
      let totalProgress = 0

      const harmonyCompletedSuccessfullyStates = ['successful', 'complete_with_errors']

      orders.forEach((order) => {
        const { order_information: orderInformation } = order

        const {
          progress = 0,
          links = [],
          status,
          message: harmonyMessage,
          jobId = false
        } = orderInformation

        if (harmonyCompletedSuccessfullyStates.includes(status) || status === 'failed' || status === 'canceled') {
          totalCompleteOrders += 1
        }

        if (harmonyCompletedSuccessfullyStates.includes(status) && !jobId) {
          messages.push(harmonyMessage)
        }

        if (status === 'failed' && harmonyMessage) {
          messages.push(harmonyMessage)
          messageIsError = messageIsError || true
        }

        if (status === 'canceled' && harmonyMessage) {
          messages.push(harmonyMessage)
        }

        downloadUrls.push(...links
          .filter(({ rel }) => rel === 'data')
          .map(({ href }) => href))

        if (status === 'failed') {
          // If the order failed, Harmony will tell us its something less
          // than 100% complete, overwrite that here to consider this order complete
          totalProgress += 100
        } else {
          totalProgress += progress
        }

        totalOrders += 1
      })

      const currentPercentProcessed = Math.floor((totalProgress / totalOrders) * 100)

      if (currentPercentProcessed) {
        progressPercentage = Math.floor((totalProgress / (totalOrders * 100)) * 100)
      }

      // Look at each order and pull the STAC catalog link
      if (orders.length) {
        stacLinks = orders.map((order) => {
          const { order_information: orderInformation = {} } = order
          const { links = [] } = orderInformation

          const stacLink = links.find(({ rel }) => rel === 'stac-catalog-json')

          if (stacLink) {
            const { href = '' } = stacLink

            return href
          }

          return false
        }).filter(Boolean)
      }

      // If all orders are complete, all STAC links have finished loading
      stacLinksIsLoading = orders.length !== totalCompleteOrders
    }
  }

  return {
    browseUrls,
    contactEmail,
    contactName,
    downloadUrls,
    messageIsError,
    messages,
    orderInfo,
    percentDoneDownloadLinks,
    progressPercentage,
    s3Urls,
    stacLinks,
    stacLinksIsLoading,
    totalCompleteOrders,
    totalOrders
  }
}

export default getOrderInfoAndProgress
