require 'rails_helper'

describe 'Viewing the granules panel' do
  context 'that is not in the users project' do
    before :all do
      load_page 'search/granules', focus: 'C1200187767-EDF_OPS', env: :sit
    end

    it 'displays the `Add to project` button' do
      within '.master-overlay-global-actions' do
        expect(page).to have_css('.add-to-project')
      end
    end

    context 'click the `Add to project` button' do
      before :all do
        click_link('Add to project')
      end

      it 'displays the `Remove from project` button' do
        within '.master-overlay-global-actions' do
          expect(page).to have_css('.remove-from-project')
        end
      end
    end
  end

  context 'that is in the users project' do
    before :all do
      load_page 'search/granules', focus: 'C1200187767-EDF_OPS', project: ['C1200187767-EDF_OPS'], env: :sit
    end

    it 'displays the `Remove from project` button' do
      within '.master-overlay-global-actions' do
        expect(page).to have_css('.remove-from-project')
      end
    end

    context 'clicking the `Remove from project` button' do
      before :all do
        click_link('Remove from project')
      end

      it 'displays the `Add to project` button' do
        within '.master-overlay-global-actions' do
          expect(page).to have_css('.add-to-project')
        end
      end
    end
  end
end
