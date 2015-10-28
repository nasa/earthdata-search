require 'spec_helper'

describe "Viewing Projects", reset: false do
  context "when viewing list of saved projects" do
    before :all do
      Capybara.reset_sessions!
      load_page :search

      login

      create_project

      visit '/projects'
    end

    it "shows a list of saved projects" do
      expect(page).to have_content "Test Project 2 collections"
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
        click_link 'Remove Project'
        wait_for_xhr
      end

      after :all do
        create_project
        visit '/projects'
      end

      it "removes the project from the list" do
        expect(page).to have_no_content 'Test Project 2 collections'
        expect(page).to have_content 'No saved projects'
      end
    end

    context "when clicking the share button" do
      before :all do
        click_link "Share Project"
      end

      after :all do
        click_button 'Close'
      end

      it "shows a popover" do
        expect(page).to have_popover "Share Project"
      end

      it "shows the project url to be copied" do
        script = "$('#share-url').val();"
        url = page.evaluate_script script
        expect(url).to match(/\/search\/collections\?projectId=(\d+)$/)
      end

      it "highlights the url" do
        script = "window.getSelection().toString();"
        highlighted_text = page.evaluate_script script
        expect(highlighted_text).to match(/\/search\/collections\?projectId=(\d+)$/)
      end
    end

  end
end
