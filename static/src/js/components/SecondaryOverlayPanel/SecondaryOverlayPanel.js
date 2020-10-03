import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SimpleBar from 'simplebar-react'

import Button from '../Button/Button'

import './SecondaryOverlayPanel.scss'

/**
 * Renders SecondaryOverlayPanel.
 * @param {Object} props - The props passed into the component.
 * @param {Node} props.body - The panel body.
 * @param {Node} props.header - The panel header.
 * @param {Node} props.footer - The panel footer.
 * @param {Boolean} props.isOpen - Determines if the panel should be open.
 * @param {Function} props.onToggleSecondaryOverlayPanel - Callback function to toggle the panel.
 */
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
            icon="FaTimes"
            size="lg"
            onClick={() => onToggleSecondaryOverlayPanel(false)}
          />
        </div>
      </header>
      <SimpleBar className="secondary-overlay-panel__body" style={{ height: '100%' }}>
        {body}
      </SimpleBar>
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
