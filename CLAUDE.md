# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

Earthdata Search is NASA's web application for discovering, searching, and accessing Earth Science data from EOSDIS. It's built as a React frontend with a serverless backend deployed on AWS.

### Architecture

- **Frontend**: React 17 with Redux (migrating to Zustand) for state management, Vite for building
- **Backend**: AWS Lambda functions with API Gateway, deployed via AWS CDK
- **Database**: PostgreSQL with Knex.js, using `node-pg-migrate` for migrations
- **Infrastructure**: AWS (S3, SQS, Step Functions, CloudWatch)
- **Mapping**: OpenLayers for interactive maps and spatial visualization
- **Build Tools**: Vite (frontend), esbuild (serverless functions)

## Development Commands

### Setup and Installation
```bash
npm install                    # Install dependencies
cp secret.config.json.example secret.config.json  # Copy config template
cp static.config.json overrideStatic.config.json  # Copy static config
createdb edsc_dev             # Create PostgreSQL database
npm run invoke-local migrateDatabase  # Run database migrations
```

### Running the Application
```bash
npm start                     # Start development server (frontend + backend + API)
npm run start:optionals       # Start with optional services (SQS, image cache)
npm run start:app             # Start only the frontend (Vite dev server)
npm run start:api             # Start only the API backend
```

### Building and Testing
```bash
npm run build                 # Build production assets
npm run build:api             # Build serverless functions
npm test                      # Run Jest tests
npm run test:watch            # Run tests in watch mode
npm run test:watch-lite       # Run tests with minimal coverage
npm run lint                  # Run ESLint
npm run playwright            # Run Playwright E2E tests
npm run playwright:ui         # Run Playwright with UI
```

### Database Operations
```bash
npm run migrate create name-of-migration  # Create new database migration
npm run invoke-local migrateDatabase      # Run migrations locally
```

### Lambda Development
```bash
npm run invoke-local <lambda-name> ./path/to/event.json  # Test lambda locally
npm run build:api             # Build all serverless functions
```

### Deployment
```bash
npm run deploy-infrastructure  # Deploy AWS infrastructure
npm run deploy-application    # Deploy application stack
npm run deploy-static         # Deploy static assets
```

## Code Architecture

### Frontend Structure
- **Entry Point**: `static/src/index.jsx` → `static/src/js/App.jsx`
- **State Management**: Redux with thunk middleware, store in `static/src/js/store/`
- **Routing**: React Router with connected-react-router
- **Components**: Located in `static/src/js/components/` (presentational)
- **Containers**: Located in `static/src/js/containers/` (connected to Redux)
- **Actions**: Redux actions in `static/src/js/actions/`
- **Reducers**: Redux reducers in `static/src/js/reducers/`
- **Utilities**: Shared utilities in `static/src/js/util/`

### Backend Structure
- **Lambda Functions**: Each function in `serverless/src/<function-name>/handler.js`
- **Shared Utilities**: Common backend utilities in `serverless/src/util/`
- **Database**: Knex.js for queries, migrations in `migrations/`
- **AWS Services**: CDK infrastructure definitions in `cdk/`

### Configuration
- **Static Config**: `static.config.json` (public configuration)
- **Override Config**: `overrideStatic.config.json` (local overrides, not committed)
- **Secret Config**: `secret.config.json` (sensitive values, not committed)
- **Portal Config**: Portal-specific configurations in `portals/`

