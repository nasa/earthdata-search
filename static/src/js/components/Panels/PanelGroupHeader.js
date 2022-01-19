/* eslint-disable react/jsx-props-no-spreading */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  FaSortAmountDownAlt,
  FaSortAmountDown,
  FaTable,
  FaList,
  FaFileExport
} from 'react-icons/fa'

import { headerMetaSkeleton, titleSkeleton } from './skeleton'

import Button from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import RadioSettingDropdown from '../RadioSettingDropdown/RadioSettingDropdown'
import Skeleton from '../Skeleton/Skeleton'

import './PanelGroupHeader.scss'

/**
 * Renders PanelGroupHeader.
 * @param {Object} props - The props passed into the component
 * @param {String} props.activeSort - The active sort option
 * @param {String} props.activeView - The active view option
 * @param {Array} props.breadcrumbs - An array of objects used to configure the breadcrumbs
 * @param {Array} props.handoffLinks - An array of objects used to configure the handoff links
 * @param {Boolean} props.headerLoading - A flag designating the header loading state
 * @param {Node} props.headerMessage - The element to be used as the header message
 * @param {Boolean} props.headerMetaPrimaryLoading - A flag designating the header primary loading state
 * @param {String} props.headerMetaPrimaryText - A string designating the header primary loading text
 * @param {Boolean} props.isActive -  A flag to designate the PanelGroup as active. Active PanelGroups are lifted to the highest index
 * @param {Boolean} props.isOpen - A flag to desingate the PanelGroup as open
 * @param {Array} props.moreActionsDropdownItems - An array of objects used to configure the more actions dropdown items
 * @param {String} props.panelGroupId - The element to be used as the header
 * @param {String} props.primaryHeading - The text to be used as the primary heading
 * @param {String} props.secondaryHeading - The text to be used as the secondary heading
 * @param {Array} props.sortsArray - The text to be used as the secondary heading
 * @param {Array} props.viewsArray - The text to be used as the secondary heading
*/
export const PanelGroupHeader = ({
  activeSort,
  activeView,
  breadcrumbs,
  handoffLinks,
  headerMessage,
  headerMetaPrimaryLoading,
  headerMetaPrimaryText,
  panelGroupId,
  primaryHeading,
  headerLoading,
  moreActionsDropdownItems,
  exportsArray,
  secondaryHeading,
  sortsArray,
  viewsArray
}) => {
  const panelGroupHeaderClasses = classNames([
    'panel-group-header',
    {
      'panel-group-header--custom': true
    }
  ])

  let ActiveSortIcon = null

  if (activeSort.indexOf('-') >= 0) {
    ActiveSortIcon = FaSortAmountDown
  } else {
    ActiveSortIcon = FaSortAmountDownAlt
  }

  let ActiveViewIcon

  if (activeView === 'table') {
    ActiveViewIcon = FaTable
  } else {
    ActiveViewIcon = FaList
  }

  return (
    <header className={panelGroupHeaderClasses}>
      {
        breadcrumbs.length > 0 && (
          <nav
            className="panel-group-header__breadcrumbs"
            data-test-id="panel-group-header__breadcrumbs"
          >
            {
              breadcrumbs.map((crumb, i) => {
                const key = `breadcrumb__${i}`
                const {
                  icon = '',
                  title = '',
                  link = {},
                  onClick = null,
                  options = {}
                } = crumb

                const {
                  pathname = '',
                  search = ''
                } = link

                const {
                  shrink = false
                } = options

                const className = classNames([
                  'panel-group-header__breadcrumb',
                  {
                    'panel-group-header__breadcrumb--shrink': shrink
                  }
                ])

                if (!link || !pathname) {
                  return (
                    <Button
                      key={`${key}_portal-link_${panelGroupId}`}
                      type="button"
                      bootstrapVariant="link"
                      className={className}
                      icon={icon}
                      label={title}
                      onClick={onClick}
                    >
                      {title}
                    </Button>
                  )
                }

                return (
                  <Fragment key={`${key}_portal-link_${panelGroupId}`}>
                    <PortalLinkContainer
                      className={className}
                      type="button"
                      bootstrapVariant="link"
                      icon={icon}
                      label={title}
                      onClick={onClick}
                      to={{
                        pathname,
                        search
                      }}
                    >
                      {title}
                    </PortalLinkContainer>
                    {
                      i < breadcrumbs.length - 1 && (
                        <span className="panel-group-header__breadcrumb-divider">/</span>
                      )
                    }
                  </Fragment>
                )
              })
            }
          </nav>
        )
      }
      <div className="panel-group-header__heading-wrap">
        {
          headerLoading
            ? (
              <Skeleton
                className="panel-group-header__heading panel-group-header__heading--skeleton"
                containerStyle={{
                  display: 'inline-block',
                  height: '1.25rem',
                  width: '100%'
                }}
                shapes={titleSkeleton}
              />
            )
            : (
              <span className="panel-group-header__heading">
                <h2
                  className="panel-group-header__heading-primary"
                  data-test-id="panel-group-header__heading-primary"
                >
                  {primaryHeading}
                </h2>
                {secondaryHeading}
              </span>
            )
        }
        {
          (
            moreActionsDropdownItems.length > 0
            || handoffLinks.length > 0
          ) && (
            <MoreActionsDropdown
              className="panel-group-header__more-actions"
              handoffLinks={handoffLinks}
            >
              {
                moreActionsDropdownItems.map((moreActionsDropdownItem, i) => {
                  const key = JSON.stringify(moreActionsDropdownItem) + i
                  const {
                    title = '',
                    icon = '',
                    link = {},
                    onClick = null
                  } = moreActionsDropdownItem

                  const {
                    pathname = '',
                    search = ''
                  } = link

                  const onClickProps = {}

                  if (typeof onClick === 'function') {
                    onClickProps.onClick = onClick
                  }

                  let item = (
                    <MoreActionsDropdownItem
                      key={`${key}_item`}
                      title={title}
                      icon={icon}
                      {...onClickProps}
                    />
                  )

                  if (pathname) {
                    item = (
                      <PortalLinkContainer
                        key={`${key}_portal-link`}
                        to={{
                          pathname,
                          search
                        }}
                      >
                        {item}
                      </PortalLinkContainer>
                    )
                  }

                  return item
                })
              }
            </MoreActionsDropdown>
          )
        }
      </div>
      {
        headerMessage && (
          <div className="panel-group-header__message">
            {headerMessage}
          </div>
        )
      }
      {
        (
          headerMetaPrimaryText
          || sortsArray.length > 0
          || viewsArray.length > 0
        ) && (
          <div className="panel-group-header__heading-meta">
            <div className="panel-group-header__heading-meta-primary">
              {
                headerMetaPrimaryLoading
                  ? (
                    <Skeleton
                      className="panel-group-header__heading-meta-skeleton"
                      containerStyle={{ height: '18px', width: '213px' }}
                      shapes={headerMetaSkeleton}
                    />
                  )
                  : (
                    <span
                      className="panel-group-header__heading-meta-text"
                      data-test-id="panel-group-header__heading-meta-text"
                    >
                      {headerMetaPrimaryText}
                    </span>
                  )
              }
            </div>
            {
              (exportsArray.length > 0 || sortsArray.length > 0 || viewsArray.length > 0) && (
                <nav className="panel-group-header__heading-meta-secondary">
                  {
                    exportsArray.length > 0 && (
                      <RadioSettingDropdown
                        id={`panel-group-header-dropdown__export__${panelGroupId}`}
                        className="panel-group-header__setting-dropdown"
                        activeIcon={FaFileExport}
                        label="Export"
                        settings={exportsArray}
                      />
                    )
                  }
                  {
                    sortsArray.length > 0 && (
                      <RadioSettingDropdown
                        id={`panel-group-header-dropdown__sort__${panelGroupId}`}
                        className="panel-group-header__setting-dropdown"
                        activeSortOrder={activeSort}
                        activeIcon={ActiveSortIcon}
                        label="Sort"
                        settings={sortsArray}
                      />
                    )
                  }
                  {
                    viewsArray.length > 0 && (
                      <RadioSettingDropdown
                        id={`panel-group-header-dropdown__view__${panelGroupId}`}
                        className="panel-group-header__setting-dropdown"
                        activeIcon={ActiveViewIcon}
                        label="View"
                        settings={viewsArray}
                      />
                    )
                  }
                </nav>
              )
            }
          </div>
        )
      }
    </header>
  )
}

