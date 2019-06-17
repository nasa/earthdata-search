import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PanelGroupFooter from './PanelGroupFooter'

import './PanelItem.scss'

/**
 * Renders PanelItem.
 * @param {object} props - The props passed into the component.
 * @param {node} props.children - The panel item children.
 * @param {node} props.footer - The element to be used as the footer.
 * @param {boolean} props.hideFooter - Hides the PanelGroup footer if one is defined.
 * @param {boolean} props.isActive -  A flag to desingate the PanelItem as active.
 */
export const PanelItem = ({
  children,
  footer,
  hideFooter,
  isActive
}) => {
  const className = classNames([
    'panel-item',
    {
      'panel-item--is-active': isActive
    }
  ])
  return (
    <div className={className}>
      <div className="panel-item__content">
        {children}
      </div>
      {
        (footer && !hideFooter) && (
          <PanelGroupFooter
            footer={footer}
          />
        )
      }
    </div>
  )
}

PanelItem.defaultProps = {
  footer: null,
  hideFooter: false,
  isActive: false
}

PanelItem.propTypes = {
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  hideFooter: PropTypes.bool,
  isActive: PropTypes.bool
}

export default PanelItem
