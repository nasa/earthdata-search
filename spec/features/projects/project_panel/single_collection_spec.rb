require 'rails_helper'

describe 'Project with one collections' do
  context 'when viewing the project page', order: :defined do
    before :all do
      Capybara.reset_sessions!
      load_page :projects_page,  project: ['C1200187767-EDF_OPS'], env: :sit, authenticate: 'edsc'

    end

    activePanel = '.master-overlay-panel-group-active #C1200187767-EDF_OPS_edit-options.master-overlay-panel-item-active'

    it 'opens the panel on load' do
      expect(page).to have_selector('.master-overlay-panel-group-active #C1200187767-EDF_OPS_edit-options.master-overlay-panel-item-active', visible: true)
    end

    it 'does not show a back button' do
      within(activePanel) do
        expect(page).to have_no_selector('.master-overlay-panel-pagination-back', visible: true)
      end
    end

    it 'does not show a next button' do
      within(activePanel) do
        expect(page).to have_no_selector('.master-overlay-panel-pagination-next', visible: true)
      end
    end

    it 'shows a done button' do
      within(activePanel) do
        expect(page).to have_selector('.master-overlay-panel-pagination-done', visible: true)
      end
    end

    it 'shows pagination' do
      within(activePanel) do
        pagination = find('.master-overlay-panel-footer-page')
        expect(pagination).to have_content('Collection 1 of 1')
      end
    end

    context 'when no access method is selected' do
      it 'shows a "warning" icon' do
        within(activePanel) do
          expect(page).to have_selector('.master-overlay-panel-footer-icon-invalid', visible: true)
        end
      end

      context 'when an access method is selected' do
        it 'shows a "ready" icon' do
          within(activePanel) do
            choose('Direct Download')
            expect(page).to have_selector('.master-overlay-panel-footer-icon-valid', visible: true)
          end
        end
      end
    end

    context 'when clicking the done button' do
      it 'closes the panel' do
        within(activePanel) do
          find('.master-overlay-panel-pagination-done').click
        end
        expect(page).to have_no_selector(activePanel, visible: true)
      end
    end
  end
end
