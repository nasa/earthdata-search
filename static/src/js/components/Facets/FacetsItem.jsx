import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase, uniqueId } from 'lodash-es'
import classNames from 'classnames'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { FaQuestionCircle } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import { generateFacetArgs } from '../../util/facets'
import { commafy } from '../../util/commafy'
import renderTooltip from '../../util/renderTooltip'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsPageInfo } from '../../zustand/selectors/collections'

import './FacetsItem.scss'

const FacetsItem = ({
  autocompleteType = null,
  changeHandler,
  facet,
  facetCategory,
  level,
  uid = ''
}) => {
  const {
    applyingFacet,
    applied,
    children: facetChildren,
    count,
    description,
    setApplyingFacet,
    title
  } = facet

  const { isLoading } = useEdscStore(getCollectionsPageInfo)

  const onFacetChange = (changeHandlerArgs, event) => {
    // Set the applyingFacet state to show loading state
    setApplyingFacet(title)

    changeHandler(event, changeHandlerArgs, {
      level,
      type: autocompleteType,
      value: title
    }, !applied)
  }

  let children = ''

  const changeHandlerArgs = generateFacetArgs(facet)

  if (facetChildren && applied) {
    children = facetChildren.map((child) => {
      const nextUid = uniqueId('facet-item_')
      const nextLevel = level + 1

      // Add `applyingFacet` and `setApplyingFacet` to the child facet to ensure loading state works
      const childFacet = {
        ...child,
        applyingFacet,
        setApplyingFacet
      }

      return (
        <FacetsItem
          autocompleteType={autocompleteType}
          key={nextUid}
          uid={nextUid}
          facet={childFacet}
          level={nextLevel}
          facetCategory={facetCategory}
          changeHandler={changeHandler}
        />
      )
    })
  }

  const className = classNames(
    'facets-item',
    `facets-item--level-${level}`
  )

  const { iconProps } = facet

  // If the collections are loading, and this facet is the one being applied,
  // show the checkbox as the next value
  const isFacetBeingApplied = applyingFacet === title && isLoading

  const checkboxClassNames = classNames(
    'facets-item__checkbox',
    'form-check-input',
    'mt-0',
    {
      'facets-item__checkbox--disabled': isLoading
    }
  )

  const titleContainerClassNames = classNames(
    'facets-item__title-container',
    {
      'facets-item__title-container--disabled': isLoading
    }
  )

  const facetTotalClassNames = classNames(
    'facets-item__total',
    {
      'facets-item__total--disabled': isLoading
    }
  )

  return (
    <li className={className}>
      <label
        className="facets-item__label"
        htmlFor={uid}
        title={title}
      >
        <input
          id={uid}
          className={checkboxClassNames}
          data-testid={`facet_item-${kebabCase(title)}`}
          type="checkbox"
          name={title}
          aria-label={title}
          // If this is the facet being applied, show the opposite of the applied
          // state because the user just clicked on it
          checked={isFacetBeingApplied ? !applied : applied}
          disabled={isLoading}
          onChange={(event) => onFacetChange(changeHandlerArgs, event)}
        />
        <div className={titleContainerClassNames}>
          {
            iconProps?.icon && (
              <EDSCIcon
                className="facets-item__icon"
                icon={iconProps.icon}
                variant="facet"
                ariaLabel={iconProps.ariaLabel}
              />
            )
          }
          <span className="facets-item__title">
            {title}
          </span>
          {
            description
            && (
              <OverlayTrigger
                placement="top"
                overlay={
                  (tooltipProps) => renderTooltip({
                    children: description,
                    style: { width: '20rem' },
                    ...tooltipProps
                  })
                }
              >
                <EDSCIcon
                  icon={FaQuestionCircle}
                  size="10"
                  variant="more-info"
                  ariaLabel="A question mark icon indicating there is more information"
                  data-testid={`facet_item-${kebabCase(title)}-info`}
                />
              </OverlayTrigger>
            )
          }
        </div>
        {
          (!applied || !children) && (count != null) && (
            <span className={facetTotalClassNames}>{commafy(count)}</span>
          )
        }
      </label>
      { children && <ul className="facets-list">{children}</ul> }
    </li>
  )
}

FacetsItem.propTypes = {
  autocompleteType: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  facet: PropTypes.shape({
    applied: PropTypes.bool,
    applyingFacet: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape({})),
    count: PropTypes.number,
    description: PropTypes.string,
    iconProps: PropTypes.shape({
      icon: PropTypes.elementType,
      ariaLabel: PropTypes.string
    }),
    setApplyingFacet: PropTypes.func,
    title: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  facetCategory: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  uid: PropTypes.string
}

export default FacetsItem
