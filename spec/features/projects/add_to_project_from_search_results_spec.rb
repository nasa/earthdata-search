require 'spec_helper'

describe 'Searching for a collection', reset: false do
  context 'that is not in the users project' do
    before :all do
      load_page :search, q: 'C1200187767-EDF_OPS', env: :sit
    end

    it 'dislays one collection' do
      within '#collection-results-list' do
        expect(page).to have_css('li.panel-list-item', count: 1)
      end
    end

    it 'hides the `My Project` button' do
      within '.toolbar-secondary' do
        expect(page).not_to have_link('My Project')
      end
    end

    it 'displays the `+` (Add collection to project) button' do
      within '#collection-results-list' do
        expect(page.first('.panel-list-item')).to have_css('.add-to-project')
      end
    end

    context 'clicking the `+` button' do
      before :all do
        within '#collection-results-list' do
          page.first('.panel-list-item .add-to-project').click
        end
      end

      it 'shows the `My Project` button' do
        within '.toolbar-secondary' do
          expect(page).to have_link('My Project')
        end
      end

      it 'displays the `-` (Add collection to project) button' do
        within '#collection-results-list' do
          expect(page.first('.panel-list-item')).to have_css('.remove-from-project')
        end
      end
    end
  end

  context 'that is in the users project' do
    before :all do
      load_page :search, q: 'C1200187767-EDF_OPS', project: ['C1200187767-EDF_OPS'], env: :sit
    end

    it 'dislays one collection' do
      within '#collection-results-list' do
        expect(page).to have_css('li.panel-list-item', count: 1)
      end
    end

    it 'shows the `My Project` button' do
      within '.toolbar-secondary' do
        expect(page).to have_link('My Project')
      end
    end

    it 'displays the `-` (Add collection to project) button' do
      within '#collection-results-list' do
        expect(page.first('.panel-list-item')).to have_css('.remove-from-project')
      end
    end

    context 'clicking the `-` button' do
      before :all do
        within '#collection-results-list' do
          page.first('.panel-list-item .remove-from-project').click
        end
      end

      it 'hides the `My Project` button' do
        within '.toolbar-secondary' do
          expect(page).not_to have_link('My Project')
        end
      end

      it 'displays the `+` (Add collection to project) button' do
        within '#collection-results-list' do
          expect(page.first('.panel-list-item')).to have_css('.add-to-project')
        end
      end
    end
  end
end
