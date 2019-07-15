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
  introduction,
  variant
}) => {
  const classes = classNames([
    'well',
    variant ? `well--${variant}` : null,
    className ? `well--${className}` : null
  ])
  return (
    <section className={classes}>
      <header>
        <h2 className="well__heading">{heading}</h2>
        <div className="well__intro">{introduction}</div>
      </header>
      <div className="well__content">
        {children}
      </div>
    </section>
  )
}

Well.defaultProps = {
  children: null,
  className: null,
  heading: null,
  introduction: null,
  variant: null
}

Well.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  heading: PropTypes.node,
  introduction: PropTypes.node,
  variant: PropTypes.string
}

Well.Footer = WellFooter
Well.Heading = WellHeading
Well.Introduction = WellIntroduction
Well.Main = WellMain
Well.Section = WellSection

export default Well
