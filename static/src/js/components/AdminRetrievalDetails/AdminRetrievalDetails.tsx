import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import { commafy } from '../../util/commafy'
// @ts-expect-error This file does not have types
import addToast from '../../util/addToast'

import { DISPLAY_NOTIFICATION_TYPE } from '../../constants/displayNotificationType'

import ADMIN_RETRIEVAL from '../../operations/queries/adminRetrieval'
import ADMIN_REQUEUE_ORDER from '../../operations/mutations/adminRequeueOrder'

import DefinitionList from '../DefinitionList/DefinitionList'
import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import { type RetrievalCollection } from '../../types/sharedTypes'

import useEdscStore from '../../zustand/useEdscStore'

import './AdminRetrievalDetails.scss'

/**
 * Interface defining the structure of the AdminRetrieval GraphQL query response
 * Contains all data needed to display administrative details for a specific retrieval
 */
interface AdminRetrievalQueryData {
  /** Root object containing all administrative retrieval information */
  adminRetrieval: {
    /** Array of collections associated with this retrieval request */
    retrievalCollections: RetrievalCollection[]
    /** JSON metadata associated with the retrieval request */
    jsondata: {
      /** Optional portal identifier if the retrieval was initiated from a specific portal */
      portal_id?: string
      /** Source URL path or identifier indicating where the retrieval request originated */
      source: string
    }
    /** Information about the user who initiated the retrieval */
    user: {
      /** Earthdata Login URS id */
      ursId: string
    }
  }
}

/** AdminRetrievalDetails component */
const AdminRetrievalDetails = () => {
  const { obfuscatedId } = useParams<{ obfuscatedId: string }>()
  const handleError = useEdscStore((state) => state.errors.handleError)

  const { data, error, loading } = useQuery<AdminRetrievalQueryData>(ADMIN_RETRIEVAL, {
    variables: {
      params: {
        obfuscatedId
      }
    }
  })

  const [requeueOrder] = useMutation(ADMIN_REQUEUE_ORDER, {
    onCompleted: () => {
      addToast('Order Requeued for processing', {
        appearance: 'success',
        autoDismiss: true
      })
    },
    onError: (mutationError) => {
      handleError({
        error: mutationError,
        action: 'requeueOrder',
        resource: 'admin retrievals',
        notificationType: DISPLAY_NOTIFICATION_TYPE.TOAST
      })
    }
  })

  if (loading || !data) {
    return (
      <Row>
        <Col xs="auto" className="mx-auto m-5">
          <Spinner
            dataTestId="admin-preferences-metric-list-spinner"
            className="position-absolute admin-preferences-metrics-list__spinner"
            type="dots"
          />
        </Col>
      </Row>
    )
  }

  const { adminRetrieval } = data
  const {
    retrievalCollections,
    jsondata,
    user
  } = adminRetrieval

  const { ursId } = user

  const {
    portal_id: portalId,
    source
  } = jsondata

  let portalPath = ''

  if (portalId) {
    portalPath = `/portal/${portalId}`
  }

  const sourcePath = `${portalPath}/search${source}`

  return (
    <div className="admin-retrieval-details">
      {
        !error && (
          <Row>
            <DefinitionList
              items={
                [
                  [
                    {
                      label: 'Owner',
                      value: ursId
                    },
                    {
                      label: 'Obfuscated ID',
                      value: obfuscatedId
                    }
                  ],
                  [
                    {
                      label: 'Source Path',
                      value: <a className="text-wrap text-break" href={sourcePath} target="_blank" rel="noopener noreferrer">{sourcePath}</a>
                    }
                  ],
                  [{
                    label: 'Retrieval Collections',
                    value: retrievalCollections.length > 0 && (
                      <section className="mt-2">
                        {
                          retrievalCollections.map(({
                            id,
                            collectionId,
                            collectionMetadata,
                            granuleCount,
                            accessMethod,
                            createdAt,
                            updatedAt,
                            retrievalOrders
                          }) => {
                            const { dataCenter } = collectionMetadata

                            return (
                              <article className="border rounded mt-3" key={id}>
                                <header className="p-3">
                                  <h3 className="h4 mb-4">{collectionId}</h3>
                                  <DefinitionList
                                    items={
                                      [
                                        [
                                          {
                                            label: 'ID',
                                            value: id
                                          },
                                          {
                                            label: 'Type',
                                            value: accessMethod.type
                                          },
                                          {
                                            label: 'Data Provider',
                                            value: dataCenter
                                          },
                                          {
                                            label: 'Order Count',
                                            value: retrievalOrders.length
                                          },
                                          {
                                            label: 'Granule Count',
                                            value: commafy(granuleCount)
                                          }
                                        ],
                                        [
                                          {
                                            label: 'Created',
                                            value: createdAt
                                          },
                                          {
                                            label: 'Updated',
                                            value: updatedAt
                                          }
                                        ]
                                      ]
                                    }
                                  />
                                </header>

                                {
                                  retrievalOrders.length > 0 && (
                                    <>
                                      <Alert variant="warning">
                                        Clicking Requeue could generate duplicate orders,
                                        sending duplicated data to the user. Use with Caution
                                      </Alert>
                                      <Table className="admin-retrieval-details__orders-table mb-0" striped variant="light">
                                        <thead>
                                          <tr>
                                            <th style={{ width: '10%' }}>Actions</th>
                                            <th style={{ width: '7%' }}>ID</th>
                                            <th style={{ width: '20%' }}>Order Number</th>
                                            <th style={{ width: '20%' }}>Type</th>
                                            <th style={{ width: '10%' }}>State</th>
                                            <th style={{ width: '33%' }}>Details</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {
                                            retrievalOrders.map((order) => {
                                              const {
                                                id: orderId,
                                                orderInformation,
                                                orderNumber,
                                                state,
                                                type
                                              } = order

                                              return (
                                                <tr className="align-middle" key={`${collectionId}-${orderId}`}>
                                                  <td>
                                                    <Button
                                                      type="button"
                                                      bootstrapVariant="primary"
                                                      label="Requeue Order for Processing"
                                                      bootstrapSize="sm"
                                                      onClick={
                                                        () => {
                                                          requeueOrder({
                                                            variables: {
                                                              retrievalOrderId: orderId
                                                            }
                                                          })
                                                        }
                                                      }
                                                    >
                                                      Requeue
                                                    </Button>
                                                  </td>
                                                  <td>{orderId}</td>
                                                  <td>{orderNumber}</td>
                                                  <td>{type}</td>
                                                  <td>{state}</td>
                                                  <td className="align-middle">
                                                    <pre className="fs-5 mb-0 align-middle pre-scrollable">
                                                      {JSON.stringify(orderInformation)}
                                                    </pre>
                                                  </td>
                                                </tr>
                                              )
                                            })
                                          }
                                        </tbody>
                                      </Table>
                                    </>

                                  )
                                }
                              </article>
                            )
                          })
                        }
                      </section>
                    )
                  }]
                ]
              }
            />
          </Row>
        )
      }
    </div>
  )
}

export default AdminRetrievalDetails
