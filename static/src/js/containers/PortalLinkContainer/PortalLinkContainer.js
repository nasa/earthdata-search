import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const mapStateToProps = state => ({
  portalId: state.portal.portalId
})

export const PortalLinkContainer = ({
  children,
  className,
  onClick,
  portalId,
  to,
  type,
  target
}) => {
  const portalPrefix = `/portal/${portalId}`
  let newTo = to

  if (portalId.length > 0) {
    if (typeof to === 'object') {
      const { pathname } = to
      const portalPath = `${portalPrefix}${pathname}`

      newTo = {
        ...to,
        pathname: portalPath
      }
    }

    if (typeof to === 'string') {
      newTo = `${portalPrefix}${to}`
    }
  }

  return (
    <Link
      className={className}
      type={type}
      to={newTo}
      onClick={onClick}
      target={target}
    >
      {children}
    </Link>
  )
}

PortalLinkContainer.defaultProps = {
  children: null,
  className: '',
  onClick: null,
  portalId: '',
  type: '',
  target: '',
  to: ''
}

PortalLinkContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  portalId: PropTypes.string,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({})
  ]),
  type: PropTypes.string,
  target: PropTypes.string
}

export default connect(mapStateToProps)(PortalLinkContainer)
