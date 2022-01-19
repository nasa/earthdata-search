import React from 'react'
import PropTypes from 'prop-types'

import { Badge, Card } from 'react-bootstrap'

import './CollectionDetailsDataCenter.scss'

export const CollectionDetailsDataCenter = ({ dataCenter, item }) => (
  <Card
    as="li"
    bg="light"
    className="collection-details-data-center"
    data-test-id={`collection-details-data-center-${item}`}
  >
    <Card.Body>
      {
        dataCenter.shortname && (
          <h5
            className="collection-details-data-center__title"
            data-test-id="collection-details-data-center__title"
          >
            {dataCenter.shortname}
          </h5>
        )
      }
      {
        dataCenter.roles && (
          dataCenter.roles.map((role, i) => {
            const key = `data_center_role_${item}-${i}`
            return (
              <Badge
                key={key}
                variant="primary"
                className="collection-details-data-center__badge"
                data-test-id="collection-details-data-center__role"
              >
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
                <p
                  className="collection-details-data-center__description"
                  data-test-id="collection-details-data-center__description"
                >
                  {dataCenter.contactInstruction}
                </p>
              )
            }
            {
              dataCenter.contactInformation.contactMechanisms && (
                dataCenter.contactInformation.contactMechanisms.map((contact, i) => {
                  const key = `data_center_email_${item}-${i}`
                  if (contact.type === 'Email') {
                    return (
                      <p
                        key={key}
                        className="collection-details-data-center__email"
                        data-test-id="collection-details-data-center__email"
                      >
                        <a href={`mailto:${contact.value}`}>
                          {contact.value}
                        </a>
                      </p>
                    )
                  }
                  return null
                })
              )
            }
            {
              dataCenter.contactInformation.contactMechanisms && (
                <dl className="collection-details-data-center__contact">
                  {
                    dataCenter.contactInformation.contactMechanisms.map((contact, i) => {
                      const key = `data_center_other_${item}-${i}`
                      if (contact.type === 'Facebook') {
                        return (
                          <React.Fragment key={key}>
                            <dt>{`${contact.type}:`}</dt>
                            <dd>
                              <a href={contact.value} title={contact.value}>
                                Profile Link
                              </a>
                            </dd>
                          </React.Fragment>
                        )
                      }
                      if (contact.type !== 'Email' && contact.type !== 'Facebook') {
                        return (
                          <React.Fragment key={key}>
                            <dt>{`${contact.type}:`}</dt>
                            <dd data-test-id={`collection-details-data-center__${contact.type.toLowerCase()}`}>
                              {contact.value}
                            </dd>
                          </React.Fragment>
                        )
                      }
                      return null
                    })
                  }
                </dl>
              )
            }
          </>
        )
      }
      {
        !dataCenter.contactInformation && <p data-test-id="collection-details-data-center__no-contact-info">No contact information for this data center.</p>
      }
    </Card.Body>
  </Card>
)

CollectionDetailsDataCenter.propTypes = {
  dataCenter: PropTypes.shape({
    shortname: PropTypes.string,
    contactInformation: PropTypes.shape({
      contactMechanisms: PropTypes.arrayOf(
        PropTypes.shape({})
      )
    }),
    contactInstruction: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  item: PropTypes.number.isRequired
}

export default CollectionDetailsDataCenter
