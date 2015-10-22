require 'spec_helper'

describe 'Ordering with deprecated order options', reset: false do
  orderable_dataset_id = 'C179002914-ORNL_DAAC'
  orderable_dataset_title = '30 Minute Rainfall Data (FIFE)'
  granule_id = 'G179106792-ORNL_DAAC'

  before :all do
    Capybara.reset_sessions!
    load_page :search, overlay: false
    login
    load_page 'data/configure', {project: [orderable_dataset_id],
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
end
