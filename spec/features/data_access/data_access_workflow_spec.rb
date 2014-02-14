require "spec_helper"

describe "Data Access workflow", reset: false do
  original_wait_time = nil

  downloadable_dataset_id = 'C179003030-ORNL_DAAC'
  downloadable_dataset_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  non_downloadable_dataset_id = 'C179001887-SEDAC'
  non_downloadable_dataset_title = '2000 Pilot Environmental Sustainability Index (ESI)'

  before(:all) do
    original_wait_time = Capybara.default_wait_time
    Capybara.default_wait_time = 30 # Ugh, so slow

    Capybara.reset_sessions!
    visit "/search"

    click_link 'Sign In'
    fill_in 'Username', with: 'edsc'
    fill_in 'Password', with: 'EDSCtest!1'
    click_button 'Sign In'
    wait_for_xhr
  end

  after(:all) do
    reset_user
    visit "/search"
    Capybara.default_wait_time = original_wait_time
  end

  context "when the user is not logged in" do
    before(:each) do
      reset_user
      add_dataset_to_project(downloadable_dataset_id, downloadable_dataset_title)
      add_dataset_to_project(non_downloadable_dataset_id, non_downloadable_dataset_title)

      dataset_results.click_link "View Project"
      click_link "Retrieve project data"
    end

    after :each do
      visit "/search"
    end

    after :all do
      reset_user
      click_link 'Sign In'
      fill_in 'Username', with: 'edsc'
      fill_in 'Password', with: 'EDSCtest!1'
      click_button 'Sign In'
    end

    it "forces the user to login before showing data access page" do
      fill_in 'Username', with: 'edsc'
      fill_in 'Password', with: 'EDSCtest!1'
      click_button 'Sign In'
      wait_for_xhr

      expect(page).to have_content "Data Access"
    end

    it "does not show data access page with unsuccessful login" do
      fill_in 'Username', with: 'test'
      click_button 'Sign In'

      expect(page).to have_content "Password can't be blank"
    end
  end

  context "when the user is logged in" do
    before(:all) do
      add_dataset_to_project(downloadable_dataset_id, downloadable_dataset_title)
      add_dataset_to_project(non_downloadable_dataset_id, non_downloadable_dataset_title)

      dataset_results.click_link "View Project"
      click_link "Retrieve project data"
    end

    after :all do
      visit "/search"
    end

    context "when displaying options for the first of multiple datasets" do
      after :all do
        script = "edsc.page.ui.serviceOptionsList.activeIndex(0);edsc.page.project.datasets()[0].serviceOptions.accessMethod(null);"
        page.evaluate_script script
      end

      it "displays granule information" do
        expect(page).to have_content "39 Granules"
        expect(page).to have_content "252.9 Kilobytes"
      end

      it 'displays a "continue" button' do
        expect(page).to have_content "Continue"
      end

      it 'displays no "back" button' do
        within(".data-access-content") do
          expect(page).to have_no_content "Back"
        end
      end

      context 'and clicking the "continue" button' do
        before :all do
          choose "Download"
          click_button "Continue"
        end

        it 'displays the next dataset in the list' do
          expect(page).to have_content "Dataset Only"
        end
      end
    end

    context "when displaying options for the last of multiple datasets" do
      before :all do
        choose "Download"
        click_button "Continue"
      end

      after :all do
        script = "edsc.page.ui.serviceOptionsList.activeIndex(0);edsc.page.project.datasets()[0].serviceOptions.accessMethod(null);"
        page.evaluate_script script
      end

      it "displays granule information" do
        expect(page).to have_content "Dataset Only"
      end

      it 'displays a "submit" button' do
        expect(page).to have_content "Submit"
      end

      it 'displays a "back" button' do
        within(".data-access-content") do
          expect(page).to have_content "Back"
        end
      end

      context 'and clicking the "back" button' do
        before :all do
          click_button "Back"
        end

        it 'displays the previous dataset in the list' do
          expect(page).to have_content "39 Granules"
          expect(page).to have_content "252.9 Kilobytes"
        end
      end
    end
  end

end
