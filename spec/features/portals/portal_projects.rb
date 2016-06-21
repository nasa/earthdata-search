require "spec_helper"

describe "Portal projects", reset: false do
  include Helpers::CollectionHelpers

  def visit_and_save(name, filters={})
    load_page :search, filters
    login
    click_link "Save your project"
    fill_in "workspace-name", with: "#{name}\t" #press tab to exit the input field
    click_save_project_name
  end


  before :all do
    Project.destroy_all
  end

  after :all do
    Project.destroy_all
  end

  context "Visiting an Earthdata Search portal, saving a project" do
    before :all do
      Capybara.reset_sessions!
      visit_and_save('from-portal', portal: 'simple')
    end

    context "visiting the main Earthdata Search site's project list" do
      before :all do
        load_page '/projects'
      end

      it "shows the saved project", acceptance: true do
        expect(page).to have_link('from-portal')
      end

      context "clicking on the project" do
        before :all do
          click_link 'from-portal'
        end

        it "returns the user to the portal", acceptance: true do
          expect(page).to have_path_prefix("/portal/simple")
        end
      end
    end
  end

  context "Visiting Earthdata Search, saving a project" do
    before :all do
      Capybara.reset_sessions!
      visit_and_save('from-main')
    end

    context "visiting an Earthdata Search portal's project list" do
      before :all do
        load_page '/projects', portal: 'simple'
      end

      it "shows the saved project", acceptance: true do
        expect(page).to have_link('from-main')
      end

      context "clicking on the project" do
        before :all do
          click_link 'from-main'
        end

        it "returns the user to the main site", acceptance: true do
          expect(page).to have_no_path_prefix("/portal/simple")
        end
      end
    end
  end
end
