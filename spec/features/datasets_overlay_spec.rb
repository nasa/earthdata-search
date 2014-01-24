require 'spec_helper'

describe 'Datasets overlay', :reset => false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  after(:each) do
    reset_overlay
    reset_project
  end

  it "shows dataset details when clicking on a dataset" do
    expect(page).to have_visible_dataset_results
    expect(page).to_not have_visible_dataset_details

    first_dataset_result.click

    expect(page).to_not have_visible_dataset_results
    expect(page).to have_visible_dataset_details
  end

  context "after returning to the dataset list from the project view" do
    before(:all) do
      first_dataset_result.click_link "Add dataset to the current project"
      second_dataset_result.click_link "Add dataset to the current project"
      dataset_results.click_link "View Project"
      project_overview.click_link "Back to Dataset Search"
    end

    it "shows dataset details when clicking on a dataset" do
      first_dataset_result.click
      expect(page).to have_visible_dataset_details
    end
  end
end
