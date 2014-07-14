require 'spec_helper'

describe 'Granule metadata' do
  before do
    load_page :search
    fill_in 'keywords', with: 'AST_L1AE'
    wait_for_xhr
    first_dataset_result.click
    # Select a specific granule
    click_link 'Filter granules'
    fill_in 'granule_id', with: 'SC:AST_L1AE.003:2132811097'
    click_button 'Apply'
    wait_for_xhr
    first_granule_list_item.click_link('View details')
    wait_for_xhr
    click_link 'Metadata'
  end

  it 'provides metadata in multiple formats' do
    page.should have_selector('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/granules/G1002715372-LPDAAC_ECS"]')
    page.should have_selector('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/granules/G1002715372-LPDAAC_ECS.atom"]')
    page.should have_selector('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/granules/G1002715372-LPDAAC_ECS.echo10"]')
    page.should have_selector('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/granules/G1002715372-LPDAAC_ECS.iso19115"]')
  end
end
