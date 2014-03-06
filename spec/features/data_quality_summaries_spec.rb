require 'spec_helper'

describe 'Data Quality Summaries', :reset => false do
  before :each do
    Capybara.reset_sessions!
    visit "/search"
    click_link 'Sign In'
    fill_in 'Username', with: 'edsc'
    fill_in 'Password', with: 'EDSCtest!1'
    click_button 'Sign In'
    wait_for_xhr

    dataset_id = 'C14758250-LPDAAC_ECS'
    dataset_title = 'ASTER L1A Reconstructed Unprocessed Instrument Data V003'
    add_dataset_to_project(dataset_id, dataset_title)
    dataset_id = 'C190733714-LPDAAC_ECS'
    dataset_title = 'ASTER L1B Registered Radiance at the Sensor V003'
    add_dataset_to_project(dataset_id, dataset_title)

    dataset_results.click_link "View Project"
    expect(page).to have_content "Project Datasets"
  end

  context "when dataset is added to a project" do
    it "shows a warning alert" do
      expect(page).to have_css ".alert-warning"
    end

    context "when clicking on DQS link" do
      before :each do
        within ".alert-warning" do
          click_link "click here"
        end
      end

      after :each do
        script = "edsc.page.ui.projectList.dataQualitySummaryModal(null)"
        page.execute_script script
      end

      it "displays data quality summary" do
        expect(page).to have_content "Data Quality Summary for ASTER L1A Reconstructed Unprocessed Instrument Data V003"
      end

      it "returns to project page when closing DQS modal" do
        within ".modal-header" do
          click_link "close"
        end
        expect(page).to have_no_content "Data Quality Summary for ASTER L1A Reconstructed Unprocessed Instrument Data V003"
      end

      context "when accepting data quality summary" do
        it "changes the warning to an info alert" do
          click_button "Accept"
          expect(page).to have_css ".alert-info"
        end
      end

    end

  end

  context "when removing a dataset from the project and adding it again" do
    it "remembers the user accepted the data quality summary" do
      within ".alert-warning" do
        click_link "click here"
      end
      click_button "Accept"

      first_project_dataset.click_link "Remove dataset from the current project"
      first_project_dataset.click_link "Remove dataset from the current project"

      click_link "Back to Dataset Search"

      dataset_id = 'C190733714-LPDAAC_ECS'
      dataset_title = 'ASTER L1B Registered Radiance at the Sensor V003'
      add_dataset_to_project(dataset_id, dataset_title)

      dataset_results.click_link "View Project"

      expect(page).to have_css ".alert-info"
    end
  end
end
