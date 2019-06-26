import React from 'react'
import PropTypes from 'prop-types'

export const GranuleLinkList = ({ links }) => (
  <ul className="granules-links-list">
    {
      links.map((link, i) => {
        const key = `link_${i}`
        return (
          <li key={key}>
            <a href={link}>{link}</a>
          </li>
        )
      })
    }
  </ul>
)

GranuleLinkList.propTypes = {
  links: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default GranuleLinkList
