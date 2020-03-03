import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '../Button/Button'
import PanelGroupHeaderMeta from './PanelGroupHeaderMeta'

import './PanelGroupHeader.scss'

/**
 * Renders PanelGroupHeader.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.primaryHeading - The text to be used as the primary heading.
 * @param {String} props.secondaryHeading - The text to be used as the secondary heading.
 * @param {Node} props.header - The element to be used as the header.
 * @param {Node} props.secondaryHeader - The element to be used as the secondaryHeader.
 * @param {Function} props.onPanelsClose - The action to close the panels.
 */
export const PanelGroupHeader = ({
  header,
  onPanelsClose,
  primaryHeading,
  secondaryHeader,
  secondaryHeading
}) => {
  const panelGroupHeaderClasses = classNames([
    'panel-group-header',
    {
      'panel-group-header--custom': header
    }
  ])
  return (
    <header className={panelGroupHeaderClasses}>
      {header || (
        <>
          <h2 className="panel-group-header__heading">
            {secondaryHeading && (
              <span className="panel-group-header__heading-secondary">
                {secondaryHeading}
              </span>
            )}
            <span className="panel-group-header__heading-primary">
              {primaryHeading}
            </span>
          </h2>
          <Button
            className="panel-group-header__close"
            icon="times"
            title="Close panel"
            label="Close panel"
            onClick={() => onPanelsClose()}
          />
        </>
      )}
      {secondaryHeader && (
        <PanelGroupHeaderMeta>{secondaryHeader}</PanelGroupHeaderMeta>
      )}
    </header>
  )
}

PanelGroupHeader.defaultProps = {
  header: null,
  primaryHeading: null,
  secondaryHeader: null,
  secondaryHeading: null
}

PanelGroupHeader.propTypes = {
  header: PropTypes.node,
  onPanelsClose: PropTypes.func.isRequired,
  primaryHeading: PropTypes.string,
  secondaryHeader: PropTypes.node,
  secondaryHeading: PropTypes.string
}

export default PanelGroupHeader
