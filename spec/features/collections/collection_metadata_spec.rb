require 'spec_helper'

describe 'Collection metadata', reset: false do
  before do
    load_page :search
    fill_in 'keywords', with: 'AST_L1AE'
    find('li', text: 'ASTER Expedited L1A').click_link "View collection details"
    wait_for_xhr
  end

  it 'provides metadata in multiple formats' do
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.atom"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.echo10"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.iso19115"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.dif"]')
  end

  context 'when a logged in user views collection metadata' do
    before do
      login
      wait_for_xhr
    end

    it 'provides metadata in multiple formats with user tokens' do
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS?token=")]')
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.atom?token=")]')
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.echo10?token=")]')
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.iso19115?token=")]')
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.dif?token=")]')
    end
  end
end
