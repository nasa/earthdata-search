import React from 'react'
import PropTypes from 'prop-types'
import { FaBell } from 'react-icons/fa'

import Button from '../Button/Button'

import './FailedToLoadCollectionsMessage.scss'

const FailedToLoadCollectionsMessage = ({ onAlertsClick }) => (
  <div className="failed-to-load-collections">
    <span className="failed-to-load-collections__message-text">
      Check alerts for outage information or refresh the page.
    </span>
    <div className="failed-to-load-collections__see-alerts">
      <Button
        onClick={onAlertsClick}
        icon={FaBell}
        iconPosition="right"
        bootstrapVariant="red"
        bootstrapSize="sm"
      >
        See Alerts
      </Button>
    </div>
  </div>
)

FailedToLoadCollectionsMessage.propTypes = {
  onAlertsClick: PropTypes.func.isRequired
}

export default FailedToLoadCollectionsMessage
