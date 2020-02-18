import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SimpleBar from 'simplebar-react'

import AppLogoContainer from '../../containers/AppLogoContainer/AppLogoContainer'
import SearchFormContainer
  from '../../containers/SearchFormContainer/SearchFormContainer'

import './Sidebar.scss'

const Sidebar = ({
  children,
  panels,
  visible
}) => {
  const className = classNames({
    sidebar: true,
    'sidebar--hidden': !visible
  })

  return (
    <section className={className}>
      <div className="sidebar__inner">
        <AppLogoContainer />
        <SearchFormContainer />
        <SimpleBar className="sidebar__content" style={{ height: '100%', overflowX: 'hidden' }}>
          {children}
        </SimpleBar>
      </div>
      {panels && panels}
    </section>
  )
}

Sidebar.defaultProps = {
  panels: null
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  panels: PropTypes.node,
  visible: PropTypes.bool.isRequired
}

export default Sidebar
