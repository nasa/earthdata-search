require "spec_helper"

describe "Portal parameters", reset: true do
  include Helpers::CollectionHelpers

  it "Visiting Earthdata Search with /portal/<portal-id> displays an error if no portal is configured", acceptance: true do
    expect{
      visit "/?portal=does-not-exist"
      Capybara.reset_sessions! # Ensures the errors are raised
    }.to raise_error( ActionController::RoutingError)
  end

  it "Visiting Earthdata Search with /portal/<portal-id> parameter preserves the portal filter across page and query transitions", acceptance: true do
    load_page :search, portal: 'simple'
    expect(page.status_code).to eq(200)
    expect(page).to have_text("1 Matching Collection")

    fill_in "keywords", with: 'AST'
    wait_for_xhr
    expect(page).to have_text("0 Matching Collections")

    fill_in "keywords", with: 'MODIS'
    wait_for_xhr
    expect(page).to have_text("1 Matching Collection")
    expect(page).to have_path_prefix("/portal/simple/")

    within '#main-toolbar' do
      click_link "Simple"
    end
    expect(page).to have_path('/portal/simple/')

  end

  context "visiting a portal as a logged in user" do
    before :each do
      load_page :search, overlay: false, portal: 'simple'
      login
    end

    context "and selecting the contact info page" do
      before :each do
        click_link 'Manage user account'
        click_link 'Contact Information'
      end
      it "carries the portal parameter to the next page" do
        expect(page).to have_path_prefix("/portal/simple/")
      end
    end

    context "and selecting the recent retrievals page" do
      before :each do
        click_link 'Manage user account'
        click_link 'Recent Retrievals'
      end
      it "carries the portal parameter to the next page" do
        expect(page).to have_path_prefix("/portal/simple/")
      end
    end

    context "and selecting the saved project page" do
      before :each do
        click_link 'Manage user account'
        click_link 'Saved Projects'
      end
      it "carries the portal parameter to the next page" do
        expect(page).to have_path_prefix("/portal/simple/")
      end
    end

    context "and logging out" do
      before :each do
        click_link 'Manage user account'
        click_link 'Logout'
      end
      it "carries the portal parameter to the next page" do
        expect(page).to have_path_prefix("/portal/simple/")
      end
    end

    context "and choosing to access data" do
      before :each do
        downloadable_collection_id = 'C90762182-LAADS'
        load_page :search, project: [downloadable_collection_id], view: :project, portal: 'simple'
        click_link "Retrieve project data"
      end

      it "carries the portal parameter to the next page" do
        expect(page).to have_path_prefix("/portal/simple/")
      end
    end

    context "and clicking the home page link" do
      before :each do
        within '#main-toolbar' do
          click_link 'Simple'
        end
      end
      it "carries the portal parameter to the next page" do
        expect(page).to have_path_prefix("/portal/simple/")
      end
    end
  end
end
