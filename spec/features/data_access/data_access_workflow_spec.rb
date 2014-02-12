require "spec_helper"

describe "Data Access workflow", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  before(:each) do
    click_link 'Sign In'
    fill_in 'Username', with: 'edsc'
    fill_in 'Password', with: 'EDSCtest!1'
    click_button 'Sign In'
    wait_for_xhr

    fill_in "keywords", with: "ASTER L1A"
    expect(page).to have_content('ASTER L1A')
    
    first_dataset_result.click_link "Add dataset to the current project"

    dataset_results.click_link "View Project"
  end

  after(:each) do
    reset_user
    visit "/search"
  end

  context "when the user is not logged in" do
    before(:each) do
      reset_user
      click_link "Retrieve project data"
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
    context "sends the project to the data access page" do
      it "shows granule information" do
        click_link "Retrieve project data"

        expect(page).to have_content "Data Access"
        expect(page).to have_content "ASTER L1A Reconstructed Unprocessed Instrument Data V003"
        expect(page).to have_content "2380016 Granules"
        expect(page).to have_content "> 0 bytes"
      end
    end
  end
end
