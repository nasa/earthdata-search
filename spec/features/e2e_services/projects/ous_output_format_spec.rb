require 'rails_helper'

describe 'When viewing the project page' do
  before :all do
    # This collection is specifically configured for this test on SIT. Any changes can
    # and should be made to this test file if needed
    load_page :projects_page, project: ['C1200187767-EDF_OPS'], bounding_box: [0, 30, 10, 40], env: :sit, authenticate: 'edsc'
  end

  context 'When selecting an output format for subsetting' do
    before :all do
      choose 'Customize (OPeNDAP)'

      select 'BINARY', from: 'output-format' # BINARY is `.dods`
    end

    context 'When choosing to download a collection' do
      before :all do
        page.find('.button-download-data').click
        wait_for_xhr
      end

      it 'displays a link to download the links' do
        expect(page).to have_link('View/Download Data Links')
      end

      context 'When clicking the View/Download Data Link' do
        before :all do
          @ous_link_window = window_opened_by do
            click_link('View/Download Data Links')
          end
          wait_for_xhr
        end

        it 'returns the links with the correct format' do
          within_window(@ous_link_window) do
            first_link = find('#links li:nth-child(1)')
            expect(first_link).to have_content('.hdf.dods?')
          end
        end
      end
    end
  end
end
