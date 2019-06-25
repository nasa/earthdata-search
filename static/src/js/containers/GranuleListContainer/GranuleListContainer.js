import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import GranuleRequest from '../../util/request/granuleRequest'

import GranuleList from '../../components/GranuleList/GranuleList'

const mapStateToProps = state => ({
  authToken: state.authToken,
  granuleDownloadParams: state.granuleDownloadParams
})

export class GranuleListContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      links: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authToken, granuleDownloadParams } = nextProps
    const { retrievalId, collectionId } = granuleDownloadParams

    const { granuleDownloadParams: currentGranuleDownloadParams } = this.props
    const {
      retrievalId: currentRetrievalId,
      collectionId: currentCollectionId
    } = currentGranuleDownloadParams

    if (authToken && retrievalId !== currentRetrievalId && collectionId !== currentCollectionId) {
      const { apiHost } = getEarthdataConfig('prod')

      // Fetch the retrieval collection data so we know what
      // granule parameters were provided in the order
      axios({
        method: 'get',
        baseURL: apiHost,
        url: `retrievals/${retrievalId}/collections/${collectionId}`,
        headers: {
          Authorization: `Bearer: ${authToken}`
        }
      }).then((response) => {
        // Use the stored granule parameters to retrieve the granules
        // from CMR to extract the urls from
        const { data } = response

        this.fetchLinks(retrievalId, collectionId, data, authToken)
      })
    }
  }

  /**
 * Pull out download links from within the granule metadata
 * @param {Array} granules search result for granules that a user has asked to download
 */
  getDownloadUrls(granules) {
    // Iterate through each granule search result to pull out relevant links
    return granules.map((granuleMetadata) => {
      const { links: linkMetadata = [] } = granuleMetadata

      // Find the correct link from the list within the metadata
      return linkMetadata.find((link) => {
        const { inherited, rel } = link
        return rel.includes('/data#') && !inherited
      })
    }).filter(Boolean)
  }

  fetchLinks(retrievalId, collectionId, retrievalCollectionData, authToken) {
    const requestObject = new GranuleRequest(authToken)

    const {
      granule_count: granuleCount,
      granule_params: granuleParams
    } = retrievalCollectionData

    let pageNum = 1
    const pageSize = 500
    const totalPages = Math.ceil(granuleCount / pageSize)

    const granuleRequests = []
    do {
      const granulePageRequest = requestObject.search({
        pageSize,
        pageNum,
        echoCollectionId: collectionId,
        ...granuleParams
      })
        .then((response) => {
          const { data } = response
          const { feed } = data
          const { entry } = feed

          // Fetch the download links from the granule metadata
          const granuleLinks = this.getDownloadUrls(entry)

          if (granuleLinks) {
            // Get the current links from the state
            const { links } = this.state

            // Append the new links
            this.setState({
              links: [
                ...links,
                ...granuleLinks.map(lnk => lnk.href)
              ]
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })

      granuleRequests.push(granulePageRequest)

      pageNum += 1
    }
    while (pageNum <= totalPages)

    axios.all(granuleRequests)
  }

  render() {
    const { links } = this.state

    return (
      <GranuleList
        links={links}
      />
    )
  }
}

GranuleListContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  granuleDownloadParams: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, null)(GranuleListContainer)
