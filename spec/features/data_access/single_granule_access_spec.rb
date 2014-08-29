require 'spec_helper'

describe 'Single Granule Data Access', reset: false do
  downloadable_dataset_id = 'C183451156-GSFCS4PA'

  context 'when the user is not logged in' do
    before(:each) do
      load_page :search, project: [downloadable_dataset_id], view: :project
      wait_for_xhr
      first_project_dataset.click
      first_granule_list_item.click_link "Retrieve data"
    end

    after :each do
      Capybara.reset_sessions!
    end

    it 'forces the user to login before showing data access page' do
      expect(page).to have_content('EOSDIS User Registration System')
    end
  end

  context 'when the user is logged in' do
    before :all do
      load_page :search, project: [downloadable_dataset_id], view: :project
      login
      wait_for_xhr
      first_project_dataset.click
      first_granule_list_item.click_link "Retrieve data"
      wait_for_xhr
    end

    after :all do
      Capybara.reset_sessions!
    end

    it 'only configures one granule' do
      expect(page).to have_content "1 Granule"
    end

    it 'limits the data access to only the selected granule' do
      click_link 'Expand List'
      expect(page).to have_content 'AIRS3STM.005:AIRS.2014.05.01.L3.RetStd_IR031.v5.0.14.0.G14153132853.hdf'
    end
  end
end
