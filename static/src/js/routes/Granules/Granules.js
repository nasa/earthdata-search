import axios from 'axios'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import GranuleRequest from '../../util/request/granuleRequest'
// import CwicGranuleRequest from '../util/request/cwic'

const mapStateToProps = state => ({
  authToken: state.authToken,
  granuleDownloadParams: state.granuleDownloadParams
})

export class Granules extends Component {
  constructor(props) {
    super(props)

    this.state = {
      links: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      authToken
    } = this.props

    const { granuleDownloadParams } = nextProps
    const { retrievalId, collectionId } = granuleDownloadParams

    if (authToken && retrievalId && collectionId) {
      const requestObject = new GranuleRequest(authToken)

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
        const {
          granule_count: granuleCount,
          granule_params: granuleParams
        } = data

        let pageNum = 1
        const pageSize = 500
        const totalPages = Math.ceil(granuleCount / pageSize)

        do {
          requestObject.search({
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

              // Get the current links from the state
              const { links } = this.state

              // Append the new links
              this.setState({
                links: [
                  ...links,
                  ...granuleLinks.map(lnk => lnk.href)
                ]
              })
            })

          pageNum += 1
        }
        while (pageNum <= totalPages)
      })
    }
  }

  /**
   * Pull out download links from within the granule metadata
   * @param {Array} CMR search result for granules that a user has asked to download
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
    })
  }

  render() {
    const { links } = this.state

    return (
      <div className="route-wrapper route-wrapper--granules route-wrapper--light">
        <div className="route-wrapper__content">
          <header className="route-wrapper__header">
            Collection granule links have been retrieved
          </header>
          <Switch>
            <Route path="/granules/download">
              <ul>
                {
                  links.map((link, i) => {
                    const key = `link_${i}`
                    return (
                      <li key={key}>
                        <a href={link}>{link}</a>
                      </li>
                    )
                  })
                }
              </ul>
            </Route>
          </Switch>
        </div>
      </div>
    )
  }
}

Granules.propTypes = {
  authToken: PropTypes.string.isRequired,
  granuleDownloadParams: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(Granules)
)
