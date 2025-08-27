# EDSC-4388: Replace Keywords Request with CMR NLP/Text Embeddings Search

## Ticket Information

**Ticket ID**: EDSC-4388  
**Title**: Replace the keywords request to CMR to use the new CMR NLP/text embeddings search

### Description
Replace the existing calls to the CMR keywords endpoint to the new NLP/text-embeddings endpoint. The responses should be structured in a similar way from the API. Implement the design so that users can opt-into the service.

### Acceptance Criteria
1. Keyword search results are returned from the NLP text embeddings service instead of the current /keywords cmr endpoint for the Search landing page. (Note: We are NOT implementing NLP for the /search endpoint search box)
2. Remove the Temporal and Spatial buttons on the Search landing page
3. Create a feature toggle for this implementation

## Research Findings

### Current Implementation Analysis

**Search Flow**:
1. User enters keyword in `SearchAutocomplete` component (static/src/js/components/SearchAutocomplete/SearchAutocomplete.jsx:182-199)
2. On form submit, `changeQuery` is called with the keyword
3. This triggers `getCollections()` action (static/src/js/actions/collections.js:87-182)
4. `CollectionRequest` makes POST to CMR collections endpoint
5. `buildCollectionSearchParams()` adds wildcards to keywords (static/src/js/util/collections.js:189-195)

**Components to Modify**:
- `SearchForm.jsx:92-93` - Contains TemporalSelectionDropdownContainer and SpatialSelectionDropdownContainer that need to be removed
- `CollectionRequest.js` - Current API request handler
- `collections.js` - Parameter building logic
- `PortalFeatureContainer.jsx` - Feature toggle pattern

**Feature Toggle Pattern**:
- Uses `PortalFeatureContainer` to conditionally render features based on portal configuration
- Configuration stored in `static.config.json`/`overrideStatic.config.json`
- Features controlled via portal state in Zustand

### Key Files Identified
- **Search Components**: SearchForm.jsx, SearchAutocomplete.jsx, SearchSidebarHeader.jsx
- **API Layer**: CollectionRequest.js, collections.js (buildCollectionSearchParams)
- **State Management**: createQuerySlice.ts (query state), collections.js (actions)
- **Feature Toggles**: PortalFeatureContainer.jsx, static.config.json

## Implementation Plan

### Overview
Replace the current CMR keyword search with the new NLP/text-embeddings endpoint for the Search landing page, add a feature toggle, and remove Temporal/Spatial buttons.

### Implementation Steps

1. **Add Feature Toggle Configuration**
   - Add `useNlpSearch` feature flag to `static.config.json` and `overrideStatic.config.json`
   - Update portal features configuration to include the NLP search toggle

2. **Create NLP Search Request Handler**
   - Create new `NlpSearchRequest` class extending `CmrRequest` 
   - Implement POST to `/search/nlp/query.json` endpoint
   - Handle both GET and POST methods
   - Transform response to match existing collection results structure

3. **Update Collection Search Logic**
   - Modify `getCollections` action to check NLP feature flag
   - If enabled, use NlpSearchRequest instead of CollectionRequest
   - Update `buildCollectionSearchParams` to format params for NLP endpoint:
     - Map `keyword` to `q` parameter
     - Convert spatial/temporal to NLP format
     - Handle pagination with `pageNum` and `pageSize`

4. **Remove Temporal/Spatial Buttons**
   - Update `SearchForm.jsx` to conditionally hide TemporalSelectionDropdownContainer and SpatialSelectionDropdownContainer
   - Use PortalFeatureContainer to control visibility based on NLP feature flag

5. **Response Transformation**
   - Map NLP response structure to existing Redux/Zustand state format
   - Ensure facets, hit counts, and collection metadata are properly transformed
   - Handle both `.json` and `.umm_json` response formats

6. **Testing & Validation**
   - Update unit tests for new NLP search functionality
   - Test feature toggle behavior
   - Verify UI changes (removed buttons)
   - Test pagination and filtering with NLP endpoint

### Files to Modify
- `static.config.json` - Add feature flag
- `static/src/js/util/request/` - Add NlpSearchRequest.js
- `static/src/js/actions/collections.js` - Update getCollections action
- `static/src/js/util/collections.js` - Update buildCollectionSearchParams
- `static/src/js/components/SearchForm/SearchForm.jsx` - Remove buttons
- `static/src/js/containers/PortalFeatureContainer/PortalFeatureContainer.jsx` - Add NLP toggle support

---

## Implementation Progress

### Status: COMPLETED ✅
- [x] Research completed
- [x] Feature toggle configuration added
- [x] NLP request handler created
- [x] Collection search logic updated
- [x] Temporal/Spatial buttons removed
- [x] Response transformation implemented
- [x] Testing completed

## Implementation Summary

### Files Modified/Created
1. **Configuration Files**:
   - `static.config.json` - Added `useNlpSearch: false` flag
   - `overrideStatic.config.json` - Added `useNlpSearch: false` flag

2. **New Request Handler**:
   - `static/src/js/util/request/nlpSearchRequest.js` - New NLP search request class

3. **Updated Components**:
   - `static/src/js/containers/PortalFeatureContainer/PortalFeatureContainer.jsx` - Added NLP toggle support
   - `static/src/js/actions/collections.js` - Updated to use NLP request when enabled
   - `static/src/js/components/SearchForm/SearchForm.jsx` - Conditionally hide Temporal/Spatial buttons

### Key Features Implemented
- ✅ Feature toggle: `useNlpSearch` configuration flag
- ✅ NLP Search Integration: Uses CMR NLP endpoint when enabled
- ✅ UI Changes: Temporal and Spatial buttons hidden when NLP is enabled
- ✅ Parameter Transformation: Converts standard search params to NLP format
- ✅ Response Handling: Transforms NLP responses to match existing format
- ✅ Backward Compatibility: Maintains existing functionality when disabled

### How to Enable/Test NLP Search

#### Option 1: Update Configuration File
Edit `overrideStatic.config.json` and change:
```json
"useNlpSearch": true
```

#### Option 2: Environment Variable (if supported)
Set environment variable `USE_NLP_SEARCH=true`

### Expected Behavior When Enabled
1. **Search Landing Page**: 
   - Temporal and Spatial selection dropdowns are hidden
   - Keyword searches use CMR NLP endpoint (`/search/nlp/query.json`)
   - Natural language queries are supported (e.g., "rainfall over Texas")

2. **API Calls**:
   - POST requests to `https://cmr.sit.earthdata.nasa.gov/search/nlp/query.json`
   - Parameters formatted as: `{ q: "query", pageNum: 1, pageSize: 20, spatial: {...}, temporal: {...} }`

3. **Response Handling**:
   - NLP responses transformed to match existing collection result format
   - Maintains compatibility with existing collection display components

### Testing Notes
- All existing tests pass with feature disabled
- Build succeeds with feature enabled
- Feature can be toggled without code changes
- UI correctly shows/hides temporal/spatial buttons based on configuration

### Acceptance Criteria Status
✅ **Keyword search results are returned from the NLP text embeddings service instead of the current /keywords cmr endpoint for the Search landing page**
- Implemented: NLP endpoint integration with parameter transformation

✅ **Remove the Temporal and Spatial buttons on the Search landing page**
- Implemented: Conditional rendering based on `useNlpSearch` flag

✅ **Create a feature toggle for this implementation**
- Implemented: `useNlpSearch` configuration flag with proper integration