import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import OrderStatus from '../../components/OrderStatus/OrderStatus'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'


export const Data = () => {
  console.warn('Data')
  return (
    <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
      <div className="route-wrapper__content">
        <header className="route-wrapper__header">
          <SecondaryToolbarContainer />
        </header>
        <nav className="route-wrapper__content-nav">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="route-wrapper__content-nav-link" href="#">
            <i className="fa fa-arrow-circle-o-left" />
            {' Back to Project'}
          </a>
        </nav>
        <div className="route-wrapper__content-inner">
          <Switch>
            <Route path="/data/retrieve">
              <OrderStatus />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

Data.propTypes = {}

export default withRouter(Data)
