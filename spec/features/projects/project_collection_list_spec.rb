require "spec_helper"

describe "Project collection list", reset: true do

  before(:each) do
    load_page :search
    first_collection_result.click_link "Add collection to the current project"
    nth_collection_result(10).click_link "Add collection to the current project"

    collection_results.click_link "View Project"
  end

  it "displays collections that have been added to the project" do
    expect(project_overview).to have_css('.panel-list-item', count: 2)
  end

  it 'hides the "Browse Collections" pane' do
    expect(page).to have_css('#collections-overlay.is-master-overlay-parent-hidden')
  end

  it "provides navigation back to the collection search" do
    expect(page).to have_visible_project_overview
    expect(page).to have_link("Back to Collection Search")
    click_link("Back to Collection Search")
    expect(page).to have_visible_collection_results
  end

  context "when clicking on a collection's \"View collection details\" link" do
    it "shows the collection's details" do
      first_project_collection.click_link 'View collection details'
      expect(page).to have_visible_collection_details
      collection_details.click_link "Back to Collections"
      expect(page).to have_visible_project_overview
    end
  end

  context 'when clicking the "Remove" button' do
    before(:each) do
      first_project_collection.click_link "View collection"
      first_project_collection.click_link "Remove collection from the current project"
    end

    it "removes the selected collection from the project list" do
      expect(project_overview).to have_css('.panel-list-item', count: 1)
    end

    it "removes the selected collection's visualizations" do
      expect(project_overview).to have_no_link('Hide collection')
    end
  end

  context "when clicking the 'View collection' button" do
    before(:each) do
      first_project_collection.click_link "View collection"
    end

    it "highlights the selected collection" do
      expect(project_overview).to have_link('Hide collection', count: 1)
    end

    it "un-highlights the selected collection when clicking the button again" do
      first_project_collection.click_link "Hide collection"
      expect(project_overview).to have_no_link('Hide collection')
    end

    it "keeps the selected collection highlighted when returning to the project" do
      click_link "Back to Collection Search"
      sleep(1) # Wait for sliding transition
      collection_results.click_link "View Project"
      expect(project_overview).to have_link('Hide collection', count: 1)
    end

    it "highlights the View all collections button when individually showing all collections" do
      second_project_collection.click_link 'View collection'
      expect(project_overview).to have_link 'Hide all collections'
    end
  end

  context "when clicking the 'View all collections' button" do
    before :each do
      click_link 'View all collections'
    end

    it "highlights all project collections" do
      expect(project_overview).to have_css('.master-overlay-global-actions a.button-active', count: 1)
      expect(project_overview).to have_link('Hide collection', count: 2)
    end

    it "un-highlights all project collections when clicking the button again" do
      click_link 'Hide all collections'
      expect(project_overview).to have_no_link('Hide collection')
    end

    it "un-highlights the View all collections button when hiding an individual collection" do
      first_project_collection.click_link 'Hide collection'
      expect(project_overview). to have_no_link('Hide all collections')
    end
  end

end
