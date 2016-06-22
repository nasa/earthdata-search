require 'spec_helper'

describe 'Saving Projects', reset: false do
  context 'when adding a name to a project' do
    let(:path) { '/search/collections?p=!C1229626387-LANCEMODIS!C1219032686-LANCEMODIS' }
    let(:query_re) { /^projectId=(\d+)$/ }

    before :all do
      Capybara.reset_sessions!
      load_page :search
      login

      second_featured_collection.click_link "Add collection to the current project"
      first_featured_collection.click_link "Add collection to the current project"
      click_link "Save your project"
      fill_in "workspace-name", with: "Test Project\t" #press tab to exit the input field
      click_save_project_name
    end

    it "shortens the url" do
      expect(query).to match(query_re)
      expect(Project.find(project_id).path).to eql(path)
    end

    it "shows the project name" do
      expect(page).to have_content('Test Project')
    end

    context "when renaming the project" do
      before :all do
        click_link "Test Project"
        fill_in "workspace-name", with: "Test Project 2\t"
        click_save_project_name
      end

      it "keeps the same short url" do
        expect(query).to match(query_re)
        expect(Project.find(project_id).path).to eql(path)
      end

      it "shows the new project name" do
        expect(page).to have_content('Test Project 2')
      end
    end

    context "when loading the named project" do
      before :each do
        project = create_project(path)

        visit "/search/collections?projectId=#{project.to_param}"
        wait_for_xhr
      end

      it "shows the project name" do
        expect(page).to have_content('Test Project')
      end
    end
  end
end
