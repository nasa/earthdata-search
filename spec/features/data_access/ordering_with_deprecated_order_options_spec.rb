require 'spec_helper'

describe 'Ordering with deprecated order options', reset: false do
  orderable_collection_id = 'C179002914-ORNL_DAAC'
  orderable_collection_title = '30 Minute Rainfall Data (FIFE)'
  granule_id = 'G179106792-ORNL_DAAC'

  before :all do
    Capybara.reset_sessions!
    load_page :search, overlay: false
    login
    load_page 'data/configure', {project: [orderable_collection_id],
                                 granule_id: [granule_id]}
    wait_for_xhr
  end

  it "displays a radio button 'Order'" do
    within(:css, '.access-item-selection') do
      expect(page).to have_text('Order')
    end
  end

  it "hides deprecated order options" do
    within(:css, '.access-item-selection') do
      expect(page).to have_no_text('Ftp_Pull')
    end
  end

  context "and proceeding to the retrieval page" do
    before :all do
      Delayed::Worker.delay_jobs = true

      choose "Order"
      click_on 'Continue'
      click_on 'Submit'
      wait_for_xhr

      expect(page).to have_text('Creating')
    end

    after :all do
      Delayed::Worker.delay_jobs = false
    end

    it "completes the order without dropping any granules" do
      expect(Delayed::Worker.new.work_off).to  eq([1, 0])
      load_page "data/retrieve/#{Retrieval.last.to_param}"

      expect(page).to have_text('Submitting')
      expect(page).to have_no_text('The following granules will not be processed')
    end
  end
end
