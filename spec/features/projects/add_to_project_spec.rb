require "spec_helper"

describe "Add to project", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  context "in the dataset results list" do
    it 'displays "Add" buttons for datasets not in the current project' do
      within '#dataset-results-list > :first-child' do
        page.should have_link("Add dataset to the current project")
        page.should have_no_link("Remove dataset from the current project")
      end
    end

    it 'displays "Remove" buttons for datasets not in the current project' do
      within '#dataset-results-list > :first-child' do
        click_link "Add dataset to the current project"
        page.should have_no_link("Add dataset to the current project")
        page.should have_link("Remove dataset from the current project")
      end

      reset_project
    end

    context 'clicking on an "Add" button' do
      before(:all) do
        within '#dataset-results-list > :first-child' do
          click_link "Add dataset to the current project"
        end
      end

      after(:all) do
        reset_project
      end

      it 'adds the dataset to the current project' do
        expect(project_dataset_ids).to match_array(['15 Minute Stream Flow Data: USGS (FIFE)'])
      end

      it 'updates the button for the dataset to be a remove button' do
        within '#dataset-results-list > :first-child' do
          page.should have_no_link("Add dataset to the current project")
          page.should have_link("Remove dataset from the current project")
        end
      end

      # Pending EDSC-47
      it 'displays a summary of the datasets in the project'

      # Pending EDSC-48
      it 'displays a link to view the project'
    end

    context 'clicking on a "Remove" button' do
      before(:all) do
        within '#dataset-results-list > :first-child' do
          click_link "Add dataset to the current project"
          click_link "Remove dataset from the current project"
        end
      end

      after(:all) do
        reset_project
      end

      it 'removes the dataset from the current project' do
        expect(project_dataset_ids).to match_array([])
      end

      it 'updates the button for the dataset to be an add button' do
        within '#dataset-results-list > :first-child' do
          page.should have_link("Add dataset to the current project")
          page.should have_no_link("Remove dataset from the current project")
        end
      end

      context 'when the removed dataset was the last one in the project' do
        # Pending EDSC-47
        it 'removes the summary of the datasets in the project'

        # Pending EDSC-48
        it 'hides the link to view the project'
      end

      context 'when datasets remain in the project' do
        # Pending EDSC-47
        it 'updates the summary of the datasets in the project'

        # Pending EDSC-48
        it 'continues to show the link to view the project'
      end
    end
  end
end
