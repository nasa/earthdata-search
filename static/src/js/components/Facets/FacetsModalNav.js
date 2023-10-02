import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { alphabet } from '../../util/alphabetic-list'

import './FacetsModalNav.scss'

export class FacetsModalNav extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.modalInnerRef = props.modalInnerRef
  }

  onNavItemClick = (e) => {
    // Prevent the default behavior, which closes the modal when a navigation item is clicked
    e.preventDefault()

    // Get the ID of the heading that corresponds to the link and find that in the modal content
    const headingElement = this.modalInnerRef.current.querySelector(e.target.getAttribute('href'))

    // Bail out if no heading exists for the current ID
    if (!headingElement) return

    if (headingElement.scrollIntoView) {
      // If scrollIntoView is supported, use that to scroll to the container
      headingElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    } else {
      // If scrollIntoView is not supported, set the scrollTop on the inner modal container to move the item into position
      const modalContainer = this.modalInnerRef.current
      const navigationBuffer = 55

      modalContainer.scrollTop = headingElement.offsetTop - navigationBuffer
    }
  }

  render() {
    const { activeLetters } = this.props

    return (
      <nav className="facets-modal-nav">
        <span className="facets-modal-nav__heading">Jump:</span>
        {
          activeLetters.length > 0 && (
            <ul className="facets-modal-nav__list">
              {
                alphabet.map((letter) => {
                  const linkSymbol = letter === '#' ? 'number' : letter

                  return (
                    <li key={`active_letter_${letter}`} className="facets-modal-nav__list-item">
                      {
                        activeLetters.includes(letter)
                          ? (
                            <a
                              className="facets-modal-nav__entry"
                              href={`#facet-modal__${linkSymbol}`}
                              onClick={this.onNavItemClick}
                            >
                              {letter}
                            </a>
                          )
                          : (
                            <span className="facets-modal-nav__entry facets-modal-nav__entry--inactive">{letter}</span>
                          )
                      }
                    </li>
                  )
                })
              }
            </ul>
          )
        }
      </nav>
    )
  }
}

FacetsModalNav.defaultProps = {
  activeLetters: [],
  modalInnerRef: null
}

FacetsModalNav.propTypes = {
  activeLetters: PropTypes.arrayOf(PropTypes.string),
  modalInnerRef: PropTypes.shape({})
}

export default FacetsModalNav
