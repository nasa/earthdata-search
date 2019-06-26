import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import GranuleLinkListContainer from '../../containers/GranuleLinkListContainer/GranuleLinkListContainer'

export const Granules = () => (
  <div className="route-wrapper route-wrapper--granules route-wrapper--light">
    <div className="route-wrapper__content">
      <header className="route-wrapper__header">
        Collection granule links have been retrieved
      </header>
      <Switch>
        <Route path="/granules/download">
          <GranuleLinkListContainer />
        </Route>
      </Switch>
    </div>
  </div>
)

export default withRouter(Granules)
