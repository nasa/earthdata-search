import React from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import { commafy } from '../../util/commafy'
import ADMIN_RETRIEVAL from '../../operations/queries/adminRetrieval'

import DefinitionList from '../DefinitionList/DefinitionList'
import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import './AdminRetrievalDetails.scss'

/**
 * Interface defining the structure of a retrieval order
 */
interface RetrievalOrder {
  /** Unique identifier for the retrieval order */
  id: string
    /** Additional order configuration and parameters */
    orderInformation: any
    /** Human-readable order number from the data provider */
    orderNumber: string
    /** Current processing state of the order */
    state: string
    /** Type of retrieval order */
    type: string
}

/**
 * Interface defining the structure of a retrieval collection
 * Contains collection metadata, order information, and tracking details
 */
interface RetrievalCollection {
  /** Unique identifier for the retrieval collection */
  id: string
  /** NASA CMR collection identifier */
  collectionId: string
  /** Metadata information about the collection */
  collectionMetadata: {
    /** Data provider/center responsible for the collection */
    dataCenter: string
  }
  /** Total number of granules in this collection */
  granuleCount: number
  /** Access method configuration for data retrieval */
  accessMethod: {
    /** Type of access method (e.g., 'download', 'opendap', 'esi') */
    type: string
  }
  /** ISO timestamp when the retrieval collection was created */
  createdAt: string
  /** ISO timestamp when the retrieval collection was last updated */
  updatedAt: string
  /** Array of individual retrieval orders for this collection */
  retrievalOrders: RetrievalOrder[]
}

/** An interface for the AdminRetrieval query response */
interface AdminRetrievalData {
  adminRetrieval: {
    retrievalCollections: RetrievalCollection[]
    jsondata: {
      portal_id?: string
      source: string
    }
    user: {
      ursId: string
    }
  }
}

/** The props for the AdminRetrievalDetails component */
interface AdminRetrievalDetailsProps {
  onRequeueOrder: (orderId: string) => void
}

/** AdminRetrievalDetails component */
const AdminRetrievalDetails = ({
  onRequeueOrder
}: AdminRetrievalDetailsProps) => {
  const { obfuscatedId } = useParams<{ obfuscatedId: string }>()

  const { data, error, loading } = useQuery<AdminRetrievalData>(gql(ADMIN_RETRIEVAL), {
    variables: {
      params: {
        obfuscatedId
      }
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
                            }: RetrievalCollection) => {

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
                                            <th style={{ width: "10%" }}>Actions</th>
                                            <th style={{ width: "7%" }}>ID</th>
                                            <th style={{ width: "20%" }}>Order Number</th>
                                            <th style={{ width: "20%" }}>Type</th>
                                            <th style={{ width: "10%" }}>State</th>
                                            <th style={{ width: "33%" }}>Details</th>
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
                                                          onRequeueOrder(orderId)
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

AdminRetrievalDetails.propTypes = {
  onRequeueOrder: PropTypes.func.isRequired
}

export default AdminRetrievalDetails

