require "spec_helper"

describe "Project dataset list", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  before(:each) do
    first_dataset_result.click_link "Add dataset to the current project"
    second_dataset_result.click_link "Add dataset to the current project"

    dataset_results.click_link "View Project"
  end

  after(:each) do
    reset_overlay
    reset_project
  end

  it "displays datasets that have been added to the project" do
    expect(page).to have_css('#project-datasets-list .panel-list-item', count: 2)
  end

  it 'hides the "Browse Datasets" pane' do
    expect(page).to have_css('#datasets-overlay.is-master-overlay-parent-hidden')
  end

  it "provides navigation back to the dataset search" do
    expect(page).to have_visible_project_overview
    expect(page).to have_link("Back to Dataset Search")
    click_link("Back to Dataset Search")
    expect(page).to have_visible_dataset_results
  end

  context 'when clicking on a dataset' do
    it "shows the dataset's details" do
      first_project_dataset.click
      expect(page).to have_visible_dataset_details
      dataset_details.click_link "Back to Datasets"
      expect(page).to have_visible_project_overview
    end
  end

  context 'when clicking the "Remove" button' do
    before(:each) do
      first_project_dataset.click_link "Remove dataset from the current project"
    end

    it "removes the selected dataset from the project list" do
      expect(page).to have_css('#project-datasets-list .panel-list-item', count: 1)
    end
  end

  context "when clicking the 'View dataset' button" do
    before(:each) do
      first_project_dataset.click_link "View dataset"
    end

    it "highlights the selected dataset" do
      expect(page).to have_css('#project-datasets-list .panel-list-item.view-dataset', count: 1)
    end

    it "un-highlights the selected dataset when clicking the button again" do
      first_project_dataset.click_link "View dataset"
      expect(page).to have_no_css('#project-datasets-list .panel-list-item.view-dataset')
    end

    it "keeps the selected dataset highlighted when returning to the project" do
      click_link "Back to Dataset Search"

      dataset_results.click_link "View Project"
      expect(page).to have_css('#project-datasets-list .panel-list-item.view-dataset', count: 1)
    end
  end

  context "when clicking the 'View all datasets' button" do
    before(:each) do
      click_link 'View all datasets'
    end

    it "highlights all project datasets" do
      expect(page).to have_css('#project-datasets-list .panel-list-item.view-dataset', count: 2)
    end

    it "un-highlights all project datasets when clicking the button again" do
      click_link 'View all datasets'
      expect(page).to have_no_css('#project-datasets-list .panel-list-item.view-dataset')
    end
  end

end
