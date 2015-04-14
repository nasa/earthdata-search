require 'spec_helper'

describe 'Dataset metadata' do
  before do
    load_page :search
    fill_in 'keywords', with: 'AST_L1AE'
    find('li', text: 'ASTER Expedited L1A').click_link "View dataset details"
    wait_for_xhr
    click_link 'Metadata'
  end

  it 'provides metadata in multiple formats' do
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.atom"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.echo10"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.iso19115"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/C179460405-LPDAAC_ECS.dif"]')
  end
end
