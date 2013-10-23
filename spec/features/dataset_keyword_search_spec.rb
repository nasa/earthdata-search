require "spec_helper"

describe "Dataset keyword searches" do
  before do
    visit "/"
  end

  shared_browser_session do
    it "displays the first 10 dataset results" do
      fill_in "keywords", with: "A"
      expect(page).to have_css('#dataset-results .panel-list-item', count: 10)
    end

    it "displays dataset results matching a full keyword" do
      fill_in "keywords", with: "AST_L1A"
      expect(page).to have_content('ASTER L1A')
    end

    it "displays dataset results matching a partial keyword" do
      fill_in "keywords", with: "AST_L"
      expect(page).to have_content('ASTER L1A')
    end

    it "displays all datasets when keywords are cleared" do
      fill_in "keywords", with: ""
      expect(page).to have_content('15 Minute Stream')
    end

    it "does not match wildcard characters" do
      fill_in "keywords", with: "AST_L%"
      expect(page).to have_content('0 Matching Datasets')
    end
  end

end
