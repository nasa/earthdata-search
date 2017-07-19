require 'spec_helper'

describe 'Collection metadata', reset: false do
  before do
    load_page :search
    fill_in 'keywords', with: 'AST_L1AE'
    find('li', text: 'ASTER Expedited L1A').click_link "View collection details"
    wait_for_xhr
    click_link 'Metadata Formats'
  end

  it 'provides metadata in multiple formats' do
    expect(page).to have_link('HTML')
    expect(page).to have_link('Native')
    expect(page).to have_link('ATOM')
    expect(page).to have_link('ECHO10')
    expect(page).to have_link('ISO19115')
    expect(page).to have_link('DIF')
  end

  context 'when a logged in user views collection metadata' do
    before do
      login
      wait_for_xhr
      click_link 'Metadata Formats'
    end

    it 'provides metadata in multiple formats without user tokens' do
      expect(page).not_to have_xpath('//a[contains(@href, ".html?token=")]')
      expect(page).not_to have_xpath('//a[contains(@href, ".atom?token=")]')
      expect(page).not_to have_xpath('//a[contains(@href, ".echo10?token=")]')
      expect(page).not_to have_xpath('//a[contains(@href, ".iso19115?token=")]')
      expect(page).not_to have_xpath('//a[contains(@href, ".dif?token=")]')
    end
  end
end
