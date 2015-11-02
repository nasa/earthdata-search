require 'spec_helper'
require 'rake'

describe 'Background jobs ordering', reset: false do
  orderable_collection_id = 'C90762182-LAADS'
  orderable_collection_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'

  before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search, overlay: false
      login
      load_page 'data/configure', project: [orderable_collection_id]
      wait_for_xhr

      choose 'FtpPushPull'
      select 'FtpPull', from: 'Distribution Options'
      click_on 'Continue'

      # Confirm address
      click_on 'Submit'
  end

  after :all do
    Delayed::Worker.delay_jobs = false
    run_stop_task
  end

  it 'indicates current order status' do
    expect(page).to have_text('Creating')
  end

  context 'after allowing the background job time to process order' do
    before :all do
      expect(Delayed::Worker.new.work_off).to  eq([1, 0])
      load_page "data/retrieve/#{Retrieval.last.to_param}"
    end

    it 'indicates current order status' do
      expect(page).to have_text('Not Validated')
    end
  end
end
