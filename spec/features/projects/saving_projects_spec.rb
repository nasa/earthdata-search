require 'spec_helper'

describe 'Viewing an un-saved Project' do
  before :all do
    load_page 'projects/new', project: ['C1200187767-EDF_OPS'], env: :sit, authenticate: 'edsc'
  end

  it 'displays the default project name' do
    within '.master-overlay-content-header-project' do
      expect(page).to have_content('Untitled Project')
    end
  end

  it 'displays a edit project button' do
    within '.master-overlay-content-header-project' do
      expect(page).to have_css('.editable-text-button-edit')
    end
  end

  context 'clicking the edit project button' do
    before :all do
      within '.master-overlay-content-header-project' do
        page.find('.editable-text-button-edit').click
      end
    end

    it 'displays the project name form' do
      expect(page).to have_css('input.editable-text-input')
    end

    context 'providing a name and clicking `Save`' do
      before :all do
        within '.master-overlay-content-header-project' do
          find('.editable-text-input').set('EDSC NASA')

          page.find('.editable-text-button-submit').click
        end

        wait_for_xhr
      end

      it 'displays the updated project name' do
        within '.master-overlay-content-header-project' do
          expect(page).to have_content('EDSC NASA')
        end
      end

      it 'shortens the url' do
        expect(query).to match(/^projectId=(\d+)$/)
      end
    end
  end
end