### Key Shared Utilities
- **sharedUtils/**: Utilities shared between frontend and backend
- **sharedConstants/**: Constants used across the application
- **Common functions**: Configuration, date handling, URL parsing, CMR interactions

## Development Patterns

### Component Development
- Use functional components with hooks where possible
- Components in `components/` should be presentational
- Containers in `containers/` handle Redux connections
- Follow existing patterns for styling (SCSS modules)

### State Management

#### Redux to Zustand Migration
The codebase is actively migrating from Redux to Zustand:

**Legacy Redux Pattern**:
- Centralized store in `static/src/js/store/`
- Actions in `static/src/js/actions/`
- Reducers in `static/src/js/reducers/`
- Connected containers in `static/src/js/containers/`

**Current Zustand Pattern**:
- Store slices in `static/src/js/zustand/slices/`
- Immer middleware for immutable updates
- TypeScript support with proper typing
- Centralized store in `useEdscStore.ts`

**Zustand Slice Structure**:
```typescript
const createSliceName: ImmerStateCreator<SliceType> = (set, get) => ({
  sliceName: {
    ...initialState,
    actions: {
      actionName: (payload) => {
        set((state) => {
          state.sliceName.property = payload
        })
      }
    }
  }
})
```

#### Redux Legacy Patterns (Being Phased Out)
- Actions should be pure functions returning action objects or thunks
- Reducers must be pure functions
- Use selectors in `selectors/` for derived state
- Follow existing patterns for async actions with loading states

### Lambda Development
- Each lambda has its own directory with `handler.js` and `__tests__/`
- Use shared utilities in `serverless/src/util/`
- Follow existing patterns for error handling and response formatting
- Always include comprehensive tests

### Testing
- Jest for unit tests with jsdom environment
- Playwright for E2E tests with visual regression testing
- Mock external services and APIs
- Follow existing test patterns and naming conventions
- **Enzyme Migration**: Being replaced with React Testing Library
- **Parallel Testing**: Jest uses 3 shards, Playwright uses 6 shards in CI

### Styling
- SCSS with modular approach
- Variables in `static/src/css/utils/variables/`
- Bootstrap 5 as base framework
- Follow existing design system patterns

## Important Notes

- **Environment Variables**: Use `.env` files or set via dotenvx for local development
- **CMR Integration**: All NASA CMR API interactions should use existing utilities
- **Authentication**: EDL (Earthdata Login) integration for user authentication
- **Database Migrations**: Always create migrations for schema changes
- **Portal System**: Multi-tenant architecture supporting different portals/themes
- **CDK Deployment**: Infrastructure as code using AWS CDK TypeScript

## File Structure Patterns

```
static/src/js/
├── components/          # Presentational React components
├── containers/          # Redux-connected components (being phased out)
├── zustand/             # Zustand store and slices (current state management)
│   ├── slices/          # Individual store slices
│   └── useEdscStore.ts  # Centralized store
├── actions/            # Redux actions (legacy)
├── reducers/           # Redux reducers (legacy)
├── selectors/          # Redux selectors (legacy)
├── hooks/              # Custom React hooks
├── util/               # Frontend utilities
└── constants/          # Frontend constants

serverless/src/
├── <function-name>/    # Individual Lambda functions
│   ├── handler.js      # Lambda entry point
│   └── __tests__/      # Function tests
├── util/               # Shared backend utilities
└── dist/               # Built functions (generated)
```

[Rest of the existing content remains unchanged...]

## Testing Patterns

### Jest and Mocking
- **Mocking Best Practices**:
  - Never use `clearAllMocks()`, we have a global setting that does this automatically
- **Coverage**: Comprehensive coverage collection with module mapping for images and CSS
- **Test Environment**: jsdom with proper React Testing Library setup

### Playwright E2E Testing
- **Visual Regression**: Screenshot comparison testing across browsers
- **Multi-browser**: Chromium, Firefox, WebKit support
- **CI Optimization**: 6-shard parallel execution with proper retry logic
- **Custom Viewport**: 1400x900 for consistent testing

## Database Migration Patterns

### Migration Best Practices
- Use `node-pg-migrate` for all schema changes
- Migrations stored in `/migrations/` directory with timestamps
- Always include both `up` and `down` functions for reversibility
- Use JSONB columns for flexible data storage (e.g., user preferences)
- Test migrations locally before deployment

**Example Migration Pattern**:
```javascript
exports.up = async (pgm) => {
  pgm.addColumn('table_name', {
    new_column: { type: 'jsonb', default: '{}' }
  })
}

exports.down = async (pgm) => {
  pgm.dropColumn('table_name', 'new_column')
}
```

## Lambda Handler Patterns

### Standard Handler Structure
```javascript
const functionName = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const { defaultResponseHeaders } = getApplicationConfig()
  const dbConnection = await getDbConnection()
  
  try {
    // Function logic here
    return {
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(result)
    }
  } catch (error) {
    return buildErrorResponse(error)
  }
}
```

### Build and Bundle Patterns
- **esbuild**: Used for serverless function bundling with proper externals
- **Vite**: Frontend bundling with React plugin and TypeScript support
- **Code Splitting**: Manual chunks for optimal loading performance
- **Image Optimization**: `vite-imagetools` for multiple format support

## Code Guidelines

- **Linting and Code Style**:
  - Never use eslint disables unless explicitly approved
  - Follow Airbnb ESLint config with TypeScript extensions
- **TypeScript Migration**: Gradual adoption with proper typing
- **State Management**: Prefer Zustand over Redux for new features
- **Component Patterns**: Use functional components with hooks over class components
- I will always restart the development server. Never do that yourself. If it needs to be done, let me know.