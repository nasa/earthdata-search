import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

import './PanelGroupHeader.scss'

export const PanelGroupHeader = ({ primaryHeading, secondaryHeading, onPanelsClose }) => (
  <header className="panel-group-header">
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
  </header>
)

PanelGroupHeader.defaultProps = {
  secondaryHeading: null
}

PanelGroupHeader.propTypes = {
  primaryHeading: PropTypes.string.isRequired,
  secondaryHeading: PropTypes.string,
  onPanelsClose: PropTypes.func.isRequired
}

export default PanelGroupHeader
