# EDSC-195: As a user, I want to view a timeline showing granule availability so
#           I can discover periods of time where multiple collections have matching
#           granules

require "spec_helper"

describe "Timeline display", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search
  end

  after :each do
    wait_for_xhr
  end

  context 'in the collection results list' do
    it 'displays no timeline' do
      expect(page).to have_no_selector('#timeline')
    end
  end

  context 'in the project list' do
    before :all do
      wait_for_xhr
      # No granules
      add_collection_to_project('C179001887-SEDAC', '2000 Pilot Environmental Sustainability Index (ESI)')

      # 4 collections with granules
      add_collection_to_project('C179002914-ORNL_DAAC', '30 Minute Rainfall Data (FIFE)')
      add_collection_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')
      add_collection_to_project('C1000000000-ORNL_DAAC', 'A Compilation of Global Soil Microbial Biomass Carbon, Nitrogen, and Phosphorus Data')
      add_collection_to_project('C1234044620-GES_DISC', 'MLS/Aura Near-Real-Time L2 Nitric Acid (HNO3) Mixing Ratio V003 (ML2HNO3_NRT) at GES DISC')

      collection_results.click_link "View Project"

      wait_for_xhr
    end

    after :all do
      click_link("Back to Collection Search")
      reset_project
    end

    it 'displays a timeline containing the first three project collections that have granules' do
      timeline = page.find('#timeline svg')
      expect(timeline).to have_selector('.C179002914-ORNL_DAAC')
      expect(timeline).to have_selector('.C179003030-ORNL_DAAC')
      expect(timeline).to have_selector('.C1000000000-ORNL_DAAC')
    end

    it 'does not display collections without granules' do
      timeline = page.find('#timeline svg')

      expect(timeline).to have_no_selector('.C179001887-SEDAC')
    end

    it 'does not display more than three collections' do
      timeline = page.find('#timeline svg')
      expect(timeline).to have_no_selector('.C191370861-GSFCS4PA')
    end

    it 'displays times when the displayed collections have granules' do
      expect(page).to have_selector('#timeline .timeline-data rect')
    end

    context 'returning to the collection results list' do
      before :all do
        click_link("Back to Collection Search")
      end

      after :all do
        click_link("View Project")
      end

      it 'hides the timeline' do
        expect(page).to have_no_selector('#timeline')
      end
    end
  end

  context 'in the granule result list, coming from the collection results list' do
    use_collection('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')
    hook_granule_results

    it 'displays a timeline for the single focused collection' do
      timeline = page.find('#timeline svg')
      expect(timeline).to have_selector('.C179003030-ORNL_DAAC')
    end

    context 'returning to the collection results list' do
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
      add_collection_to_project('C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)')

      collection_results.click_link "View Project"
      view_granule_results('15 Minute Stream Flow Data: USGS (FIFE)', 'project-overview')
    end

    after :all do
      leave_granule_results('project-overview')
      click_link('Back to Collection Search')
      reset_project
    end

    it 'displays a timeline for the single focused collection' do
      timeline = page.find('#timeline svg')
      expect(timeline).to have_selector('.C179003030-ORNL_DAAC')
    end
  end

end
