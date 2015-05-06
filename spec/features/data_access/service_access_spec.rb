require 'spec_helper'

describe 'Services Access', reset: false do
  serviceable_dataset_id = 'C179014698-NSIDC_ECS'
  serviceable_dataset_title = 'AMSR-E/Aqua 5-Day L3 Global Snow Water Equivalent EASE-Grids V002'

  context 'when viewing data access with a serviceable dataset' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: [serviceable_dataset_id], view: :project
      login
      click_link "Retrieve project data"
      wait_for_xhr
    end

    it 'displays a service access method' do
      expect(page).to have_content('AE_5DSno.2 ESI Service')
    end

    context 'when selecting the service access method' do
      before :all do
        choose 'AE_5DSno.2 ESI Service'
      end

      it 'displays the service echoform' do
        expect(page).to have_field('Email Address')
        expect(page).to have_content('Reformat Output (Optional)')
      end
    end
  end
end
