# EDSC-195: As a user, I want to view a timeline showing granule availability so
#           I can discover periods of time where multiple datasets have matching
#           granules

require "spec_helper"

describe "Timeline display", reset: false do
  extend Helpers::DatasetHelpers

  before :all do
    load_page :search
  end

  context 'in the dataset results list' do
    it 'displays no timeline' do
      expect(page).to have_no_selector('#timeline')
    end
  end

  context 'in the project list' do
    before :all do
      # No granules
      add_dataset_to_project('C179001887-SEDAC', '2000 Pilot Environmental Sustainability Index (ESI)')

      # 4 datasets with granules
      add_dataset_to_project('C179002914-ORNL_DAAC', '30 Minute Rainfall Data (FIFE)')
      add_dataset_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')
      add_dataset_to_project('C189399410-GSFCS4PA', 'AIRS/Aqua Level 1B AMSU (A1/A2) geolocated and calibrated brightness temperatures V005')
      add_dataset_to_project('C191370861-GSFCS4PA', 'AIRS/Aqua Level 1B Calibration subset V005')

      dataset_results.click_link "View Project"

      wait_for_xhr
    end

    after :all do
      click_link("Back to Dataset Search")
      reset_project
    end

    it 'displays a timeline containing the first three project datasets that have granules' do
      timeline = page.find('#timeline svg')
      expect(timeline).to have_selector('.C179002914-ORNL_DAAC')
      expect(timeline).to have_selector('.C179003030-ORNL_DAAC')
      expect(timeline).to have_selector('.C189399410-GSFCS4PA')
    end

    it 'does not display datasets without granules' do
      timeline = page.find('#timeline svg')

      expect(timeline).to have_no_selector('.C179001887-SEDAC')
    end

    it 'does not display more than three datasets' do
      timeline = page.find('#timeline svg')
      expect(timeline).to have_no_selector('.C191370861-GSFCS4PA')
    end

    it 'displays times when the displayed datasets have granules' do
      expect(page).to have_selector('#timeline .timeline-data rect')
    end

    context 'returning to the dataset results list' do
      before :all do
        click_link("Back to Dataset Search")
      end

      after :all do
        click_link("View Project")
      end

      it 'hides the timeline' do
        expect(page).to have_no_selector('#timeline')
      end
    end
  end

  context 'in the granule result list, coming from the dataset results list' do
    use_dataset('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')
    hook_granule_results

    it 'displays a timeline for the single focused dataset' do
      timeline = page.find('#timeline svg')
      expect(timeline).to have_selector('.C179003030-ORNL_DAAC')
    end

    context 'returning to the dataset results list' do
      before :all do
        leave_granule_results
      end

      after :all do
        view_granule_results
      end

      it 'hides the timeline' do
        expect(page).to have_no_selector('#timeline')
      end
    end

  end

  context 'in the granule result list, coming from the project' do
    before :all do
      add_dataset_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')

      dataset_results.click_link "View Project"
      view_granule_results('project-overview')
    end

    after :all do
      leave_granule_results('project-overview')
      click_link('Back to Dataset Search')
      reset_project
    end

    it 'displays a timeline for the single focused dataset' do
      timeline = page.find('#timeline svg')
      expect(timeline).to have_selector('.C179003030-ORNL_DAAC')
    end
  end

end
