import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ArrowChevronDown,
  ArrowChevronUp
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import classNames from 'classnames'
import { kebabCase } from 'lodash-es'

import FacetsList from './FacetsList'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import useEdscStore from '../../zustand/useEdscStore'

import './FacetsGroup.scss'

const FacetsGroup = ({
  facet,
  facetCategory
}) => {
  const {
    applied,
    autocompleteType,
    changeHandler,
    children,
    options = {},
    title,
    totalSelected = 0
  } = facet

  const [isOpen, setIsOpen] = useState(!!(applied || options.isOpen))
  const {
    openFacetGroup,
    setOpenFacetGroup,
    triggerViewAllFacets
  } = useEdscStore((state) => ({
    openFacetGroup: state.home.openFacetGroup,
    setOpenFacetGroup: state.home.setOpenFacetGroup,
    triggerViewAllFacets: state.facetParams.triggerViewAllFacets
  }))

  useEffect(() => {
    if (openFacetGroup && autocompleteType === openFacetGroup) {
      setIsOpen(true)
      setOpenFacetGroup(null)
    }
  }, [openFacetGroup])

  const onToggle = () => {
    setIsOpen(!isOpen)
  }

  const onViewAllClick = () => {
    triggerViewAllFacets(facet.title)
  }

  let buttonTitleText = title

  if (totalSelected > 0) {
    buttonTitleText += ` (${totalSelected} Filters Selected)`
  }

  if (facet.children.length === 0) {
    buttonTitleText += ' (0 Filters Available)'
  }

  const facetsGroupClassNames = classNames([
    'facets-group',
    {
      'facets-group--is-open': isOpen
    }
  ])

  return (
    <li className={facetsGroupClassNames} key={title} data-testid={`facet_group-${kebabCase(title)}`}>
      <h3 className="facets-group__heading">
        <div className="d-grid gap-2">
          <button
            className="btn btn-light facets-group__button"
            type="button"
            label={buttonTitleText}
            title={buttonTitleText}
            onClick={onToggle}
            disabled={facet.children.length === 0}
          >
            <div className="facets-group__heading-primary">
              <span className="facets-group__title">
                {title}
              </span>
              {
                totalSelected > 0 && (
                  <span className="facets-group__selected-count">
                    {`${totalSelected} Selected`}
                  </span>
                )
              }
            </div>
            <div className="facets-group__action">
              {
                !isOpen
                  ? (
                    <EDSCIcon icon={ArrowChevronDown}>
                      <span className="visually-hidden">Open</span>
                    </EDSCIcon>
                  ) : (
                    <EDSCIcon icon={ArrowChevronUp}>
                      <span className="visually-hidden">Close</span>
                    </EDSCIcon>
                  )
              }
            </div>
          </button>
        </div>
      </h3>
      {
        isOpen && (
          <section className="facets-group__body" data-testid={`facet-${kebabCase(title)}`}>
            {
              facet.children.length > 49 && (
                <header className="facets-group__header">
                  <span className="facets-group__meta">Showing Top 50</span>
                  <button
                    className="facets-group__view-all"
                    type="button"
                    onClick={onViewAllClick}
                  >
                    View All
                  </button>
                </header>
              )
            }
            <FacetsList
              autocompleteType={autocompleteType}
              changeHandler={changeHandler}
              facets={children}
              facetCategory={facetCategory}
              liftSelectedFacets={options.liftSelectedFacets}
            />
          </section>
        )
      }
    </li>
  )
}

FacetsGroup.propTypes = {
  facet: PropTypes.shape({
    applied: PropTypes.bool,
    autocompleteType: PropTypes.string,
    changeHandler: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.shape({})),
    options: PropTypes.shape({}),
    title: PropTypes.string,
    totalSelected: PropTypes.number
  }).isRequired,
  facetCategory: PropTypes.string.isRequired
}

export default FacetsGroup
