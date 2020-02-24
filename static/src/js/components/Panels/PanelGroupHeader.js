import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from '../Button/Button'

import './PanelGroupHeader.scss'


/**
 * Renders PanelGroupHeader.
 * @param {object} props - The props passed into the component.
 * @param {string} props.primaryHeading - The text to be used as the primary heading.
 * @param {string} props.secondaryHeading - The text to be used as the secondary heading.
 * @param {function} props.onPanelsClose - The action to close the panels.
 */
export const PanelGroupHeader = ({
  header,
  onPanelsClose,
  primaryHeading,
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
      {
        header || (
          <>
            <h2 className="panel-group-header__heading">
              {
                secondaryHeading && (
                  <span className="panel-group-header__heading-secondary">{secondaryHeading}</span>
                )
              }
              <span className="panel-group-header__heading-primary">{primaryHeading}</span>
            </h2>
            <Button
              className="panel-group-header__close"
              icon="times"
              title="Close panel"
              label="Close panel"
              onClick={() => onPanelsClose()}
            />
          </>
        )
      }
    </header>
  )
}

PanelGroupHeader.defaultProps = {
  header: null,
  primaryHeading: null,
  secondaryHeading: null
}

PanelGroupHeader.propTypes = {
  header: PropTypes.node,
  onPanelsClose: PropTypes.func.isRequired,
  primaryHeading: PropTypes.string,
  secondaryHeading: PropTypes.string
}

export default PanelGroupHeader
