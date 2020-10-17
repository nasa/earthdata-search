import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaEllipsisV } from 'react-icons/fa'

import CustomToggle from './CustomToggle'

import './MoreActionsToggle.scss'

// Need to use a Class component here so this works with the refs passed from
// the parent react-bootstrap component
// eslint-disable-next-line react/prefer-stateless-function
export class ToggleMoreActions extends Component {
  render() {
    const {
      className,
      onClick
    } = this.props

    const moreActionsToggleClassNames = classNames(
      className,
      'more-actions-toggle'
    )

    return (
      <CustomToggle
        className={moreActionsToggleClassNames}
        onClick={onClick}
        title="More actions"
        icon={FaEllipsisV}
      />
    )
  }
}

ToggleMoreActions.defaultProps = {
  className: null
}

ToggleMoreActions.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default ToggleMoreActions
