require 'spec_helper'

describe "Viewing Single Project", reset: false do

  context 'for a saved project' do
    before :all do
      Capybara.reset_sessions!
      load_page :search
      login
      visit_project
    end

    it 'shows project title' do
      expect(page).to have_css('.save-icon')
      expect(page).to have_css('h2', text:'Test Project')
    end
  end

  context 'fo an un-saved project' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, project: ['C14758250-LPDAAC_ECS']
      login
      click_link 'My Project'
    end

    it 'shows default project title' do
      expect(page).to have_css('h2', text:'Untitled Project')
      expect(page).to have_css('.save-icon')
    end
  end
end