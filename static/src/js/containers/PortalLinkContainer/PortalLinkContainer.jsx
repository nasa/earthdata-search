import React from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { parse, stringify } from 'qs'
import { isObject } from 'lodash-es'

import Button from '../../components/Button/Button'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { isDefaultPortal } from '../../util/portals'

import useEdscStore from '../../zustand/useEdscStore'
import { changePath } from '../../util/url/changePath'

const PortalLinkContainer = ({
  children = null,
  className = '',
  dataTestId = null,
  newPortal = null,
  onClick = null,
  target = '',
  to = '',
  type = '',
  updatePath = false,
  ...otherProps
}) => {
  const navigate = useNavigate()

  const currentPortalId = useEdscStore((state) => state.portal.portalId)

  // Get the portalId that needs to be used in the link
  const getPortalId = () => {
    const { defaultPortal } = getApplicationConfig()

    // If newPortal was provided, use it
    if (newPortal) {
      // If no portalId was provided, default to the env default portalId
      const { portalId = defaultPortal } = newPortal

      return portalId
    }

    // Use the current portal from the store
    return currentPortalId
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

    // If the updatePath prop was true, call changePath
    if (updatePath) {
      const {
        pathname,
        search: newSearch
      } = newTo

      changePath(`${pathname}${newSearch}`)
    }
  }

  if (type === 'button') {
    // https://stackoverflow.com/questions/42463263/wrapping-a-react-router-link-in-an-html-button#answer-49439893
    return (
      <Button
        type={type || 'button'}
        className={className}
        dataTestId={dataTestId}
        newPortal={newPortal}
        target={target}
        to={to}
        updatePath={updatePath}
        {...otherProps}
        onClick={
          (event) => {
            onClickWithChangePath(event)
            navigate(newTo)
          }
        }
      >
        {children}
      </Button>
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

PortalLinkContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  onClick: PropTypes.func,
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
  updatePath: PropTypes.bool
}

export default PortalLinkContainer
