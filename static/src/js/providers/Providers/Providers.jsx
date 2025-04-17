import React from 'react'
import PropTypes from 'prop-types'

import TourContextProvider from '../TourContextProvider/TourContextProvider'
import PanelWidthContextProvider from '../PanelWidthContextProvider/PanelWidthContextProvider'
import HomeContextProvider from '../HomeContextProvider/HomeContextProvider'
import MbrContextProvider from '../MbrContextProvider/MbrContextProvider'

/**
 * @typedef {Object} ProvidersProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children wrapped with the application wide Providers
 * @param {ProvidersProps} props
 *
 * @example <caption>Renders children wrapped with context providers.</caption>
 *
 * return (
 *   <Providers>
 *     {children}
 *   </Providers>
 * )
 */
const Providers = ({ children }) => {
  const providers = [
    <TourContextProvider key="provider_tour-context-provider" />,
    <PanelWidthContextProvider key="provider_panel-width-context-provider" />,
    <MbrContextProvider key="provider_mbr-context-provider" />,
    <HomeContextProvider key="provider_start-drawing-context-provider" />
  ]

  // Combine the Providers into a single Provider component
  return providers.reduceRight(
    (providerChildren, parent) => React.cloneElement(parent, { children: providerChildren }),
    children
  )
}

Providers.propTypes = {
  children: PropTypes.node.isRequired
}

export default Providers
