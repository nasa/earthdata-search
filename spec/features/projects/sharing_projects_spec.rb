require 'rails_helper'

describe 'Sharing Projects' do
  context 'the stored path has less characters than the `url_limit` configuration' do
    before :all do
      Capybara.reset_sessions!

      # Create a randome user that we'll set as the creator of the project to be shared
      user = User.create(echo_id: SecureRandom.uuid.upcase, site_preferences: {})

      @path = '/search/collections?cmr_env=sit&p=!C1200187767-EDF_OPS'
      project = Project.new
      project.path = @path
      project.name = 'Project for sharing'
      project.user_id = user.id
      project.save!

      # Login as our test user so that we can load the page to test actual functionality
      be_logged_in_as('edsc')

      @project_id = project.to_param

      load_page "/search/collections?projectId=#{project.to_param}"
    end

    it 'shows the contents of the project' do
      expect(page).to have_content 'You have 1 collection in your current Project'
    end

    it 'extracts the url from the project' do
      # As long as the url is shorter than the `url_limit` configuration we
      # simply extract the path from the project and set the url
      expect(page.current_url).to have_content(@path)
    end

    it 'does not create a new project' do
      # Given the default scope applied to Project the `first` object
      # should still be the same as it was in the before filter
      expect(@project_id).to eq(Project.first.to_param)
    end
  end

  context 'the stored path has more characters than the `url_limit` configuration' do
    before :all do
      Capybara.reset_sessions!

      # Create a randome user that we'll set as the creator of the project to be shared
      user = User.create(echo_id: SecureRandom.uuid.upcase, site_preferences: {})

      project = Project.new
      project.path = '/search/collections?cmr_env=sit&p=!C179001887-SEDAC!C1000000220-SEDAC!C179001967-SEDAC!C179001889-SEDAC!C179001707-SEDAC!C179002107-SEDAC!C179002147-SEDAC!C1000000000-SEDAC'
      project.name = '[LONG] Project for sharing'
      project.user_id = user.id
      project.save!

      @project_id = project.to_param

      # Login as our test user so that we can load the page to test actual functionality
      load_page "/search/collections?projectId=#{@project_id}", authenticate: 'edsc'

      # Default scope sorts Projects by updated_at meaning that the most recently
      # updated project will be returned first
      @new_project_id = Project.first.to_param
    end

    it 'shows the contents of the project' do
      expect(page).to have_content 'You have 8 collections in your current Project'
    end

    it 'saves the path into a new project for the new user' do
      # Given the default scope applied to Project the `first` object
      # should not be the same as our before filter, the code should have
      # created a new one
      expect(@project_id).to_not eq(@new_project_id)
    end

    it 'updates the url to the new project created for the user' do
      expect(page.current_url).to have_content("projectId=#{@project_id}")
    end
  end
end