PanelGroupHeader.defaultProps = {
  activeView: '',
  activeSort: '',
  breadcrumbs: [],
  handoffLinks: [],
  headingLink: null,
  headerMessage: null,
  headerMetaPrimaryLoading: false,
  headerMetaPrimaryText: null,
  moreActionsDropdownItems: [],
  panelGroupId: null,
  primaryHeading: null,
  headerLoading: false,
  exportsArray: [],
  viewsArray: [],
  secondaryHeading: null,
  sortsArray: []
}

PanelGroupHeader.propTypes = {
  activeSort: PropTypes.string,
  activeView: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})),
  handoffLinks: PropTypes.arrayOf(PropTypes.shape({})),
  headingLink: PropTypes.shape({}),
  headerMessage: PropTypes.node,
  headerMetaPrimaryLoading: PropTypes.bool,
  headerMetaPrimaryText: PropTypes.string,
  moreActionsDropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.func,
      link: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string
      })
    })
  ),
  panelGroupId: PropTypes.string,
  primaryHeading: PropTypes.string,
  headerLoading: PropTypes.bool,
  exportsArray: PropTypes.arrayOf(PropTypes.shape({})),
  viewsArray: PropTypes.arrayOf(PropTypes.shape({})),
  secondaryHeading: PropTypes.node,
  sortsArray: PropTypes.arrayOf(PropTypes.shape({}))
}

export default PanelGroupHeader
