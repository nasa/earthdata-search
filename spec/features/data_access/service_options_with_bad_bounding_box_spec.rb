require 'spec_helper'
# require 'rake'

describe 'Service Options order with bad bounding_box', reset: false do
  collection_id = 'C190757121-NSIDC_ECS'
  granule_id = 'G190973506-NSIDC_ECS'

  context 'setting bounding box spatial query that will fail' do
    before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search
      login

      load_page 'data/configure', {focus: collection_id,
                                   granule_id: granule_id}

      choose 'Customize Product'

      check 'Enter bounding box'
      wait_for_xhr

      expect(page).to have_checked_field('Enter bounding box')
      fill_in 'Email Address', with: 'test@email.com'
      fill_in 'North', with: '10'
      fill_in 'West', with: '-75'
      fill_in 'East', with: '-70'
      fill_in 'South', with: '0'
      wait_for_xhr

      within '.access-item-actions' do
        click_on 'Continue'
      end
      click_on 'Submit'
      wait_for_xhr
    end

    after :all do
      Delayed::Worker.delay_jobs = false
    end

    it 'initially shows the order in the "Creating" state' do
      expect(page).to have_text('Creating')
    end

    context 'after the order fails', pending_updates: true do
      before :all do
        Delayed::Worker.new(quiet: false).work_off
      end

      it 'shows the order in the "Failed" state' do
        expect(page).to have_text('Failed')
      end

      it 'shows an error message saying the subsetting failed' do
        expect(page).to have_text('SubsetAreaNotInFile')
      end
    end
  end
end
