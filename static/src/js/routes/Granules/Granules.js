import React from 'react'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import GranuleLinkListContainer from '../../containers/GranuleLinkListContainer/GranuleLinkListContainer'

export const Granules = () => (
  <div className="route-wrapper route-wrapper--granules route-wrapper--light route-wrapper--content-page">
    <div className="route-wrapper__content">
      <Switch>
        <Route path="/granules/download/:id" component={GranuleLinkListContainer} />
      </Switch>
    </div>
  </div>
)

export default withRouter(Granules)
