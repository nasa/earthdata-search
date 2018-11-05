require 'spec_helper'

describe 'Viewing an un-saved Project' do
  before :all do
    load_page 'projects/new', project: ['C1200187767-EDF_OPS'], env: :sit, authenticate: 'edsc'
  end

  it 'displays the default project name' do
    within '.project-title-container' do
      expect(page).to have_content('Untitled Project')
    end
  end

  it 'displays a save project button' do
    within '.project-title-container' do
      expect(page).to have_css('.toolbar-button.save')
    end
  end

  context 'clicking the save project button' do
    before :all do
      within '.project-title-container' do
        page.find('.toolbar-button.save').click
      end
    end

    it 'displays the project name form' do
      expect(page).to have_field('workspace-name')
    end

    context 'providing a name and clicking `Save`' do
      before :all do
        fill_in 'workspace-name', with: 'EDSC NASA'

        click_button 'Save'

        wait_for_xhr
      end

      it 'displays the updated project name' do
        within '.project-title-container' do
          expect(page).to have_content('EDSC NASA')
        end
      end

      it 'shortens the url' do
        expect(query).to match(/^projectId=(\d+)$/)
      end
    end
  end
end
