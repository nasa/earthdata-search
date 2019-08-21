import React from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import GranuleLinkListContainer from '../../containers/GranuleLinkListContainer/GranuleLinkListContainer'

export const Granules = ({ match }) => {
  const { path } = match

  return (
    <div className="route-wrapper route-wrapper--granules route-wrapper--light route-wrapper--content-page">
      <div className="route-wrapper__content">
        <Switch>
          <Route path={`${path}/download/:id`} component={GranuleLinkListContainer} />
        </Switch>
      </div>
    </div>
  )
}

Granules.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default withRouter(Granules)
