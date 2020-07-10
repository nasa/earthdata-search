import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

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
  headingLink,
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
          <div className="panel-group-header__heading-wrap">
            <h2 className="panel-group-header__heading">
              {
                secondaryHeading && (
                  <span className="panel-group-header__heading-secondary">
                    {secondaryHeading}
                  </span>
                )
              }
              <span className="panel-group-header__heading-primary">
                {primaryHeading}
              </span>
            </h2>
            {headingLink}
          </div>
        )
      }
    </header>
  )
}

PanelGroupHeader.defaultProps = {
  header: null,
  headingLink: null,
  primaryHeading: null,
  secondaryHeading: null
}

PanelGroupHeader.propTypes = {
  header: PropTypes.node,
  headingLink: PropTypes.shape({}),
  primaryHeading: PropTypes.string,
  secondaryHeading: PropTypes.string
}

export default PanelGroupHeader
