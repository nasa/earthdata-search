require 'rails_helper'

describe 'Portal parameters', reset: true do
  include Helpers::CollectionHelpers

  it 'Visiting Earthdata Search with /portal/<portal-id> displays an error if no portal is configured' do
    expect do
      visit '/?portal=does-not-exist'
      Capybara.reset_sessions! # Ensures the errors are raised
    end.to raise_error(ActionController::RoutingError)
  end

  it 'Visiting Earthdata Search with /portal/<portal-id> parameter preserves the portal filter across page and query transitions' do
    load_page :search, portal: 'simple', close_banner: true, facets: true
    expect(page_status_code).to eq(200)
    expect(page).to have_text('1 Matching Collection')

    fill_in 'keywords', with: 'AST'
    wait_for_xhr
    expect(page).to have_text('0 Matching Collections')

    fill_in 'keywords', with: 'MODIS'
    wait_for_xhr
    expect(page).to have_text('1 Matching Collection')
    expect(page).to have_path_prefix('/portal/simple/')

    find('a[class="site-logo"]').click
    expect(page).to have_path('/portal/simple/search')
  end

  context 'visiting a portal as a logged in user' do
    before :each do
      load_page :search, overlay: false, portal: 'simple', authenticate: 'edsc'
    end

    context 'and selecting the contact info page' do
      before :each do
        click_link 'Manage user account'
        click_link 'Contact Information'
      end

      it 'carries the portal parameter to the next page' do
        expect(page).to have_path_prefix('/portal/simple/')
      end
    end

    context 'and selecting the download status & history page' do
      before :each do
        click_link 'Manage user account'
        click_link 'Download Status & History'
      end

      it 'carries the portal parameter to the next page' do
        expect(page).to have_path_prefix('/portal/simple/')
      end
    end

    context 'and selecting the saved project page' do
      before :each do
        click_link 'Manage user account'
        click_link 'Saved Projects'
      end

      it 'carries the portal parameter to the next page' do
        expect(page).to have_path_prefix('/portal/simple/')
      end
    end

    context 'and logging out' do
      before :each do
        click_link 'Manage user account'
        click_link 'Logout'
      end

      it 'carries the portal parameter to the next page' do
        expect(page).to have_path_prefix('/portal/simple/')
      end
    end

    context 'and choosing to access data' do
      before :each do
        load_page :search, project: ['C203234523-LAADS'], portal: 'simple', authenticate: 'edsc'
        click_link('My Project')
        wait_for_xhr

        page.find_button('Download Data', disabled: false).click
        wait_for_xhr
      end

      it 'carries the portal parameter to the next page' do
        expect(page).to have_path_prefix('/portal/simple/')
      end
    end

    context 'and clicking the home page link' do
      before :each do
        click_on 'Browse Collections'
        within '#master-overlay-parent' do
          click_link 'Simple'
        end
      end

      it 'carries the portal parameter to the next page' do
        expect(page).to have_path_prefix('/portal/simple/')
      end
    end
  end
end
