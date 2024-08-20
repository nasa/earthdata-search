import React from 'react';
import PropTypes from 'prop-types';
import Joyride, { STATUS } from 'react-joyride';

const SearchTour = ({ runTour, setRunTour }) => {
  const steps = [
    {
      target: '.search',
      content: 'Welcome to Earthdata Search! This tour will guide you through the main features.',
      disableBeacon: true,
      placement: 'center',
      styles: {
        tooltip: {
          width: 500,
          padding: '20px',
        },
        tooltipContent: {
          fontSize: '16px',
        },
      },
    },
    {
      target: '.sidebar__inner',
      content: 'This is the search sidebar. It contains the controls and filters for narrowing down your search.',
      placement: 'right',
    },
    {
      target: '.search-form__primary',
      content: 'Use Earthdata Search\'s natural language processing-enabled search tool to quickly narrow down to relevant collections. An example search phrase could be "Land Surface Temperature over Texas".',
      placement: 'right',
    },
    {
      target: '.search-form__secondary',
      content: 'You can further filter results through the following options:',
      placement: 'right',
    },
    {
      target: '.temporal-selection-dropdown',
      content: 'Pick a temporal range from a calendar.',
      placement: 'right',
    },
    {
      target: '.spatial-selection-dropdown',
      content: 'Manually set spatial boundaries.',
      placement: 'right',
    },
    {
      target: '.search-form__button--advanced-search',
      content: 'Use Advanced Search.',
      placement: 'right',
    },
    {
      target: '.sidebar-filters-list',
      content: (
        <div className="tour-content-left-aligned" style={{ textAlign: 'left' }}>
          <p style={{ textAlign: 'left' }}>Refine your search further with available facets, such as:</p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc', textAlign: 'left' }}>
            <li><span className="tour-list-title">Features</span> - has map imagery, is near-real-time, or is subsettable</li>
            <li><span className="tour-list-title">Keywords</span> - science terms describing collections</li>
            <li><span className="tour-list-title">Platforms</span> - satellite, aircraft, etc. hosting Instruments</li>
            <li><span className="tour-list-title">Instruments</span> - devices that make measurements</li>
            <li><span className="tour-list-title">Organizations</span> - responsible for archiving and/or producing data</li>
            <li><span className="tour-list-title">Projects</span> - mission or science project</li>
            <li><span className="tour-list-title">Processing Levels</span> - raw, geophysical variables, grid, or model</li>
          </ul>
        </div>
      ),
      placement: 'right-start',
      styles: {
        tooltip: {
          width: 450,
        },
        options: {
          textAlign: 'left !important',
        },
      },
    },
    {
      target: '.panel-section',
      content: 'Search results will be shown in the Matching Collections. Each result will have summary information along with relevant badges to allow you to quickly scan your search results to find the right collection. The panel can be resized by clicking and dragging the bar above.',
      placement: 'right',
    },
    {
      target: '.search-sidebar-header',
      content: 'Placeholder.',
      placement: 'right',
    },
    {
      target: '.search-sidebar-header',
      content: 'Placeholder.',
      placement: 'right',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    console.log('Joyride callback:', { action, index, status, type });

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          primaryColor: '#007bff',
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

SearchTour.propTypes = {
  runTour: PropTypes.bool.isRequired,
  setRunTour: PropTypes.func.isRequired,
};

export default SearchTour;