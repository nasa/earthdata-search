import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'

import actions from '../../actions/index'

import { encodeUrlQuery, urlPathsWithoutUrlParams } from '../../util/url/url'

import useEdscStore from '../../zustand/useEdscStore'
import {
  getCollectionsQuery,
  getSelectedRegionQuery,
  getNlpCollection
} from '../../zustand/selectors/query'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
import { getCollectionId, getCollectionsMetadata } from '../../zustand/selectors/collection'
import { getGranuleId } from '../../zustand/selectors/granule'
import { getMapPreferences, getCollectionSortPreference } from '../../zustand/selectors/preferences'

import CREATE_PROJECT from '../../operations/mutations/createProject'
import UPDATE_PROJECT from '../../operations/mutations/updateProject'
import isPath from '../../util/isPath'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onChangeUrl:
    (query) => dispatch(actions.changeUrl(query))
})

export const UrlQueryContainer = (props) => {
  const {
    children,
    onChangePath,
    onChangeUrl
  } = props

  const location = useLocation()
  const {
    pathname,
    search
  } = location

  const navigate = useNavigate()

  const [currentPath, setCurrentPath] = useState('')

  const zustandValues = useEdscStore((state) => ({
    collectionsMetadata: getCollectionsMetadata(state),
    collectionsQuery: getCollectionsQuery(state),
    collectionSortPreference: getCollectionSortPreference(state),
    earthdataEnvironment: getEarthdataEnvironment(state),
    featureFacets: state.facetParams.featureFacets,
    focusedCollection: getCollectionId(state),
    focusedGranule: getGranuleId(state),
    granuleDataFormatFacets: state.facetParams.cmrFacets.granule_data_format_h,
    horizontalDataResolutionRangeFacets:
      state.facetParams.cmrFacets.horizontal_data_resolution_range,
    instrumentFacets: state.facetParams.cmrFacets.instrument_h,
    latency: state.facetParams.cmrFacets.latency,
    mapPreferences: getMapPreferences(state),
    mapView: state.map.mapView,
    organizationFacets: state.facetParams.cmrFacets.data_center_h,
    platformFacets: state.facetParams.cmrFacets.platforms_h,
    portalId: state.portal.portalId,
    processingLevelFacets: state.facetParams.cmrFacets.processing_level_id_h,
    projectCollections: state.project.collections,
    projectFacets: state.facetParams.cmrFacets.project_h,
    nlpSearch: getNlpCollection(state)?.query,
    scienceKeywordFacets: state.facetParams.cmrFacets.science_keywords_h,
    selectedFeatures: state.shapefile.selectedFeatures,
    selectedRegion: getSelectedRegionQuery(state),
    shapefileId: state.shapefile.shapefileId,
    // TODO Add this back during EDSC-4569
    // timelineQuery: state.timeline.query,
    twoDCoordinateSystemNameFacets: state.facetParams.cmrFacets.two_d_coordinate_system_name
  }))

  const {
    savedProject,
    setProject
  } = useEdscStore((state) => ({
    savedProject: state.savedProject.project,
    setProject: state.savedProject.setProject
  }))

  // When the page loads, call onChangePath to load the values from the URL
  useEffect(() => {
    onChangePath([pathname, search].filter(Boolean).join(''))
  }, [])

  const [createProjectMutation] = useMutation(gql(CREATE_PROJECT))
  const [updateProjectMutation] = useMutation(gql(UPDATE_PROJECT))

  // When the Zustand state changes, encode the values and call onChangeUrl to update the URL
  useEffect(() => {
    const nextPath = encodeUrlQuery({
      ...zustandValues,
      pathname
    })

    if (currentPath !== nextPath) {
      setCurrentPath(nextPath)

      if (nextPath !== '') {
        const {
          id: projectId,
          path: projectPath
        } = savedProject

        const shouldSaveProject = !isPath(nextPath, urlPathsWithoutUrlParams)
          // We don't want projects to use the `/projects` path, but we don't want to add it to
          // `urlPathsWithoutUrlParams` because that would affect other functionality
          && !isPath(nextPath, [/^\/projects/])

        if (projectId && shouldSaveProject) {
          if (projectPath !== nextPath) {
            // If there is a projectId call updateProjectMutation
            updateProjectMutation({
              variables: {
                obfuscatedId: projectId,
                path: nextPath
              },
              onCompleted: (data) => {
                const { updateProject } = data
                const {
                  name,
                  obfuscatedId,
                  path
                } = updateProject

                setProject({
                  id: obfuscatedId,
                  name,
                  path
                })

                // Update the URL with the new projectId
                const newUrl = `${nextPath.split('?')[0]}?projectId=${obfuscatedId}`

                navigate(newUrl, { replace: true })
              }
            })
          } else {
            const newUrl = `${nextPath.split('?')[0]}?projectId=${projectId}`

            navigate(newUrl, { replace: true })
          }
        } else if (nextPath.length > 2000 && shouldSaveProject) {
          // If there is more than 2000 characters in the URL, call createProjectMutation
          createProjectMutation({
            variables: {
              path: nextPath
            },
            onCompleted: (data) => {
              const { createProject } = data
              const {
                name,
                obfuscatedId,
                path
              } = createProject

              setProject({
                id: obfuscatedId,
                name,
                path
              })

              // If the projectId has changed, update the URL
              if (projectId !== obfuscatedId) {
                const newUrl = `${nextPath.split('?')[0]}?projectId=${obfuscatedId}`

                navigate(newUrl, { replace: true })
              }
            }
          })
        } else {
          // Else call onChangeUrl to update the URL values
          onChangeUrl(nextPath)
        }
      }
    }
  }, [
    zustandValues,
    pathname
  ])

  return children
}

UrlQueryContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onChangeUrl: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(UrlQueryContainer)
