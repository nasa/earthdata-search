require "spec_helper"

describe "Collection results", reset: false do
  before :all do
    load_page :search
  end

  after :each do
    click_on 'Clear Filters'
    wait_for_xhr
  end

  it "displays the first 20 collections when first visiting the page" do
    expect(page).to have_css('#collection-results-list .panel-list-item', count: 20)
  end

  it "loads more results when the user scrolls to the bottom of the current list" do
    expect(page).to have_css('#collection-results-list .panel-list-item', count: 20)
    page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 10000"
    wait_for_xhr

    expect(page).to have_css('#collection-results-list .panel-list-item', count: 40)

    # Reset
    load_page :search
  end

  it "does not load additional results after all results have been loaded" do
    fill_in "keywords", with: "AQUARIUS_SAC-D as"
    wait_for_xhr
    page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 10000"
    wait_for_xhr
    expect(page).to have_css('#collection-results-list .panel-list-item', count: 19)
    expect(page).to have_no_content('Loading collections...')
    page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 0"
  end

  it "displays thumbnails for collections which have stored thumbnail URLs" do
    fill_in "keywords", with: 'C32000-PODAAC'
    wait_for_xhr
    expect(page).to have_css("img.panel-list-thumbnail")
    expect(page).to have_no_text("No image available")
  end

  it "displays thumbnails for collections that have browse images in collection metadata" do
    fill_in "keywords", with: 'C138500-PODAAC'
    wait_for_xhr
    expect(page).to have_css("img.panel-list-thumbnail")
    expect(page).to have_no_text("No image available")
  end

  it "displays a badge for OPeNDAP-enabled collections" do
    fill_in "keywords", with: "C181553784-GSFCS4PA"
    wait_for_xhr
    expect(page).to have_css('.badge-opendap')
  end

  it "displays  for collections which have no thumbnail URLs" do
    fill_in "keywords", with: 'C179003030-ORNL_DAAC'
    wait_for_xhr
    expect(find('img.panel-list-thumbnail')['src']).to have_content("image-unavailable.svg")
  end

  # EDSC-145: As a user, I want to see how long my collection searches take, so that
  #           I may understand the performance of the system
  it "shows how much time the collection search took" do
    search_time_element = find('#collection-results .panel-list-meta')
    expect(search_time_element.text).to match(/Search Time: \d+\.\d+s/)
  end

  it "shows the temporal extent of collections whose data collection ended in the past" do
    expect(page).to have_content("1907-01-02 to 1952-08-11")
  end

  it "doesn't' show version_id for collections that don't have one" do
    fill_in "keywords", with: 'C1214605943-SCIOPS'
    wait_for_xhr
    expect(page).to have_no_content("vNot provided")
  end

  it "indicates if a collection's data collection is ongoing" do
    fill_in 'keywords', with: 'C1000000019-LANCEMODIS'
    wait_for_xhr
    expect(page).to have_content("2014-12-25 ongoing")
  end

  context 'when clicking the "View collection" button' do
    before(:each) do
      fill_in "keywords", with: 'C179003030-ORNL_DAAC'
      target_collection_result.click_link "View collection"
    end

    it 'highlights the "View collection" button' do
      expect(page).to have_css('#collection-results a[title="Hide collection"].button-active', count: 1)
    end

    context 'and clicking back' do
      before(:each) { target_collection_result.click_link "Hide collection" }

      it "un-highlights the selected collection" do
        expect(page).to have_no_css('#collection-results a[title="Hide collection"].button-active')
      end
    end
  end

  # Can't really test this feature - the browse scaler root url is set to a constant /assets/gibs-example.jpeg in test
  # environment.
  #
  # context 'viewing a testbed colleciton' do
  #   before :all do
  #     load_page :search, env: :sit, q: '2002 Environmental Sustainability Index (ESI)'
  #     wait_for_xhr
  #   end
  #
  #   it 'shows the testbed browse image url' do
  #     img = page.find('img.panel-list-thumbnail')
  #     expect(img['src']).to have_content('https://testbed.echo.nasa.gov/browse-scaler/browse_images/datasets/C1137-SEDAC?h=75&amp;w=75')
  #   end
  # end
end
