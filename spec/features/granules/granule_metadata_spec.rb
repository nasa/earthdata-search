require 'spec_helper'

describe 'Granule metadata' do
  before do
    load_page :search
    fill_in 'keywords', with: 'C179003030-ORNL_DAAC'
    wait_for_xhr
    first_dataset_result.click
    # Select a specific granule
    click_link 'Filter granules'
    fill_in 'granule_id', with: 'FIFE_STRM_15M.80611715.s15'
    click_button 'Apply'
    wait_for_xhr
    first_granule_list_item.click_link('View granule details')
    wait_for_xhr
    click_link 'Metadata'
  end

  it 'provides metadata in multiple formats' do
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/G179111301-ORNL_DAAC"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/G179111301-ORNL_DAAC.atom"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/G179111301-ORNL_DAAC.echo10"]')
    expect(page).to have_selector('a[href="https://cmr.earthdata.nasa.gov/search/concepts/G179111301-ORNL_DAAC.iso19115"]')
  end
end
