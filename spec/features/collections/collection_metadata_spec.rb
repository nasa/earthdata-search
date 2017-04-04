require 'spec_helper'

describe 'Collection metadata', reset: false do
  before do
    load_page :search
    fill_in 'keywords', with: 'AST_L1AE'
    find('li', text: 'ASTER Expedited L1A').click_link "View collection details"
    wait_for_xhr
  end

  it 'provides metadata in multiple formats' do
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.html"]', :visible => false)
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.native"]', :visible => false)
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.atom"]', :visible => false)
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.echo10"]', :visible => false)
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.iso19115"]', :visible => false)
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.dif"]', :visible => false)
  end

  context 'when a logged in user views collection metadata' do
    before do
      login
      wait_for_xhr
    end

    it 'provides metadata in multiple formats with user tokens' do
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.html?token=")]', :visible => false)
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.native?token=")]', :visible => false)
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.atom?token=")]', :visible => false)
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.echo10?token=")]', :visible => false)
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.iso19115?token=")]', :visible => false)
      expect(page).to have_xpath('//a[contains(@href, "https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.dif?token=")]', :visible => false)
    end
  end
end
