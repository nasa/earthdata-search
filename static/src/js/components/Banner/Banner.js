import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaTimesCircle } from 'react-icons/fa'

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
    <div className={bannerClassNames}>
      <div className="banner__content">
        <h2 className="banner__title">{title}</h2>
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
        label="close"
        onClick={onClose}
        icon={FaTimesCircle}
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
