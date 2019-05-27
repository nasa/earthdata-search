import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Badge, Button } from 'react-bootstrap'
import queryString from 'query-string'
import { stringify } from '../../util/url/url'

const GranuleResultsHeaderActions = ({
  collectionId,
  granuleCount,
  isCollectionInProject,
  location,
  onAddProjectCollection,
  onRemoveCollectionFromProject
}) => {
  const addToProjectButton = (
    <Button
      className="add-to-project"
      onClick={() => onAddProjectCollection(collectionId)}
      variant="info"
    >
      <i className="fa fa-plus-circle" />
      Add to project
    </Button>
  )
  const removeFromProjectButton = (
    <Button
      className="remove-from-project"
      onClick={() => onRemoveCollectionFromProject(collectionId)}
      variant="danger"
    >
      <i className="fa fa-times-circle" />
      Remove from project
    </Button>
  )

  const downloadAllButton = () => {
    const params = queryString.parse(location.search)
    let { p } = params
    if (p.split('!').indexOf(collectionId) < 1) p = `${p}!${collectionId}`

    return (
      <Link
        className="download-all"
        onClick={() => onAddProjectCollection(collectionId)}
        to={{
          pathname: '/projects',
          search: stringify({
            ...params,
            p
          })
        }}
      >
        <Button
          className="secondary-toolbar__project"
          variant="success"
        >
          <i className="fa fa-download" />
          Download All
          <Badge variant="secondary">{ `${granuleCount} Granules` }</Badge>
        </Button>
      </Link>
    )
  }

  return (
    <>
      <p className="granule-count">{`${granuleCount} Granules`}</p>
      {
        isCollectionInProject && removeFromProjectButton
      }
      {
        !isCollectionInProject && addToProjectButton
      }
      {downloadAllButton()}
    </>
  )
}

GranuleResultsHeaderActions.defaultProps = {
  granuleCount: 0
}

GranuleResultsHeaderActions.propTypes = {
  collectionId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default GranuleResultsHeaderActions
