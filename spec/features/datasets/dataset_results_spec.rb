require "spec_helper"

describe "Dataset results", reset: false do
  before :all do
    load_page :search
    # scrolling in these specs doesn't work unless the window is resized
    page.driver.resize_window(1280, 1024)
  end

  after :each do
    click_on 'Clear Filters'
    wait_for_xhr
  end

  it "displays the first 20 datasets when first visiting the page" do
    expect(page).to have_css('#dataset-results-list .panel-list-item', count: 20)
  end

  it "loads more results when the user scrolls to the bottom of the current list" do
    expect(page).to have_css('#dataset-results-list .panel-list-item', count: 20)
    page.execute_script "$('#dataset-results .master-overlay-content')[0].scrollTop = 10000"
    wait_for_xhr

    expect(page).to have_css('#dataset-results-list .panel-list-item', count: 40)

    # Reset
    load_page :search
  end

  it "does not load additional results after all results have been loaded" do
    fill_in "keywords", with: "AST"
    wait_for_xhr
    page.execute_script "$('#dataset-results .master-overlay-content')[0].scrollTop = 10000"
    wait_for_xhr
    expect(page).to have_css('#dataset-results-list .panel-list-item', count: 35)
    expect(page).to have_no_content('Loading datasets...')
    page.execute_script "$('#dataset-results .master-overlay-content')[0].scrollTop = 0"
  end

  it "displays thumbnails for datasets which have stored thumbnail URLs" do
    fill_in "keywords", with: 'C186815383-GSFCS4PA'
    wait_for_xhr
    expect(page).to have_css("img.panel-list-thumbnail")
    expect(page).to have_no_text("No image available")
  end

  it "displays a badge for OPeNDAP-enabled datasets" do
    fill_in "keywords", with: "C181553784-GSFCS4PA"
    wait_for_xhr
    expect(page).to have_css('.badge-opendap')
  end

  it "displays a placeholder for datasets which have no thumbnail URLs" do
    fill_in "keywords", with: 'C179003030-ORNL_DAAC'
    wait_for_xhr
    expect(page).to have_no_css("img.panel-list-thumbnail")
    expect(page).to have_text("No image available")
  end

  # EDSC-145: As a user, I want to see how long my dataset searches take, so that
  #           I may understand the performance of the system
  it "shows how much time the dataset search took" do
    search_time_element = find('#dataset-results .panel-list-meta')
    expect(search_time_element.text).to match(/Search Time: \d+\.\d+s/)
  end

  it "shows the temporal extent of datasets whose data collection ended in the past" do
    expect(page).to have_content("1984-12-25 to 1988-03-04")
  end

  it "indicates if a dataset's data collection is ongoing" do
    expect(page).to have_content("1978-01-01 ongoing")
  end

  context 'when clicking the "View dataset" button' do
    before(:all) do
      first_dataset_result.click_link "View dataset"
    end

    it 'highlights the "View dataset" button' do
      expect(page).to have_css('#dataset-results a[title="Hide dataset"].button-active', count: 1)
    end

    context 'and clicking back' do
      before(:all) { first_dataset_result.click_link "Hide dataset" }

      it "un-highlights the selected dataset" do
        expect(page).to have_no_css('#dataset-results a[title="Hide dataset"].button-active')
      end
    end
  end
end
