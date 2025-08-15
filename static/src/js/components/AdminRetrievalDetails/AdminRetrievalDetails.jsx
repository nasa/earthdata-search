import React from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery } from '@apollo/client'

import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import { commafy } from '../../util/commafy'
import ADMIN_RETRIEVAL from '../../operations/queries/adminRetrieval'

import Button from '../Button/Button'

import './AdminRetrievalDetails.scss'

export const AdminRetrievalDetails = ({
  obfuscatedId,
  onRequeueOrder
}) => {
  const { data, error, loading } = useQuery(gql(ADMIN_RETRIEVAL), {
    variables: {
      params: {
        obfuscatedId
      }
    }
  })

  const { adminRetrieval = {} } = data || {}
  const {
    retrievalCollections = [],
    jsondata = {},
    user = {}
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
        !loading && !error && (
          <Row>
            <Col sm="auto">
              <Row className="admin-retrieval-details__metadata-display mb-2">
                <Col className="admin-retrieval-details__metadata-display-item">
                  <span className="admin-retrieval-details__metadata-display-heading">Owner</span>
                  <span className="admin-retrieval-details__metadata-display-content">{ursId}</span>
                </Col>
                <Col className="admin-retrieval-details__metadata-display-item">
                  <span className="admin-retrieval-details__metadata-display-heading">Obfuscated ID</span>
                  <span className="admin-retrieval-details__metadata-display-content">{obfuscatedId}</span>
                </Col>
              </Row>
              <Row className="admin-retrieval-details__metadata-display mb-2">
                <Col className="admin-retrieval-details__metadata-display-item">
                  <span className="admin-retrieval-details__metadata-display-heading">Source Path</span>
                  <a className="admin-retrieval-details__metadata-display-content" href={sourcePath} target="_blank" rel="noopener noreferrer">
                    {sourcePath}
                  </a>
                </Col>
              </Row>
            </Col>
            <Col sm="auto">
              {
                retrievalCollections.length > 0 && (
                  <section className="admin-retrieval-details__collections">
                    {
                      retrievalCollections.map((collection) => {
                        const {
                          id,
                          collectionId,
                          collectionMetadata,
                          granuleCount,
                          accessMethod,
                          createdAt,
                          updatedAt,
                          retrievalOrders
                        } = collection

                        const { dataCenter } = collectionMetadata

                        return (
                          <article className="admin-retrieval-details__collection" key={id}>
                            <header className="admin-retrieval-details__collection-header">
                              <span className="admin-retrieval-details__metadata-display-heading">Concept ID</span>
                              <h3 className="admin-retrieval-details__collection-heading">{collectionId}</h3>
                              <div className="admin-retrieval-details__collection-heading-details">
                                <div className="admin-retrieval-details__metadata-display">
                                  <dl className="admin-retrieval-details__metadata-display-item">
                                    <dt id="retrieval_info__retrieval-collection-id" className="admin-retrieval-details__metadata-display-heading">Retrieval Collection ID</dt>
                                    <dd aria-labelledby="retrieval_info__retrieval-collection-id" className="admin-retrieval-details__metadata-display-content">{collectionId}</dd>
                                  </dl>
                                  <dl className="admin-retrieval-details__metadata-display-item">
                                    <dt id="retrieval_info__type" className="admin-retrieval-details__metadata-display-heading">Type</dt>
                                    <dd aria-labelledby="retrieval_info__type" className="admin-retrieval-details__metadata-display-content">{accessMethod.type}</dd>
                                  </dl>
                                  <dl className="admin-retrieval-details__metadata-display-item">
                                    <dt id="retrieval_info__data-provider" className="admin-retrieval-details__metadata-display-heading">Data Provider</dt>
                                    <dd aria-labelledby="retrieval_info__data-provider" className="admin-retrieval-details__metadata-display-content">{dataCenter}</dd>
                                  </dl>
                                  <dl className="admin-retrieval-details__metadata-display-item">
                                    <dt id="retrieval_info__order-count" className="admin-retrieval-details__metadata-display-heading">Order Count</dt>
                                    <dd aria-labelledby="retrieval_info__order-count" className="admin-retrieval-details__metadata-display-content">{retrievalOrders.length}</dd>
                                  </dl>
                                  <dl className="admin-retrieval-details__metadata-display-item">
                                    <dt id="retrieval_info__granule-count" className="admin-retrieval-details__metadata-display-heading">Granule Count</dt>
                                    <dd aria-labelledby="retrieval_info__granule-count" className="admin-retrieval-details__metadata-display-content">{commafy(granuleCount)}</dd>
                                  </dl>
                                </div>
                              </div>
                              <div className="admin-retrieval-details__collection-heading-details">
                                <div className="admin-retrieval-details__metadata-display">
                                  <dl className="admin-retrieval-details__metadata-display-item">
                                    <dt id="retrieval_info__created-at" className="admin-retrieval-details__metadata-display-heading">Created</dt>
                                    <dd aria-labelledby="retrieval_info__created-at" className="admin-retrieval-details__metadata-display-content">{createdAt}</dd>
                                  </dl>
                                  <dl className="admin-retrieval-details__metadata-display-item">
                                    <dt id="retrieval_info__updated-at" className="admin-retrieval-details__metadata-display-heading">Updated</dt>
                                    <dd aria-labelledby="retrieval_info__updated-at" className="admin-retrieval-details__metadata-display-content">{updatedAt}</dd>
                                  </dl>
                                </div>
                              </div>
                            </header>

                            <Alert variant="warning">
                              Clicking Requeue could generate duplicate orders,
                              sending duplicated data to the user. Use with Caution
                            </Alert>

                            {
                              retrievalOrders.length > 0 && (
                                <Table className="admin-retrieval-details__orders-table" striped variant="light">
                                  <thead>
                                    <tr>
                                      <th width="10%">Actions</th>
                                      <th width="7%">ID</th>
                                      <th width="20%">Order Number</th>
                                      <th width="20%">Type</th>
                                      <th width="10%">State</th>
                                      <th width="33%">Details</th>
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
                                          <tr className="admin-retrieval-details__order-row" key={`${collectionId}-${orderId}`}>
                                            <td>
                                              <Button
                                                type="button"
                                                bootstrapVariant="secondary"
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
                                            <td className="admin-retrieval-details__order-details">
                                              <pre className="admin-retrieval-details__order-details-pre pre-scrollable">
                                                {JSON.stringify(orderInformation)}
                                              </pre>
                                            </td>
                                          </tr>
                                        )
                                      })
                                    }
                                  </tbody>
                                </Table>
                              )
                            }
                          </article>
                        )
                      })
                    }
                  </section>
                )
              }
            </Col>
          </Row>
        )
      }
    </div>
  )
}

AdminRetrievalDetails.propTypes = {
  obfuscatedId: PropTypes.string.isRequired,
  onRequeueOrder: PropTypes.func.isRequired
}

export default AdminRetrievalDetails
