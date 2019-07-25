import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '../Button/Button'

import './SecondaryOverlayPanel.scss'

export const SecondaryOverlayPanel = ({
  body,
  header,
  footer,
  isOpen,
  onToggleSecondaryOverlayPanel
}) => {
  const secondaryOverlayClassName = classNames(
    'secondary-overlay-panel',
    {
      'secondary-overlay-panel--is-open': isOpen
    }
  )
  return (
    <aside className={secondaryOverlayClassName}>
      <header className="secondary-overlay-panel__header">
        {header}
        <div className="secondary-overlay-panel__close">
          <Button
            className="secondary-overlay-panel__close-button"
            label="Close Panel"
            icon="times"
            size="lg"
            onClick={() => onToggleSecondaryOverlayPanel(false)}
          />
        </div>
      </header>
      <div className="secondary-overlay-panel__body">
        {body}
      </div>
      <footer className="secondary-overlay-panel__footer">
        {footer}
      </footer>
    </aside>
  )
}

SecondaryOverlayPanel.defaultProps = {
  footer: null
}

SecondaryOverlayPanel.propTypes = {
  body: PropTypes.node.isRequired,
  footer: PropTypes.node,
  header: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired
}

export default SecondaryOverlayPanel
