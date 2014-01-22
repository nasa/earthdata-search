require "spec_helper"

describe "Project dataset list", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  before(:each) do
    within '#dataset-results-list > :first-child' do
      click_link "Add dataset to the current project"
    end

    within '#dataset-results-list > :nth-child(2)' do
      click_link "Add dataset to the current project"
    end

    click_link "View Project"
  end

  after(:each) do
    click_link "Back to Dataset Search"
    reset_project
  end

  it "displays datasets that have been added to the project" do
    expect(page).to have_css('#project-list .panel-list-item', count: 2)
  end

  it 'hides the "Browse Datasets" pane' do
  end

  it "provides navigation back to the dataset search" do
    expect(page).to have_no_text("Matching Datasets")
    expect(page).to have_link("Back to Dataset Search")
    click_link("Back to Dataset Search")
    expect(page).to have_text("Matching Datasets")
  end

  context 'when clicking on a dataset' do
    it "shows the dataset's details"
  end

  context 'when clicking the "Remove" button' do
    before(:each) do
      within '#project-list > :first-child' do
        click_link "Remove dataset from the current project"
      end
    end

    it "removes the selected dataset from the project list" do
      expect(page).to have_css('#project-list .panel-list-item', count: 1)
    end
  end
end
