import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'
import TimeAgo from 'react-timeago'

import { PortalLinkContainer } from '../../containers/PortalLinkContainer/PortalLinkContainer'
import pluralize from '../../util/pluralize'

import './DownloadHistory.scss'

export class DownloadHistory extends Component {
  /**
   * Return a concise description of the retrieval for display in the UI
   * @param {Array} collections Array of collection metadata belonging to collections ordered as part of a retrieval
   */
  retrievalDescription(collections) {
    // Get the first collection with a valid title
    const firstCollection = collections.find(collection => (Object.values(collection) && 'title' in collection))

    // If no collection exists with a valid title we'll just display how many collections there are
    if (firstCollection) {
      const { title } = firstCollection

      // When only one collection exists we can just display the title
      if (collections.length === 1) {
        return title
      }

      // If more than one collection exists show the title of the first
      return `${title} and ${collections.length - 1} other ${pluralize('collection', collections.length - 1)}`
    }

    // No collection title exists so we'll just display how many collections were downloaded
    return `${collections.length} ${pluralize('collection', collections.length)}`
  }

  render() {
    const { retrievalHistory } = this.props

    return (
      <>
        <h2 className="route-wrapper__page-heading">Download Status & History</h2>
        {
          retrievalHistory.length > 0 ? (
            <Table className="order-status-table" striped variant="dark">
              <thead>
                <tr>
                  <th>Contents</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {
                  retrievalHistory.map((retrieval) => {
                    const {
                      id,
                      created_at: createdAt,
                      jsondata,
                      collections
                    } = retrieval

                    const { portal_id: portalId } = jsondata

                    return (
                      <tr key={id}>
                        <td>
                          <PortalLinkContainer
                            portalId={portalId}
                            to={`/downloads/${id}`}
                          >
                            {this.retrievalDescription(collections)}
                          </PortalLinkContainer>
                        </td>
                        <td className="order-status-table__ago">
                          <TimeAgo date={createdAt} />
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          ) : (
            <p>No download history to display.</p>
          )
        }
      </>
    )
  }
}

DownloadHistory.defaultProps = {
  retrievalHistory: []
}

DownloadHistory.propTypes = {
  retrievalHistory: PropTypes.arrayOf(
    PropTypes.shape({})
  )
}

export default DownloadHistory
