require 'spec_helper'
require 'rake'

describe 'Background jobs ordering', reset: false do
  orderable_dataset_id = 'C179003030-ORNL_DAAC'
  orderable_dataset_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  before :all do
      Delayed::Worker.delay_jobs = true

      load_page :search, overlay: false
      login
      load_page 'data/configure', project: [orderable_dataset_id]
      wait_for_xhr

      choose 'Ftp_Pull'
      select 'FTP Pull', from: 'Offered Media Delivery Types'
      select 'Tape Archive Format (TAR)', from: 'Offered Media Format for FTPPULL'
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
