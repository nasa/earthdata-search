require 'spec_helper'

describe "Sharing Projects", reset: false do
  let(:query_re) { /^projectId=(\d+)$/ }

  before :all do
    Capybara.reset_sessions!
    visit '/'
    login

    # End the tour to set site preferences
    # and create the user in the database
    click_on 'End Tour'
    wait_for_xhr
  end

  context "when viewing a project that has been shared" do
    before :all do
      create_project
      logout

      project_id = Project.last.to_param
      visit "/search/datasets?projectId=#{project_id}"
      wait_for_xhr
    end

    after :all do
      logout
    end

    it "shows the contents of the project" do
      expect(page).to have_content 'You have 2 datasets in your project'
    end

    it "inflates the url" do
      expect(query).to_not match(query_re)
    end
  end

  context "when sharing a project with a long path" do
    project_id = nil

    before :all do
      path = '/search/datasets?p=!C179001887-SEDAC!C1000000220-SEDAC!C179001967-SEDAC!C179001889-SEDAC!C179001707-SEDAC!C179002048-SEDAC'
      user = User.first
      project = Project.new
      project.path = path
      project.name = "Test Project"
      project.user_id = user.id
      project.save!

      logout

      project_id = Project.last.to_param
      visit "/search/datasets?projectId=#{project_id}"
      wait_for_xhr
    end

    it "shows the contents of the project" do
      expect(page).to have_content 'You have 6 datasets in your project'
    end

    it "saves the path into a new project for the new user" do
      new_project_id = Project.last.to_param
      expect(project_id).to_not eq(new_project_id)
    end

    it "changes the url to include a new project id" do
      expect(page.current_url).to_not include(project_id)
    end
  end
end
