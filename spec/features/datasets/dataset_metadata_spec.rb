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
    page.should have_selector('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/datasets/C179460405-LPDAAC_ECS"]')
    page.should have_selector('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/datasets/C179460405-LPDAAC_ECS.atom"]')
    page.should have_selector('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/datasets/C179460405-LPDAAC_ECS.echo10"]')
    page.should have_selector('a[href="https://api.echo.nasa.gov/catalog-rest/echo_catalog/datasets/C179460405-LPDAAC_ECS.iso19115"]')
  end
end
