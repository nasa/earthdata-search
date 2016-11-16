require 'spec_helper'
require 'rake'

describe 'Service Options With MRT processing and reprojection', reset: false do
  collection_id = 'C107705227-LPDAAC_ECS'

  context 'setting MRT as processor and reprojecting as Geographic using WGS84 datum' do
    before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search, focus: collection_id
      login
      first_granule_list_item.click_link "Retrieve single granule data"
      wait_for_xhr

      choose 'MOD09A1.5 ESI Service'

      fill_in 'Email Address', with: "patrick+edsc@element84.com\t"
      select "MRT", from: "Select Processor"
      select "Geographic", from: "Re-projection Options"
      select "WGS84", from: "Datum:"

      click_on 'Continue'
      click_on 'Submit'
    end

    after :all do
      Delayed::Worker.delay_jobs = false
    end

    it 'initially shows the order in the "Creating" state' do
      expect(page).to have_text('Creating')
    end

    context 'after the order processes' do
      before :all do
        Delayed::Worker.new.work_off
      end

      it 'shows the order in the "Complete" state' do
        expect(page).to have_text('Complete')
      end
    end
  end
end
