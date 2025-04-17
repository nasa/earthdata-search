import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Close } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { AlertHighPriority } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'

import Button from '../Button/Button'

import './Banner.scss'

export const Banner = ({
  message,
  title,
  type,
  onClose
}) => {
  const bannerClassNames = classNames([
    'banner',
    {
      'banner--error': type === 'error'
    }
  ])

  return (
    <div className={bannerClassNames} role="banner">
      <div className="banner__content">
        <h2 className="banner__title">
          <AlertHighPriority className="banner__icon icon" aria-label="High Alert Icon" size="22" />
          {title}
        </h2>
        {
          message && (
            <>
              {' '}
              <p className="banner__message">{message}</p>
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

Banner.defaultProps = {
  message: null
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
  onClose: PropTypes.func.isRequired
}

export default Banner
