import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'
import TimeAgo from 'react-timeago'
import { XCircled } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { pluralize } from '../../util/pluralize'
import { stringify } from '../../util/url/url'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './DownloadHistory.scss'

/**
 * Return a concise description of the retrieval for display in the UI
 * @param {Array} collections Array of collection metadata belonging to collections ordered as part of a retrieval
 */
const retrievalDescription = (collections) => {
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

export const DownloadHistory = ({
  earthdataEnvironment,
  retrievalHistory,
  retrievalHistoryLoading,
  retrievalHistoryLoaded,
  onDeleteRetrieval
}) => {
  const { edscHost } = getEnvironmentConfig()

  // Memoize the descriptions for all items in the history
  const retrievalDescriptions = useMemo(() => retrievalHistory.reduce((acc, retrieval) => {
    acc[retrieval.id] = retrievalDescription(retrieval.collections)

    return acc
  }, {}), [retrievalHistory])

  return (
    <>
      <Helmet>
        <title>Download Status &amp; History</title>
        <meta name="title" content="Download Status &amp; History" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}/downloads`} />
      </Helmet>
      <h2 className="route-wrapper__page-heading">Download Status & History</h2>
      {
        (retrievalHistoryLoading && !retrievalHistoryLoaded) && (
          <Spinner
            className="download-history__spinner"
            type="dots"
            size="small"
            role="status"
          />
        )
      }
      {
        retrievalHistoryLoaded && retrievalHistory.length > 0 && (
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
                    jsondata
                  } = retrieval

                  const { portal_id: portalId } = jsondata

                  return (
                    <tr key={id}>
                      <td>
                        <PortalLinkContainer
                          portalId={portalId}
                          to={
                            {
                              pathname: `/downloads/${id}`,
                              search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
                            }
                          }
                        >
                          {retrievalDescriptions[id]}
                        </PortalLinkContainer>
                      </td>
                      <td className="download-history-table__ago">
                        <TimeAgo date={createdAt} />
                      </td>
                      <td className="download-history-table__actions">
                        <Button
                          className="download-history__button download-history__button--remove"
                          onClick={() => onDeleteRetrieval(id)}
                          variant="naked"
                          icon={XCircled}
                          label="Delete Download"
                        />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        )
      }
      {
        retrievalHistoryLoaded && retrievalHistory.length === 0 && (
          <p>No download history to display.</p>
        )
      }
    </>
  )
}

DownloadHistory.defaultProps = {
  retrievalHistory: []
}

DownloadHistory.propTypes = {
  earthdataEnvironment: PropTypes.string.isRequired,
  retrievalHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      jsondata: PropTypes.shape({
        portal_id: PropTypes.string
      }).isRequired,
      collections: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string
        })
      ).isRequired
    })
  ),
  retrievalHistoryLoading: PropTypes.bool.isRequired,
  retrievalHistoryLoaded: PropTypes.bool.isRequired,
  onDeleteRetrieval: PropTypes.func.isRequired
}
