require 'spec_helper'

describe 'Data Access workflow', reset: false do
  context 'When the collection has granules to view' do
    before :all do
      load_page :search, project: ['C203234523-LAADS'], view: :project, temporal: ['2014-07-10T00:00:00Z', '2014-07-10T03:59:59Z']
      login

      click_button 'Download project data'
      wait_for_xhr
    end

    it 'displays a button to expand the granule list' do
      within '.granule-list' do
        expect(page).to have_link('Expand List')
      end
    end

    it 'displays an appropriate header for the granule list' do
      within '.granule-list' do
        expect(page).to have_css('h4', text: 'Granule List')
      end
    end

    context 'When the granule list is expanded' do
      before(:all) do
        click_link 'Expand List'
        wait_for_xhr
      end

      it 'displays granule information' do
        expect(page).to have_content 'MYD021KM.A2014191.0355.006.2014191161026.hdf'
      end

      context 'When scrolling to the bottom of the granule list' do
        before(:all) do
          page.execute_script '$(".granule-list div")[0].scrollTop = 10000'
          wait_for_xhr

          page.execute_script '$(".granule-list div")[0].scrollTop = 20000'
          wait_for_xhr
        end

        it 'displays more granules when scrolling' do
          expect(page).to have_css '.granule-list h5', count: 49
        end
      end
    end
  end
end
