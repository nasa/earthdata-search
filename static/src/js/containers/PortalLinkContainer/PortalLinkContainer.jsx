import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { parse, stringify } from 'qs'
import { isObject } from 'lodash'

import { locationPropType } from '../../util/propTypes/location'

import Button from '../../components/Button/Button'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import actions from '../../actions'
import { isDefaultPortal } from '../../util/portals'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path))
})

export const mapStateToProps = (state) => ({
  portal: state.portal
})

export const PortalLinkContainer = (props) => {
  const {
    children,
    className,
    dataTestId,
    onClick,
    portal: currentPortal,
    newPortal,
    to,
    type,
    target,
    updatePath,
    onChangePath
  } = props

  // Get the portalId that needs to be used in the link
  const getPortalId = () => {
    const { defaultPortal } = getApplicationConfig()

    // If newPortal was provided, use it
    if (newPortal) {
      // If not portalId was provided, default to the env default portalId
      const { portalId = defaultPortal } = newPortal

      return portalId
    }

    // Use the current portal from the redux store
    const { portalId } = currentPortal

    return portalId
  }

  let objectTo = to
  if (!isObject(to)) {
    const [pathname, search] = to.split('?')

    objectTo = {
      pathname,
      search: search ? `?${search}` : search
    }
  }

  const { search } = objectTo

  const params = parse(search, {
    parseArrays: false,
    ignoreQueryPrefix: true
  })

  // Determine what the newPortalId should be
  const newPortalId = getPortalId()

  // If the newPortalId is the env default portal, don't include it in the search parameters
  let portalId
  if (!isDefaultPortal(newPortalId)) portalId = newPortalId

  const newTo = {
    ...objectTo,
    search: stringify({
      ...params,
      portal: portalId
    }, {
      addQueryPrefix: true
    })
  }

  // Build the onClick function
  const onClickWithChangePath = (event) => {
    // If the onClick prop was provided call it
    if (onClick) onClick(event)

    // If the updatePath prop was true, call onChangePath
    if (updatePath) {
      const {
        pathname,
        search: newSearch
      } = newTo

      onChangePath(`${pathname}${newSearch}`)
    }
  }

  if (type === 'button') {
    // https://stackoverflow.com/questions/42463263/wrapping-a-react-router-link-in-an-html-button#answer-49439893
    const {
      history,
      ...rest
    } = props

    return (
      <Button
        type="button"
        {...rest}
        onClick={
          (event) => {
            onClickWithChangePath(event)
            history.push(newTo)
          }
        }
      />
    )
  }

  return (
    <Link
      className={className}
      data-testid={dataTestId}
      type={type}
      to={newTo}
      onClick={onClickWithChangePath}
      target={target}
    >
      {children}
    </Link>
  )
}

PortalLinkContainer.defaultProps = {
  children: null,
  className: '',
  dataTestId: null,
  onClick: null,
  portal: {},
  newPortal: null,
  staticContext: null,
  type: '',
  target: '',
  to: '',
  updatePath: false
}

PortalLinkContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: locationPropType.isRequired,
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  portal: PropTypes.shape({
    portalId: PropTypes.string
  }),
  newPortal: PropTypes.shape({
    portalId: PropTypes.string
  }),
  staticContext: PropTypes.shape({}),
  target: PropTypes.string,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({})
  ]),
  type: PropTypes.string,
  updatePath: PropTypes.bool,
  onChangePath: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortalLinkContainer)
)
