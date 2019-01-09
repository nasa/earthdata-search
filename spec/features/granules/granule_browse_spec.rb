require 'rails_helper'

describe 'Granule browse display' do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search, authenticate: 'edsc'
  end

  context 'for granules with browse' do
    use_collection 'C14758250-LPDAAC_ECS'

    context 'viewing the granule list' do
      hook_granule_results('ASTER L1A Reconstructed Unprocessed Instrument Data V003')

      it 'displays browse thumbnails for each granule which link to the original browse image' do
        expect(granule_list).to have_css('a.panel-list-thumbnail-container img[src$="h=75&w=75"]')
      end

      context 'clicking on a granule result' do
        before :all do
          find('#granule-list-item-0').click
        end

        it 'displays a larger browse thumbnail on the map which links to the original browse image' do
          expect(page).to have_css('#map .granule-browse a img[src$="h=256&w=256"]')
        end

        context 'and returning to the search page with granule browse visible on the map' do
          before do
            click_on 'Back to Collections'
          end

          after do
            first_collection_result.click
          end

          it 'hides the granule browse' do
            expect(page).to have_no_css('.granule-browse a img[src$="h=256&w=256"]')
          end
        end
      end
    end
  end

  context 'for granules with no browse' do
    use_collection 'C179003030-ORNL_DAAC'

    context 'viewing the granule list' do
      hook_granule_results

      it 'displays no browse imagery or placeholders' do
        expect(granule_list).to have_no_css('.panel-list-thumbnail-container')
      end

      context 'clicking on a granule result' do
        it 'displays no browse thumbnail for that result' do
          expect(page).to have_no_css('.granule-browse')
        end
      end
    end
  end
end
