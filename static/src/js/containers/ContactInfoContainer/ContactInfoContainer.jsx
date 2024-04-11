import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

import ContactInfo from '../../components/ContactInfo/ContactInfo'

export const mapStateToProps = (state) => ({
  contactInfo: state.contactInfo,
  earthdataEnvironment: getEarthdataEnvironment(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchContactInfo:
    () => dispatch(actions.fetchContactInfo()),
  onUpdateNotificationLevel:
    (level) => dispatch(actions.updateNotificationLevel(level))
})

export class ContactInfoContainer extends Component {
  componentDidMount() {
    const {
      onFetchContactInfo
    } = this.props

    onFetchContactInfo()
  }

  render() {
    const {
      contactInfo,
      earthdataEnvironment,
      onUpdateNotificationLevel
    } = this.props

    return (
      <ContactInfo
        contactInfo={contactInfo}
        earthdataEnvironment={earthdataEnvironment}
        onUpdateNotificationLevel={onUpdateNotificationLevel}
      />
    )
  }
}

ContactInfoContainer.propTypes = {
  contactInfo: PropTypes.shape({}).isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  onFetchContactInfo: PropTypes.func.isRequired,
  onUpdateNotificationLevel: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ContactInfoContainer)
)
