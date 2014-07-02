require "spec_helper"

describe "Dataset keyword searches", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    load_page :search
  end

  # TODO: This should be in an after(:each) block, but it is too slow
  #       because of DOM manipulations when clearing temporal.  Partial
  #       fix is in EDSC-19
  after(:all) do
    reset_search
  end

  it "displays the first 20 dataset results" do
    fill_in "keywords", with: "A"
    expect(page).to have_css('#dataset-results-list .panel-list-item', count: 20)
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
    fill_in "keywords", with: " "
    expect(page).to have_content('15 Minute Stream')
  end

  it "do not match wildcard characters" do
    fill_in "keywords", with: "AST_L%"
    expect(page).to have_no_css('#dataset-results .panel-list-item')
  end
end
