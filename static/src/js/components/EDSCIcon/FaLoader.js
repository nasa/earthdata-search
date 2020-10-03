import React from 'react'
import * as FaIcon from 'react-icons/fa'
import PropTypes from 'prop-types'

const FaLoader = ({ icon, className }) => {
  const Icon = FaIcon[icon]
  return (
    <>
      {
        Icon
          ? (<Icon key={icon} className={className} style={{ verticalAlign: 'initial' }} />)
          : null
      }
    </>
  )
}

FaLoader.defaultProps = {
  className: null
}

FaLoader.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired
}

export default FaLoader
