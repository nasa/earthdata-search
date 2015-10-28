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
    fill_in "keywords", with: "AST"
    wait_for_xhr
    page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 10000"
    wait_for_xhr
    expect(page).to have_css('#collection-results-list .panel-list-item', count: 36)
    expect(page).to have_no_content('Loading collections...')
    page.execute_script "$('#collection-results .master-overlay-content')[0].scrollTop = 0"
  end

  it "displays thumbnails for collections which have stored thumbnail URLs" do
    fill_in "keywords", with: 'C186815383-GSFCS4PA'
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

  it "displays a placeholder for collections which have no thumbnail URLs" do
    fill_in "keywords", with: 'C179003030-ORNL_DAAC'
    wait_for_xhr
    expect(page).to have_no_css("img.panel-list-thumbnail")
    expect(page).to have_text("No image available")
  end

  # EDSC-145: As a user, I want to see how long my collection searches take, so that
  #           I may understand the performance of the system
  it "shows how much time the collection search took" do
    search_time_element = find('#collection-results .panel-list-meta')
    expect(search_time_element.text).to match(/Search Time: \d+\.\d+s/)
  end

  it "shows the temporal extent of collections whose data collection ended in the past" do
    expect(page).to have_content("1984-12-25 to 1988-03-04")
  end

  it "indicates if a collection's data collection is ongoing" do
    expect(page).to have_content("1978-01-01 ongoing")
  end

  context 'when clicking the "View collection" button' do
    before(:all) do
      first_collection_result.click_link "View collection"
    end

    it 'highlights the "View collection" button' do
      expect(page).to have_css('#collection-results a[title="Hide collection"].button-active', count: 1)
    end

    context 'and clicking back' do
      before(:all) { first_collection_result.click_link "Hide collection" }

      it "un-highlights the selected collection" do
        expect(page).to have_no_css('#collection-results a[title="Hide collection"].button-active')
      end
    end
  end
end
