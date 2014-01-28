require "spec_helper"

describe "Dataset results", :reset => false do
  before :all do
    Capybara.reset_sessions!
    visit "/search"
    # scrolling in these specs doesn't work unless the window is resized
    page.driver.resize_window(1000, 1000)
  end

  after :each do
    page.execute_script "$('#dataset-results .master-overlay-content')[0].scrollTop = 0"
    fill_in "keywords", with: " "
  end

  let(:ast_l1a_id) { 'C14758250-LPDAAC_ECS' }
  let(:airh2ccf_id) { 'C186815383-GSFCS4PA' }

  it "displays the first 20 datasets when first visiting the page" do
    expect(page).to have_css('#dataset-results .panel-list-item', count: 20)
  end

  it "loads more results when the user scrolls to the bottom of the current list" do
    expect(page).to have_css('#dataset-results .panel-list-item', count: 20)
    page.execute_script "$('#dataset-results .master-overlay-content')[0].scrollTop = 10000"
    expect(page).to have_css('#dataset-results .panel-list-item', count: 40)
  end

  it "does not load additional results after all results have been loaded" do
    fill_in "keywords", with: "AST"
    expect(page).to have_css('#dataset-results .panel-list-item', count: 20)
    page.execute_script "$('#dataset-results .master-overlay-content')[0].scrollTop = 10000"
    expect(page).to have_css('#dataset-results .panel-list-item', count: 23)
    expect(page).to have_no_content('Loading datasets...')
  end

  it "displays thumbnails for datasets which have stored thumbnail URLs" do
    fill_in "keywords", with: airh2ccf_id

    expect(page).to have_css("img.panel-list-thumbnail")
    expect(page).to have_no_text("No image available")
  end

  it "displays a placeholder for datasets which have no thumbnail URLs" do
    fill_in "keywords", with: ast_l1a_id

    expect(page).to have_no_css("img.panel-list-thumbnail")
    expect(page).to have_text("No image available")
  end

  it "hides and shows facets" do
    expect(page).to have_no_link('Browse Datasets')
    page.find('.master-overlay-hide-parent').click
    expect(page).to have_link('Browse Datasets')
    click_link 'Browse Datasets'
    expect(page).to have_no_link('Browse Datasets')
  end
end
