import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import GranuleLinkList from '../../components/GranuleLinkList/GranuleLinkList'

const mapStateToProps = state => ({
  granuleDownloadLinks: state.granuleDownload.granuleDownloadLinks
})

export const GranuleLinkListContainer = (props) => {
  const { granuleDownloadLinks = [] } = props

  return (
    <GranuleLinkList
      links={granuleDownloadLinks}
    />
  )
}

GranuleLinkListContainer.propTypes = {
  granuleDownloadLinks: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default connect(mapStateToProps, null)(GranuleLinkListContainer)
