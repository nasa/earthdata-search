import React from 'react'
import PropTypes from 'prop-types'
import { FaExclamationCircle } from 'react-icons/fa'

import SanitizedHTML from 'react-sanitized-html'

import CollapsePanel from '../CollapsePanel/CollapsePanel'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './DataQualitySummary.scss'

export const DataQualitySummary = ({
  dataQualitySummaries,
  dataQualityHeader
}) => (
  dataQualitySummaries.length > 0 && (
    <div className="data-quality-summary">
      <CollapsePanel
        className="data-quality-summary__panel"
        header={(
          <>
            <EDSCIcon icon={FaExclamationCircle} className="data-quality-summary__icon" />
            {` ${dataQualityHeader}`}
          </>
        )}
      >
        {
            dataQualitySummaries.map((dqs) => {
              const { id, summary } = dqs
              const key = `dqs-${id}`

              if (React.isValidElement(summary)) {
                return <React.Fragment key={key}>{summary}</React.Fragment>
              }
              return (
                <SanitizedHTML
                  key={key}
                  html={summary}
                  allowedTags={['br', 'span', 'a', 'p']}
                />
              )
            })
          }
      </CollapsePanel>
    </div>
  )
)

DataQualitySummary.propTypes = {
  dataQualitySummaries: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  dataQualityHeader: PropTypes.string.isRequired
}

export default DataQualitySummary
