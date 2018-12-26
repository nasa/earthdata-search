require 'rails_helper'

describe 'Visiting an Earthdata Search portal' do
  include Helpers::CollectionHelpers

  context 'on the home page of a portal with minimal configuration' do
    before :all do
      load_page :search, portal: 'simple', facets: true
    end

    it 'does not show an external logo link' do
      expect(page).to have_no_css('.portal-logo')
    end

    it 'does not show a navigation bar' do
      expect(page).to have_no_css('.main-nav')
    end

    it 'has a logo title the same as the portal id' do
      within '.site-logo' do
        expect(page).to have_content('Simple')
      end
    end

    it 'has a page title of "Earthdata Search"' do
      expect(page).to have_title('Earthdata Search')
    end
  end

  context 'on the home page of a portal with full configuration' do
    before :all do
      load_page :search, portal: 'complex', facets: true
    end

    it 'Loads the assets configured for that portal, updating scripts and styles accordingly' do
      expect(page).to have_text('Example Portal')
      expect(page).to have_link('Complex')
      expect(page).to have_link('Example Link')
      expect(page).to have_css('a[href="https://example.com/logo"]')
    end

    it 'shows an external logo link with custom image' do
      expect(page).to have_css('a.portal-logo img')
    end

    it 'shows a navigation bar with custom links' do
      expect(page).to have_css('.main-nav')
      expect(page).to have_link('Example Link')
    end

    it 'uses a supplied logo title' do
      within '.site-logo' do
        expect(page).to have_content('Complex')
      end
    end

    it 'uses page title augmented with the portal name' do
      expect(page).to have_title('Earthdata Search :: Complex Portal')
    end

    it 'runs supplied Javascript' do
      expect(page).to have_selector('#example-portal-banner')
    end
  end
end
