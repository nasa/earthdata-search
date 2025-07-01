# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

Earthdata Search is NASA's web application for discovering, searching, and accessing Earth Science data from EOSDIS. It's built as a React frontend with a serverless backend deployed on AWS.

### Architecture

- **Frontend**: React 17 with Redux for state management, Vite for building
- **Backend**: AWS Lambda functions with API Gateway, deployed via AWS CDK
- **Database**: PostgreSQL (local development and production)
- **Infrastructure**: AWS (S3, SQS, Step Functions, CloudWatch)
- **Mapping**: OpenLayers for interactive maps and spatial visualization

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
- Playwright for E2E tests
- Mock external services and APIs
- Follow existing test patterns and naming conventions

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
├── containers/          # Redux-connected components
├── actions/            # Redux actions
├── reducers/           # Redux reducers
├── selectors/          # Redux selectors
├── util/               # Frontend utilities
└── constants/          # Frontend constants

serverless/src/
├── <function-name>/    # Individual Lambda functions
│   ├── handler.js      # Lambda entry point
│   └── __tests__/      # Function tests
├── util/               # Shared backend utilities
└── dist/               # Built functions (generated)
```

## Developer Guide

Introduction and Concepts
Progressive Enhancement

Progressive enhancement involves starting with a baseline HTML document that is readable and usable without any styling or javascript. We accomplish this by using semantic markup. From there we enhance the markup by unobtrusively adding CSS styles and Javascript.

By starting with working basic HTML, we ensure we have a page that's minimally usable by:

    Visually impaired users relying on screen readers
    Web crawlers which do not use CSS to determine content's importance and possibly do not evaluate Javascript
    Users who experience an error that breaks scripts or the serving of assets
    Test suites which otherwise do not need Javascript or CSS to perform their tests
    Users of unsupported browsers
    Users with Javascript or CSS disabled or who are attempting to access data from scripts (common in the scientific community)

The key point here is that a missing browser feature or a single script or style error should not render the site unusable.
Mobile-first Development

This is similar to Progressive Enhancement described above. We target narrow screens (typically mobile screens) first and add additional styles as screens get wider, using media selectors.

The reason for this is mostly practical. Mobile renderings tend to have a much simpler set of styles than larger renderings. If we targetted large screens first, much of our mobile effort would be in undoing the styles aimed at larger screens.

Another key point here is that we will plan to be mobile friendly from the start. It is much easier to build this in from the beginning than to attempt to construct it later on.
General Principles
Treat frontend authoring as a development discipline.

HTML is just markup and easy to learn. CSS is turing complete, but not really a programming language. They're easy to dismiss.

The reality is, though, that HTML and CSS provide very few mechanisms for code reuse and organization. Their size and complexity has a direct and perceptible impact on page speed, and they are the most user-visible part of the codebase. It is exceedingly difficult to create clean, performant, reusable, and extensible frontend assets. It generally requires much more care than the corresponding backend code, since backend languages are designed with these aspects in mind.

Frontend authoring is a development discipline and requires a great deal of care and consideration, to the point that most of this guide focuses on frontend development.
Minimize complexity from the beginning.

It is typically very difficult to extract complexity from front-end code. All new components should be focused on reuse, versatility, and extensibility. When possible, do not add new components at all, but reuse or extend existing components.
Create components, not pages.

When developing frontend code, the unit of reuse should be the module, component, or behavior, not the page. Design components that can be used across multiple pages or that are versatile enough to be used multiple times on the same page, possibly for different purposes. Write, CSS, Javascript, and partial HTML for components, not for pages, in order to promote robustness and reuse and keep code size in check.
Document decisions.

There may be good exceptions to every rule in this guide. When in doubt, follow the guide, but make exceptions as necessary. Always document these decisions. Further, whenever you write code in a non-standard way, or you are faced with multiple competing options and make an important choice, document those decisions as well.
Testing
Test everything.

Every line of application code, including UI markup, should be exercised in a test.
Test at the appropriate level.

Exercise boundary conditions, error handling, and varying inputs at the unit or functional level.

Integration tests should demonstrate user-visible system behavior.

Remember that integration tests run much more slowly than unit tests, so prefer to test more thoroughly at the unit level.
Build meaningful sentences with Jest blocks.

The chain of Jest "describe" blocks leading up to the final "test" block should form a human-readable sentence. This is particularly true for integration specs where we are documenting system behavior spec names.

Consider an example where we don't use this style.

Bad Example:

describe('Account creation', () => {
      …
      describe('messages', () => {
        …
        test('should display success messages', () => { … })
        test('should display failure messages', () => { … })
      })
      test('recovers passwords', () => { … }
      test('should send emails to users', () => { … }
    })

Consider the sentences produced by the above:

    Account creation messages should display success messages.
    Account creation messages should display failure messages.
    Account creation recovers passwords.
    Account creation should send emails to users.

The test fails to describe the system. Reading the sentences, we don't know why a particular behavior might happen. Some of the sentences don't entirely make sense.

We fix the problem by using more descriptive contexts and paying attention to the sentences we're constructing with our tests.

Improved Example:

describe("Account creation" do
      …
      describe('for users providing valid information', () => {
        test('displays a success message', () => { … }
        test('sends an email to the user', () => { … }
      })
      describe('for users providing duplicate user names', () => {
        test('displays an informative error message', () => { … }
        test('prompts users to recover their passwords', () => { … }
      })
    })

Consider the sentences produced by the above:

    Account creation for users providing valid information displays a success message.
    Account creation for users providing valid information sends an email to the user.
    Account creation for users providing duplicate user names displays an informative error message.
    Account creation for users providing duplicate user names prompts users to recover their passwords.

The above sentences more adequately describe the behavior of the system given varying inputs.
Avoid the ugly mirror problem.

http://jasonrudolph.com/blog/2008/07/30/testing-anti-patterns-the-ugly- mirror/

Tests should describe how the system responds to certain inputs. They should not simply duplicate the code under test.
Minimize test suite execution time.

The test suite should provide developers with rapid feedback regarding the correctness of their code. To accomplish this, they should execute quickly. Keep performance in mind when writing tests. The following guidelines will help minimize execution time:

    Test varying inputs and edge cases at the unit or functional level, rather than the integration level.
    Avoid running integration tests with Javascript enabled unless Javascript is necessary for the feature under test.
    Avoid calling external services, particularly ones which cannot be run in a local environment. Use mocks for these services.
    Avoid loading external images, CSS, and Javascript in integration tests.
    Avoid or disable interactions and interface elements that will cause Capybara to wait. For instance, disable animations or transitions.
    Skip to the page under test in integration tests, there is no need to start at the home page for every test (though you should have a test which verifies you can start at the home page).
    Avoid increasing timeouts to fix intermittent problems. Find other means.
    Time your tests.
    Follow this style guide for performant HTML, CSS, and Javascript.

If performance becomes a problem, we may segregate tests into "fast" and "full" runs, but ideally we will avoid this.
Fix sources of intermittent failures immediately.

If you see a failure and you suspect it was caused by some intermittent problem, e.g. a timeout that is too short or an external service being down, it is not enough to simply re-run the tests. Fix the problem. If a problem truly cannot be fixed, document why, catch the specific error that cannot be fixed, and throw a more meaningful one.


React testing library best practices:

    Avoid using test-ids where possible, this reduces our applications accessibility so use this sparingly
    Favor retrieving elements by Role  such as buttons, checkboxes etc. If there are multiple elements of the same role on a component use a secondary filter to ensure you select the correct ones for your assertions example: getByRole('button, {name: 'button-name'}
    Don't use await  statements for userEvent methods, userEvent is already wrapped in an await
    Using a container instead of screen to select elements on the virtual DOM
    Don't perform side effects within a waitFor  block
    For more see(https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
    When you create a useEvent try to reuse it by returning it from the render  method

HTML
Use semantically meaningful elements where possible.

div and span convey no meaning and are rarely the most appropriate element in a given context. When adding an element, look at other elements that HTML provides to see if another is more appropriate. This helps developer readability, keeps styles simpler, and may aid accessibility or search engine indexing. Here are some questions you may ask:

    Does it contain a paragraph? Use a p.
    Does it contain a heading or subheading? Use a h[n].
    Does it contain an item in a list of items? Use a li.
    Does it constitute a section of the page appropriate for an outline? Use a section.
    Does it contain header or footer information for a page or section? Use a header or header.
    Does it contain describe a form field? Use a label.
    etc

Avoid presentational class names.

We should be able to dramatically alter the look and feel of the site without changing (much) HTML in order to match changing designs or to accommodate new user agents. This is particularly important for responsive design, where multiple browsers may need to render the same HTML in different ways.

To allow this, use class names that describe an element's purpose, contents, or behaviors, rather than ones that describe its presentation.

Overly-presentational class names.  We may not want this element
      to appear to the left on mobile browsers, for example.
    -->
    <section class="left bold bordered">
    
    <!-- This one uses more semantically appropriate class names -->
    <section class="primary emphasized summary">

Avoid unnecessary elements. Keep nesting shallow.

Minimize the overall depth of HTML to decrease page size, increase readability, and improve rendering speed.
CSS with Sass

Earthdata Search uses SCSS to generate its CSS. It follows the guidelines for scalable CSS outlined by SMACSS, with key items reproduced in this document. The CI build checks CSS style using CSS Lint. Developers are strongly encouraged to read the CSS Lint rules.
Do not use id selectors (#id)

ID selectors indicate that a style is one-off and can only appear in one place on a page. Prefer to build reusable styles that could appear in multiple places or on multiple pages. Further, id selectors are very specific in terms of the CSS cascade, making them hard to override.

There are two exceptions to this rule: #site-header and #site-footer. These two areas of the page are typically significantly different than the rest of the site to the point where they need to override all styles, and the drawbacks of using id selectors mostly do not apply.
Do not use style attributes or inline styles.

Place all styles in CSS files. Mixing styles with HTML makes tracking, testing, and reusing styles much more difficult. Further, style attributes are incredibly specific and difficult to override.

Javascript components should also prefer to apply classes to elements rather than alter their style attributes for the same reasons.
Do not use !important

!important makes styles impossible to override unless the overriding rule also uses !important. In almost every case, using !important is unnecessary. Prefer to use selectors with higher precedence or alter overridden selectors to have lower precedence.

Very very rarely it is necessary to use !important because of third-party code. This typically happens when a third-party Javascript library adds an undesirable style attribute to an element. When given the choice between altering third-party Javascript or using !important, the latter is usually preferable. In this circumstance, document the decision. This is one reason we avoid setting style attributes, even in Javascript components.
Prefer selectors that describe attributes and components, not domain

concepts.

Consider the following element:

<ul class="granules">

ul.granules selects a list with very specific elements, which may only be available on one page. Any styles applied to this list are unlikely to be reusable. Adding classes that describe attributes of the list makes CSS styles more modular and reusable.

<ul class="granules zebra scrollable selectable">

Here we may use different selectors to apply different attributes to the list. ul.zebra may add zebra striping to the rows, ul.scrollable may add a scroll widget, and ul.selectable may provide hover and selection mechanisms. Any of these attributes could be useful on lists that do not describe granules, and other lists could mix and match attributes to match their needs. Fine-grained attribute-centric class names provide for better reuse.
Follow SMACSS rule categories and naming conventions

Follow SMACSS guidelines for grouping and naming CSS classes. Prefix layout classes with "l-". Prefix state classes with "is-". Do not prefix module classes. Use double dashes to indicate module subclasses, e.g. "module--subclass"
Minimize selector depth

As described by SMACSS' Depth of Applicability chapter, minimize and simplify CSS selectors. Deeply nested selectors are easy to create in Sass, but they are hard to understand and create a strong coupling to the underlying HTML structure. Further, they tend to be overly-specific, causing duplication in CSS rules. Whenever possible, keep nesting 1-2 selectors deep, with 3 being the maximum.

// Deep nesting
    .module {
      div {
        h1 {
          span {
            font-weight:bold;
          }
        }
      }
    }
    // Shallower nesting
    .module {
      h1 > span {
        font-weight:bold;
      }
    }
    // Shallow nesting
    .module-header-text {
      font-weight:bold;
    }

Use fast CSS selectors where possible.

A large page with many CSS rules can suffer rendering performance problems that make pages feel sluggish even on modern browsers and computers. Understand selector performance and follow these rules to allow pages to render quickly:

1. Use child selectors 2. Avoid tag selectors for common elements (div, span, p) 3. Use class names as the right-most selector
Use variables for colors and numbers.

Use Sass variables to describe all colors except black and white and all numbers except 0 and 1px. This makes it easier to find usages of measurements and change them as necessary.
Use Sass helpers for CSS3 styles.

Sass and compass provide helpers for CSS3 styles that normalize experimental browser extensions, for instance

@include border-radius(4px, 4px);

generates

-webkit-border-radius: 4px 4px;
    -moz-border-radius: 4px / 4px;
    -khtml-border-radius: 4px / 4px;
    border-radius: 4px / 4px;

Use these helpers to avoid overly-verbose CSS.
Target browsers with classes not CSS hacks.

The base site contains HTML boilerplate libraries which add CSS classes to the html and body element that detect commonly misbehaving browsers (older IE versions) and browser capabilities. Use these classes to target browsers or capabilities rather than relying on CSS hacks.
Javascript
Build components and modules, not one-off elements

Try to build Javascript components and widgets that could apply throughout the site, rather than on a single page or in a single situation. Good questions to ask when writing code is "Can I make this into a widget?" or "Can I apply this behavior to all elements with this class?". If the answer is no, perhaps the element could be described as a composition of multiple components (scrollable, zebra-striped, selectable list rather than one-off granule list)

Allow users to bookmark content and use the back button

Dynamic interfaces are great, but users should be able to bookmark their current location to return later, especially for complex search UIs like Earthdata Search. Further, we should allow the user to back up to previous states or leave the site via the back button.

When building the interface, use the History API to ensure that history entries are pushed to the stack appropriately. Push entries to the stack when the user reaches points they would reasonably expect to bookmark. Avoid pushing entries so frequently that backing out of a state using the back button becomes tedious or impossible.

VERY IMPORTANT: Always follow development patterns set in place already within this project. Always look to see how we are doing similar things in other places, and follow with that design paradigm.