import gql from 'graphql-tag'

const ADMIN_PREFERENCES_METRICS = gql`
    query AdminPreferencesMetrics {
      adminPreferencesMetrics {
        baseLayer {
          count
          percentage
          value
        }
        collectionListView {
          value
          percentage
          count
        }
        collectionSort {
          value
          percentage
          count
        }
        granuleListView {
          count
          percentage
          value
        }
        granuleSort {
          value
          percentage
          count
        }
        latitude {
          value
          percentage
          count
        }
        longitude {
          value
          percentage
          count
        }
        overlayLayers {
          value
          percentage
          count
        }
        panelState {
          value
          percentage
          count
        }
        projection {
          value
          percentage
          count
        }
        zoom {
          value
          percentage
          count
        }
      }
    }
  `

export default ADMIN_PREFERENCES_METRICS
