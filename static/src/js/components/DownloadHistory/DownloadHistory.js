import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'
import TimeAgo from 'react-timeago'
import { FaTimesCircle } from 'react-icons/fa'

import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { pluralize } from '../../util/pluralize'
import { stringify } from '../../util/url/url'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './DownloadHistory.scss'

export class DownloadHistory extends Component {
  constructor() {
    super()

    this.onHandleRemove = this.onHandleRemove.bind(this)
  }

  onHandleRemove(id) {
    const { onDeleteRetrieval } = this.props

    // eslint-disable-next-line no-alert
    const confirmDeletion = window.confirm('Are you sure you want to remove this download from your history? This action cannot be undone.')

    if (confirmDeletion) {
      onDeleteRetrieval(id)
    }
  }

  /**
   * Return a concise description of the retrieval for display in the UI
   * @param {Array} collections Array of collection metadata belonging to collections ordered as part of a retrieval
   */
  retrievalDescription(collections) {
    // Get the first collection with a valid title
    const firstCollection = collections.find((collection) => (Object.values(collection) && 'title' in collection))

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
    const {
      earthdataEnvironment,
      retrievalHistory,
      retrievalHistoryLoading,
      retrievalHistoryLoaded
    } = this.props

    return (
      <>
        <h2 className="route-wrapper__page-heading">Download Status & History</h2>
        {
          (retrievalHistoryLoading && !retrievalHistoryLoaded) && (
            <Spinner
              className="download-history__spinner"
              type="dots"
              color="white"
              size="small"
            />
          )
        }
        {
          retrievalHistoryLoaded && (
            retrievalHistory.length > 0 ? (
              <Table className="download-history-table">
                <thead>
                  <tr>
                    <th className="download-history-table__contents-heading">Contents</th>
                    <th className="download-history-table__created-heading">Created</th>
                    <th className="download-history-table__actions-heading">Actions</th>
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
                              to={{
                                pathname: `/downloads/${id}`,
                                search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
                              }}
                            >
                              {this.retrievalDescription(collections)}
                            </PortalLinkContainer>
                          </td>
                          <td className="download-history-table__ago">
                            <TimeAgo date={createdAt} />
                          </td>
                          <td className="download-history-table__actions">
                            <Button
                              className="download-history__button download-history__button--remove"
                              onClick={() => this.onHandleRemove(id)}
                              variant="naked"
                              icon={FaTimesCircle}
                              label="Delete Download"
                            />
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
  earthdataEnvironment: PropTypes.string.isRequired,
  retrievalHistory: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  retrievalHistoryLoading: PropTypes.bool.isRequired,
  retrievalHistoryLoaded: PropTypes.bool.isRequired,
  onDeleteRetrieval: PropTypes.func.isRequired
}

export default DownloadHistory
