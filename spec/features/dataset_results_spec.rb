require "spec_helper"

describe "Dataset results" do
  let(:ast_l1a_id) { 'C14758250-LPDAAC_ECS' }
  let(:airabrad_id) { 'C189399410-GSFCS4PA' }

  before do
    DatasetExtra.create!(echo_id: ast_l1a_id, thumbnail_url: 'http://example.com/thumbnail.jpg')

    visit "/search"
    # scrolling in these specs doesn't work unless the window is resized
    page.driver.resize_window(1000, 1000)
  end

  shared_browser_session do
    it "displays the first 10 datasets when first visiting the page" do
      expect(page).to have_css('#dataset-results .panel-list-item', count: 20)
    end

    it "loads more results when the user scrolls to the bottom of the current list" do
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
      fill_in "keywords", with: airabrad_id

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
      page.find('.master-overlay-parent-close').click
      expect(page).to have_link('Browse Datasets')
      click_link 'Browse Datasets'
      expect(page).to have_no_link('Browse Datasets')
    end
  end
end
