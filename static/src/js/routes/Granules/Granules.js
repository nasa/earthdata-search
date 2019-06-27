import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import GranuleLinkListContainer from '../../containers/GranuleLinkListContainer/GranuleLinkListContainer'

export const Granules = () => (
  <div className="route-wrapper route-wrapper--granules route-wrapper--light route-wrapper--content-page">
    <div className="route-wrapper__content">
      <Switch>
        <Route path="/granules/download">
          <GranuleLinkListContainer />
        </Route>
      </Switch>
    </div>
  </div>
)

export default withRouter(Granules)
