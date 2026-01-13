import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'

import { useMutation, useQuery } from '@apollo/client'
// @ts-expect-error This file does not have types
import TimeAgo from 'react-timeago'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

// @ts-expect-error This file does not have types
import { XCircled } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'
// @ts-expect-error This file does not have types
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import HISTORY_RETRIEVALS from '../../operations/queries/historyRetrievals'
import DELETE_RETRIEVAL from '../../operations/mutations/deleteRetrieval'

// @ts-expect-error This file does not have types
import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { routes } from '../../constants/routes'
// @ts-expect-error This file does not have types
import { stringify } from '../../util/url/url'
// @ts-expect-error This file does not have types
import addToast from '../../util/addToast'

// Types
import { type HistoryRetrieval } from '../../types/sharedTypes'

// Hooks and store
import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

// Styles
import './DownloadHistory.scss'
import 'rc-pagination/assets/index.css'

interface HistoryRetrievalsQueryData {
  historyRetrievals: {
    /** Array of projects returned from the API */
    historyRetrievals: HistoryRetrieval[]
    /** Total count of projects matching the query */
    count: number
  }
}

export const DownloadHistory = () => {
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const handleError = useEdscStore((state) => state.errors.handleError)

  const pageSize = 20

  const {
    data,
    error,
    loading,
    refetch
  } = useQuery<HistoryRetrievalsQueryData>(HISTORY_RETRIEVALS, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }
  })

  useEffect(() => {
    if (error) {
      handleError({
        error,
        action: 'fetchHistoryRetrievals',
        resource: 'history retrievals',
        verb: 'fetching',
        notificationType: 'banner'
      })
    }
  }, [error])

  const { historyRetrievals } = data || {}
  const { historyRetrievals: historyRetrievalsList = [], count = 0 } = historyRetrievals || {}

  const [deleteRetrievalMutation] = useMutation(DELETE_RETRIEVAL)

  const handleDeleteRetrieval = (obfuscatedId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this download from your history? This action cannot be undone.')) {
      deleteRetrievalMutation({
        variables: {
          obfuscatedId
        },
        onCompleted: () => {
          addToast('Downloads removed', {
            appearance: 'success',
            autoDismiss: true
          })

          refetch()
        },
        onError: (mutationError) => {
          handleError({
            error: mutationError,
            action: 'handleDeleteRetrieval',
            resource: 'retrieval',
            verb: 'deleting',
            notificationType: 'banner'
          })
        }
      })
    }
  }

  const formatTitleDisplay = (titleList: string[]): string => {
    if (titleList.length === 1) return titleList[0]

    return `${titleList[0]} and ${titleList.length - 1} more`
  }

  return (
    <div className="download-history">
      <Helmet>
        <title>Download Status &amp; History</title>
        <meta name="title" content="Download Status &amp; History" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${earthdataEnvironment}${routes.DOWNLOADS}`} />
      </Helmet>
      <h2 className="route-wrapper__page-heading">
        Download Status & History
      </h2>
      {
        loading && (
          <Spinner
            className="download-history__spinner"
            type="dots"
            size="small"
          />
        )
      }
      {
        !loading && historyRetrievalsList.length > 0 && (
          <>
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
                  historyRetrievalsList.map((retrieval) => {
                    const {
                      id, createdAt, obfuscatedId, portalId, titles
                    } = retrieval

                    const titleDisplay = formatTitleDisplay(titles)

                    return (
                      <tr key={id}>
                        <td>
                          <PortalLinkContainer
                            portalId={portalId}
                            to={
                              {
                                pathname: `${routes.DOWNLOADS}/${obfuscatedId}`,
                                search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
                              }
                            }
                          >
                            {titleDisplay}
                          </PortalLinkContainer>
                        </td>
                        <td className="download-history-table__ago">
                          <TimeAgo date={createdAt} />
                        </td>
                        <td className="download-history-table__actions">
                          <Button
                            className="download-history__button download-history__button--remove"
                            onClick={() => handleDeleteRetrieval(obfuscatedId)}
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
            <div className="download-history__pagination-wrapper">
              <Pagination
                className="download-history__pagination"
                current={currentPage}
                total={count}
                pageSize={pageSize}
                onChange={setCurrentPage}
                locale={localeInfo}
              />
            </div>
          </>
        )
      }
      {
        !loading && count === 0 && (
          <p>No download history to display.</p>
        )
      }
    </div>
  )
}

export default DownloadHistory
