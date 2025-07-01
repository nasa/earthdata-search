import React from 'react'
import useEdscStore from '../zustand/useEdscStore'

/**
 * Example component demonstrating how to use Zustand preferences
 * This shows the patterns for accessing and updating preferences
 */
const ZustandPreferencesExample = () => {
  // Method 1: Get multiple preferences with actions
  const {
    preferences,
    setCollectionListView,
    setGranuleListView,
    updatePreferences
  } = useEdscStore((state) => ({
    preferences: state.preferences,
    setCollectionListView: state.preferences.setCollectionListView,
    setGranuleListView: state.preferences.setGranuleListView,
    updatePreferences: state.preferences.updatePreferences
  }))

  // Method 2: Get specific preference values only
  const collectionSort = useEdscStore((state) => state.preferences.collectionSort)
  const isSubmitting = useEdscStore((state) => state.preferences.isSubmitting)

  // Example handlers
  const handleCollectionViewChange = (view) => {
    setCollectionListView(view)
  }

  const handleGranuleViewChange = (view) => {
    setGranuleListView(view)
  }

  const handleSavePreferences = async () => {
    try {
      await updatePreferences({
        formData: {
          ...preferences,
          // Add any specific changes here
          panelState: 'updated'
        }
      })

      console.log('Preferences saved successfully!')
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }

  return (
    <div className="zustand-preferences-example">
      <h3>Zustand Preferences Example</h3>

      <div>
        <h4>Current Preferences:</h4>
        <pre>{JSON.stringify(preferences, null, 2)}</pre>
      </div>

      <div>
        <h4>
          Collection Sort:
          {collectionSort}
        </h4>
        <h4>
          Is Submitting:
          {isSubmitting ? 'Yes' : 'No'}
        </h4>
      </div>

      <div>
        <button onClick={() => handleCollectionViewChange('table')}>
          Set Collection View to Table
        </button>
        <button onClick={() => handleGranuleViewChange('list')}>
          Set Granule View to List
        </button>
        <button onClick={handleSavePreferences} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}

export default ZustandPreferencesExample
