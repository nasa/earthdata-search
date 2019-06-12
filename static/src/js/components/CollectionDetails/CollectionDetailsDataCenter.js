import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Card } from 'react-bootstrap'

import './CollectionDetailsDataCenter.scss'

export const CollectionDetailsDataCenter = ({ dataCenter, item }) => (
  <Card
    as="li"
    bg="light"
    className="collection-details-data-center"
  >
    <Card.Body>
      {
        dataCenter.shortname && (
          <h5 className="collection-details-data-center__title">
            {dataCenter.shortname}
          </h5>
        )
      }
      {
        dataCenter.roles && (
          dataCenter.roles.map((role, i) => {
            const key = `data_center_role_${item}-${i}`
            return (
              <Badge key={key} variant="primary" className="collection-details-data-center__badge">
                {role}
              </Badge>
            )
          })
        )
      }
      {
        dataCenter.contactInformation && (
          <>
            {
              dataCenter.contactInstruction && (
                <p className="collection-details-data-center__description">
                  {dataCenter.contactInstruction}
                </p>
              )
            }
            {
              dataCenter.contactInformation.ContactMechanisms.map((contact, i) => {
                const key = `data_center_email_${item}-${i}`
                if (contact.Type === 'Email') {
                  return (
                    <p key={key} className="collection-details-data-center__email">
                      <a href={`mailto:${contact.Value}`}>
                        {contact.Value}
                      </a>
                    </p>
                  )
                }
                return null
              })
            }
            <dl className="collection-details-data-center__contact">
              {
                dataCenter.contactInformation.ContactMechanisms.map((contact, i) => {
                  const key = `data_center_other_${item}-${i}`
                  if (contact.Type === 'Facebook') {
                    return (
                      <React.Fragment key={key}>
                        <dt>{`${contact.Type}:`}</dt>
                        <dd>
                          <a href={contact.Value} title={contact.Value}>
                            Profile Link
                          </a>
                        </dd>
                      </React.Fragment>
                    )
                  }
                  if (contact.Type !== 'Email' && contact.Type !== 'Facebook') {
                    return (
                      <React.Fragment key={key}>
                        <dt>{`${contact.Type}:`}</dt>
                        <dd>
                          {contact.Value}
                        </dd>
                      </React.Fragment>
                    )
                  }
                  return null
                })
              }
            </dl>
          </>
        )
      }
      {
        !dataCenter.contactInformation && <p>No contact information for this data center.</p>
      }
    </Card.Body>
  </Card>
)

CollectionDetailsDataCenter.propTypes = {
  dataCenter: PropTypes.shape({}).isRequired,
  item: PropTypes.number.isRequired
}

export default CollectionDetailsDataCenter
