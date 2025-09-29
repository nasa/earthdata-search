import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaBell } from 'react-icons/fa'
import { Close } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { AlertHighPriority } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'

import Button from '../Button/Button'

import './Banner.scss'

export const Banner = ({
  message = null,
  onClose,
  showAlertButton = false,
  title,
  type
}) => {
  const bannerClassNames = classNames([
    'banner',
    {
      'banner--error': type === 'error'
    }
  ])

  const handleAlertsClick = () => {
    const openAlerts = () => {
      const alertsButton = document.querySelector('.th-status-link')

      if (alertsButton) {
        // Simulate clicking the alerts dropdown in tophat
        alertsButton.click()
      }
    }

    // 0ms timeout is required to open the alerts dropdown properly
    setTimeout(() => openAlerts(), 0)
  }

  let messageToDisplay = message

  // If we are showing the 'Show Alert' button, we also want to override the error message
  if (showAlertButton) {
    messageToDisplay = 'Check alerts for outage information or refresh the page.'
  }

  return (
    <div className={bannerClassNames} role="banner">
      <div className="banner__content">
        <h2 className="banner__title">
          <AlertHighPriority className="banner__icon icon" aria-label="High Alert Icon" size="22" />
          {title}
        </h2>
        {
          messageToDisplay && (
            <>
              {' '}
              <p className="banner__message">{messageToDisplay}</p>
            </>
          )
        }
        {
          showAlertButton && (
            <>
              {' '}
              <div className="banner__alert-content">
                <div className="banner__see-alerts">
                  <Button
                    onClick={handleAlertsClick}
                    icon={FaBell}
                    iconPosition="right"
                    bootstrapVariant="red"
                    bootstrapSize="sm"
                  >
                    See Alerts
                  </Button>
                </div>
              </div>
            </>
          )
        }
      </div>
      <Button
        className="banner__close"
        label="Close"
        onClick={onClose}
        icon={Close}
      />
    </div>
  )
}

Banner.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  showAlertButton: PropTypes.bool
}

export default Banner
