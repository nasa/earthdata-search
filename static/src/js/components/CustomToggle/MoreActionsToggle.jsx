import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaEllipsisV } from 'react-icons/fa'

import CustomToggle from './CustomToggle'

import './MoreActionsToggle.scss'

export const MoreActionsToggle = React.forwardRef(({
  className,
  onClick
}, ref) => {
  const moreActionsToggleClassNames = classNames(
    className,
    'more-actions-toggle'
  )

  return (
    <CustomToggle
      className={moreActionsToggleClassNames}
      onClick={onClick}
      ref={ref}
      title="More actions"
      icon={FaEllipsisV}
    />
  )
})

MoreActionsToggle.displayName = 'MoreActionsToggle'

MoreActionsToggle.defaultProps = {
  className: null
}

MoreActionsToggle.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default MoreActionsToggle
