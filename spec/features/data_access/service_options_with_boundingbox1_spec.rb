# EDSC-1233
# Some forms have boundingbox1 in their echoforms instead of boundingbox
# This was causing that field to be null in the service requests

require 'spec_helper'
require 'rake'

describe 'Service options order with boundingbox1 field', reset: false do
  collection_id = 'C1000000445-NSIDC_ECS'

  context 'when filling in spatial subsetting coordinates on data configure page' do
    before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search, focus: collection_id
      login
      wait_for_xhr

      first_granule_list_item.click_link "Download single granule data"
      choose 'Customize'

      check 'Enter bounding box'
      wait_for_xhr

      expect(page).to have_checked_field('Enter bounding box')
      fill_in 'Email Address', with: 'test@email.com'
      fill_in 'North', with: '-63'
      fill_in 'West', with: '-139'
      fill_in 'East', with: '-100'
      fill_in 'South', with: '-76'
      wait_for_xhr
    end

    after :all do
      Delayed::Worker.delay_jobs = false
    end

    it 'shows a map with the entered bounding box on it' do
      expect(page).to have_selector('.image-map')
      expect(page).to have_selector(".leaflet-overlay-pane path[stroke='#54F7A3']")
    end

    context 'placing a service order with a collection with a boundingbox1 field' do
      before :all do
        within '.access-item-actions' do
          # sleep 2
          click_on 'Continue'
        end
        click_on 'Submit'
        wait_for_xhr
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
end
