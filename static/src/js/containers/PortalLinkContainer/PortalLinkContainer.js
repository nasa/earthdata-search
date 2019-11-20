import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import Button from '../../components/Button/Button'

const mapStateToProps = state => ({
  portalId: state.portal.portalId
})

export const PortalLinkContainer = (props) => {
  const {
    children,
    className,
    onClick,
    portalId,
    to,
    type,
    target
  } = props

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

  if (type === 'button') {
    // https://stackoverflow.com/questions/42463263/wrapping-a-react-router-link-in-an-html-button#answer-49439893
    const {
      dispatch,
      history,
      location,
      to,
      match,
      portalId,
      staticContext,
      target,
      onClick,
      ...rest
    } = props

    return (
      <Button
        type="button"
        {...rest}
        onClick={(event) => {
          if (onClick) onClick(event)
          history.push(newTo)
        }}
      />
    )
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
  staticContext: null,
  type: '',
  target: '',
  to: ''
}

PortalLinkContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  staticContext: PropTypes.shape({}),
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

export default withRouter(
  connect(mapStateToProps)(PortalLinkContainer)
)
