require 'spec_helper'

describe "Viewing Projects", reset: false do

  def create_project
    path = '/search/datasets?p=!C179003030-ORNL_DAAC!C179001887-SEDAC'
    user = User.first
    project = Project.new
    project.path = path
    project.name = "Test Project"
    project.user_id = user.id
    project.save!
  end

  context "when viewing list of saved projects" do
    before :all do
      Capybara.reset_sessions!
      visit '/'
      login

      # End the tour to set site preferences
      # and create the user in the database
      click_on 'End Tour'
      wait_for_xhr

      create_project

      visit '/projects'
    end

    it "shows a list of saved projects" do
      expect(page).to have_content "Test Project 2 datasets"
    end

    context "when clicking on a project" do
      before :all do
        click_link "Test Project"
      end

      after :all do
        visit '/projects'
      end

      it "displays the selected project" do
        expect(page).to have_content('Test Project')
      end
    end

    context "when clicking on the remove button" do
      before :all do
        click_link 'remove'
      end

      after :all do
        create_project
        visit '/projects'
      end

      it "removes the project from the list" do
        expect(page).to have_no_content 'Test Project 2 datasets'
        expect(page).to have_content 'No saved projects'
      end
    end
  end
end
