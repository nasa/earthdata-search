import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import WellFooter from './WellFooter'
import WellHeading from './WellHeading'
import WellIntroduction from './WellIntroduction'
import WellMain from './WellMain'
import WellSection from './WellSection'

import './Well.scss'

export const Well = ({
  className,
  children,
  heading,
  introduction
}) => {
  const classes = classNames([
    'well',
    className ? `well--${className}` : null,
    className
  ])
  return (
    <div className={classes}>
      <h2 className="well__heading">{heading}</h2>
      <div className="well__intro">{introduction}</div>
      <div className="well__content">
        {children}
      </div>
    </div>
  )
}

Well.defaultProps = {
  children: null,
  className: null,
  heading: null,
  introduction: null
}

Well.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  heading: PropTypes.node,
  introduction: PropTypes.node
}

Well.Footer = WellFooter
Well.Heading = WellHeading
Well.Introduction = WellIntroduction
Well.Main = WellMain
Well.Section = WellSection

export default Well
