require "spec_helper"

describe "CWIC portal", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    load_page :search, portal: 'cwic', facets: true
  end
  it 'displays the CWIC and CEOS livery' do
    expect(page).to have_css("img[src*='ceos-logo.png']")
    expect(page).to have_xpath("//a/img[contains(@src,'ceos-logo.png')]")
    expect(page).to have_text('CWIC Search')
  end
  it 'does not display the EOSDIS-specific inputs' do
    expect(page).to have_selector('input#hasNonEOSDIS', visible: false)
    expect(page).to have_selector('input#has-granules', visible: false)
  end

  it 'Sets up the collection check boxes appropriately for CWIC' do
    has_non_eosdis = find('input#hasNonEOSDIS', visible: false)
    expect(has_non_eosdis).to be_checked
    has_granules = find('input#has-granules', visible: false)
    expect(has_granules).not_to be_checked
  end
end
