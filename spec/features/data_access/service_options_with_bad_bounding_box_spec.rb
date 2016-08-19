require 'spec_helper'
require 'rake'

describe 'Service Options order with bad bounding_box', reset: false do
  collection_id = 'C1236303846-NSIDC_ECS'
  granule_id = 'G1286230578-NSIDC_ECS'

  context 'setting bounding box spatial query that will fail' do
    before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search
      login

      load_page 'data/configure', {project: [collection_id],
                                   granule_id: granule_id}

      choose 'SPL2SMP.3 ESI Service'

      check 'Enter bounding box'
      wait_for_xhr

      expect(page).to have_checked_field('Enter bounding box')
      fill_in 'Email Address', with: 'test@email.com'
      fill_in 'North', with: '42'
      fill_in 'West', with: '-120'
      fill_in 'East', with: '-115'
      fill_in 'South', with: '40'
      wait_for_xhr

      within '.access-item-actions' do
        sleep 2
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

    context 'after the order fails' do
      before :all do
        Delayed::Worker.new.work_off
        # expect(Delayed::Worker.new.work_off).to  eq([1, 0])
        # load_page "data/retrieve/#{Retrieval.last.to_param}"
      end

      it 'shows the order in the "Failed" state' do
        synchronize(120) do
          expect(page).to have_text('Failed')
        end
        Capybara::Screenshot.screenshot_and_save_page
      end

      it 'shows an error message saying the subsetting failed' do
        expect(page).to have_text('NoMatchingData-Subsetting was unsuccessful; no output files were produced. No data found that matched the subset constraints.')
      end
    end
  end
end
