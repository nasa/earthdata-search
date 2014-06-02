require 'spec_helper'

describe 'Data Quality Summaries', :reset => false do
  def setup_project
    Capybara.reset_sessions!
    load_page :search # This load is necessary due to our failure to refresh the page on load
    login
    load_page :search, project: ['C14758250-LPDAAC_ECS', 'C190733714-LPDAAC_ECS'], view: :project
  end

  context "when dataset is added to a project" do
    before :all do
      setup_project
    end

    it "shows a warning alert" do
      expect(page).to have_css ".message-warning"
    end

    context "when clicking on DQS link" do
      before :each do
        within ".message-warning" do
          click_link "read and accept"
        end
      end

      after :each do
        script = "edsc.page.ui.projectList.dataQualitySummaryModal(null)"
        page.execute_script script
      end

      it "displays data quality summary" do
        expect(page).to have_content "Data Quality Summary for ASTER L1A Reconstructed Unprocessed Instrument Data V003"
        expect(page).to have_content "Data Quality Summary for ASTER L1B Registered Radiance at the Sensor V003"
      end

      it "returns to project page when closing DQS modal" do
        within ".modal-header" do
          click_link "close"
        end
        expect(page).to have_no_content "Data Quality Summary for ASTER L1A Reconstructed Unprocessed Instrument Data V003"
      end

      context "when accepting data quality summary" do
        it "changes the warning to an info message" do
          click_button "Accept"
          expect(page).to have_css ".message-info"
        end
      end

    end

  end

  context "when logging out, DQS acceptance persists" do
    before :all do
      setup_project
    end

    it "remembers the user accepted the data quality summary" do
      within ".message-warning" do
        click_link "read and accept"
      end
      click_button "Accept"
      wait_for_xhr

      setup_project
      expect(page).to have_css ".message-info"
    end
  end
end
