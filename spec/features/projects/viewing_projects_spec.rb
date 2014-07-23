require 'spec_helper'

describe "Viewing Projects", reset: false do
  context "when viewing list of saved projects" do
    path = '/search/datasets?p=!C179003030-ORNL_DAAC!C179001887-SEDAC'

    before :all do
      Capybara.reset_sessions!
      visit '/'
      login

      # End the tour to set site preferences
      # and create the user in the database
      click_on 'End Tour'
      wait_for_xhr

      user = User.first

      project = Project.new
      project.path = path
      project.name = "Test Project"
      project.user_id = user.id
      project.save!

      visit '/projects'
    end

    it "shows a list of saved projects" do
      expect(page).to have_content "Test Project 2 datasets"
    end

    context "when clicking on a project" do
      before :all do
        click_link "Test Project"
      end

      it "displays the selected project" do
        expect(page).to have_content('Test Project')
      end
    end
  end
end
