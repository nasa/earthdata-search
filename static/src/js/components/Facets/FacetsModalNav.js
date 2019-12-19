import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'

import { alphabet } from '../../util/alphabetic-list'

import './FacetsModalNav.scss'

export class FacetsModalNav extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.modalInnerRef = props.modalInnerRef
  }

  onNavItemClick = (e) => {
    e.preventDefault()
    const modalContainer = $(this.modalInnerRef.current)
    const headingElement = modalContainer.find(`${$(e.target).attr('href')}`)
    if (!headingElement[0]) return
    modalContainer.animate({
      scrollTop: headingElement[0].offsetTop - 55
    })
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
