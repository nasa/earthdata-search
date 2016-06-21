require 'spec_helper'

describe 'Ordering without order options', reset: false do
  orderable_collection_id = 'C4543622-LARC_ASDC'
  orderable_collection_title = 'CER_SSF_Terra-FM1-MODIS_Edition3A'

  before :all do
    Capybara.reset_sessions!
    load_page :search, overlay: false
    login
    load_page 'data/configure', {project: [orderable_collection_id],
                                 temporal: ['2014-10-01T00:00:00Z', '2014-10-02T00:00:01Z']}
    wait_for_xhr

    choose 'Order'
    click_on 'Continue'
    click_on 'Submit'
  end

  it "displays a link to return to search results" do
    expect(page).to have_link("Back to Data Access Options")
    expect(page).to have_css("a[href^=\"/data/configure?\"]")
  end

  it "displays information on obtaining data asynchronously" do
    expect(page).to have_content('The following collections are being processed')
    expect(page).to have_content(orderable_collection_title)
  end

  it "indicates current order status", pending_fixtures: true do
    expect(page).to have_text('Submitting')
  end

  it "provides a link to cancel the order", pending_fixtures: true do
    expect(page).to have_link("Cancel")
  end

end
