import React from 'react'
import PropTypes from 'prop-types'

import './DataQualitySummary.scss'

export const DataQualitySummary = ({
  dataQualitySummaries
}) => (
  dataQualitySummaries.length > 0 && (
    <div className="data-quality-summaries--list">
      {
        dataQualitySummaries.map((dqs) => {
          const { id, summary } = dqs
          const key = `dqs-${id}`

          return <p key={key}>{summary}</p>
        })
      }
    </div>
  )
)

DataQualitySummary.propTypes = {
  dataQualitySummaries: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired
}

export default DataQualitySummary
