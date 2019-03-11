require 'rails_helper'

describe 'When viewing the project page' do
  before :all do
    load_page :projects_page, project: ['C1200240776-DEV08'], env: :sit, authenticate: 'edsc'
  end

  context 'When choosing to download a collection' do
    before :all do
      # Get the collection count here to use below when checking the number of links. As the data changes
      # so will this count and we don't want tests failing on simple data changes.
      collection_card = find('.project-list-item', match: :first)
      @granule_count = collection_card.find('.project-list-item-stat-granules').text.to_i

      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      choose('Direct Download')

      page.find_button('Download Data', disabled: false).click
      wait_for_xhr
    end

    it 'displays a link to download the links' do
      expect(page).to have_link('View/Download Data Links')
    end

    context 'When clicking the View/Download Data Link' do
      before :all do
        click_link('View/Download Data Links')
        wait_for_xhr
      end

      it 'displays granule urls returned from CMR' do
        within_window(-> { page.title == 'Earthdata Search - Download Granule Links' }) do
          expect(page).to have_content('Collection granule links have been retrieved')
        end
      end

      it 'displays the correct number of links from CMR' do
        within_window(-> { page.title == 'Earthdata Search - Download Granule Links' }) do
          expect(page).to have_css('#links li', count: @granule_count)
        end
      end
    end
  end
end
