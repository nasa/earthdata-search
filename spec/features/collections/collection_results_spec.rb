require 'rails_helper'

describe 'Collection results' do
  before :all do
    load_page :search
  end

  it 'displays the first 20 collections when first visiting the page' do
    expect(page).to have_css('#collection-results-list .panel-list-item', count: 20)
  end

  # EDSC-145: As a user, I want to see how long my collection searches take, so that
  #           I may understand the performance of the system
  it 'shows how much time the collection search took' do
    search_time_element = find('.footer-content')

    expect(search_time_element.text).to match(/Search Time: \d+\.\d+s/)
  end

  context 'When collections do not have a version_id' do
    before do
      mock_get_collections('get_collections_without_version_id')
      fill_in 'keywords', with: 'C1234567890-EDSC'
      wait_for_xhr
    end

    it 'doesn\'t show version_id' do
      expect(page).to have_no_content('Not provided')
    end
  end

  context 'When collections are no longer collecting data' do
    before :all do
      fill_in 'keywords', with: 'C1443538967-NSIDC_ECS'
      wait_for_xhr
    end

    it 'shows the temporal extent of collections whose data collection ended in the past' do
      expect(page).to have_content('1979-01-01 to 2016-12-31')
    end
  end

  context 'When collections have ongoing data collection' do
    before :all do
      fill_in 'keywords', with: 'C1426717545-LANCEMODIS'
      wait_for_xhr
    end

    it 'indicates if a collection\'s data collection is ongoing' do
      expect(page).to have_content('2017-10-20 ongoing')
    end
  end

  context 'When collections have stored thumbnails' do
    before :all do
      fill_in 'keywords', with: 'C179003030-ORNL_DAAC'
      wait_for_xhr
    end

    it 'displays thumbnails for collections which have stored thumbnail URLs' do
      expect(page).to have_css('img.panel-list-thumbnail')
    end

    it 'does not display the no image available placeholder' do
      expect(page).to have_no_text('No image available')
    end
  end

  context 'When collections have browse images' do
    before :all do
      fill_in 'keywords', with: 'C1443538967-NSIDC_ECS'
      wait_for_xhr
    end

    it 'displays thumbnails for collections that have browse images in collection metadata' do
      expect(page).to have_css('img.panel-list-thumbnail')
    end

    it 'does not display the no image available placeholder' do
      expect(page).to have_no_text('No image available')
    end
  end

  # collection is gone
  context 'When collections have no thumbnail images' do
    before :all do
      fill_in 'keywords', with: 'C1426717545-LANCEMODIS'
      wait_for_xhr
    end

    it 'displays a placeholder image' do
      expect(find('img.panel-list-thumbnail')['src']).to have_content('image-unavailable.svg')
    end
  end
end
