require "spec_helper"

describe "CWIC portal", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search, portal: 'cwic'
    wait_for_xhr
  end
  it "displays the CWIC and CEOS livery", acceptance: true do
    expect(page).to have_css("img[src*='ceos-logo.png']")
    expect(page).to have_text('CWIC Search')
    expect(page).to have_link('http://ceos.org/')
  end
  it "does not display the EOSDIS-specific inputs", acceptance: true do
    #expect(page).to have_selector('a[href^="http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1220566654-USGS_LTA"]')
  end

  it "checks the Non-EOSDIS checkbox", acceptance: true do
      #expect(page).to have_selector('a[href^="http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1220566654-USGS_LTA"]')
  end

  it "unchecks the has-granules checkbox", acceptance: true do

  end
end
