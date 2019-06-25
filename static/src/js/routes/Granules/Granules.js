import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import GranuleListContainer from '../../containers/GranuleListContainer/GranuleListContainer'

export const Granules = () => (
  <div className="route-wrapper route-wrapper--granules route-wrapper--light">
    <div className="route-wrapper__content">
      <header className="route-wrapper__header">
        Collection granule links have been retrieved
      </header>
      <Switch>
        <Route path="/granules/download">
          <GranuleListContainer />
        </Route>
      </Switch>
    </div>
  </div>
)

export default withRouter(Granules)
