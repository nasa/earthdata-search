require 'rails_helper'

describe 'Project with three collections' do
  context 'when viewing the project page', order: :defined do
    before :all do
      Capybara.reset_sessions!
      load_page :projects_page,  project: ['C1200187767-EDF_OPS', 'C1000000969-DEV08', 'C1000000082-EDF_OPS'], env: :sit, authenticate: 'edsc'
    end

    activePanelOne = '.master-overlay-panel-group-active #C1200187767-EDF_OPS_edit-options.master-overlay-panel-item-active'
    activePanelTwo = '.master-overlay-panel-group-active #C1000000969-DEV08_edit-options.master-overlay-panel-item-active'
    activePanelThree = '.master-overlay-panel-group-active #C1000000082-EDF_OPS_edit-options.master-overlay-panel-item-active'

    it 'opens the first panel on load' do
      expect(page).to have_selector(activePanelOne, visible: true)
    end

    context 'when viewing the first panel' do
      it 'shows a next button' do
        within(activePanelOne) do
          expect(page).to have_selector('.master-overlay-panel-pagination-next', visible: true)
        end
      end

      it 'shows correct pagination' do
        within(activePanelOne) do
          pagination = find('.master-overlay-panel-footer-page')
          expect(pagination).to have_content('Collection 1 of 3')
        end
      end

      context 'when no access method is selected' do
        it 'shows a "warning" icon' do
          within(activePanelOne) do
            expect(page).to have_selector('.master-overlay-panel-footer-icon-invalid', visible: true)
          end
        end

        context 'when an access method is selected' do
          it 'shows a "ready" icon' do
            within(activePanelOne) do
              choose('Direct Download')
              expect(page).to have_selector('.master-overlay-panel-footer-icon-valid', visible: true)
            end
          end
        end
      end

      context 'when clicking the next button' do
        before :all do
          within(activePanelOne) do
            find('.master-overlay-panel-pagination-next').click
          end
        end

        it 'opens the next customization panel' do
          expect(page).to have_no_selector(activePanelOne, visible: true)
          expect(page).to have_selector(activePanelTwo, visible: true)
          expect(page).to have_no_selector(activePanelThree, visible: true)
        end

        it 'shows a next button' do
          within(activePanelTwo) do
            expect(page).to have_selector('.master-overlay-panel-pagination-next', visible: true)
          end
        end

        it 'shows a back button' do
          within(activePanelTwo) do
            expect(page).to have_selector('.master-overlay-panel-pagination-back', visible: true)
          end
        end

        it 'does not show a done button' do
          within(activePanelTwo) do
            expect(page).to have_no_selector('.master-overlay-panel-pagination-done', visible: true)
          end
        end

        it 'shows correct pagination' do
          within(activePanelTwo) do
            pagination = find('.master-overlay-panel-footer-page')
            expect(pagination).to have_content('Collection 2 of 3')
          end
        end

        context 'when no access method is selected' do
          it 'shows a "warning" icon' do
            within(activePanelTwo) do
              expect(page).to have_selector('.master-overlay-panel-footer-icon-invalid', visible: true)
            end
          end

          context 'when an access method is selected' do
            it 'shows a "ready" icon' do
              within(activePanelTwo) do
                choose('Stage for Delivery')
                expect(page).to have_selector('.master-overlay-panel-footer-icon-valid', visible: true)
              end
            end
          end
        end

        context 'when clicking the next button again' do
          before :all do
            within(activePanelTwo) do
              find('.master-overlay-panel-pagination-next').click
            end
          end

          it 'opens the next customization panel' do
            expect(page).to have_no_selector(activePanelOne, visible: true)
            expect(page).to have_no_selector(activePanelTwo, visible: true)
            expect(page).to have_selector(activePanelThree, visible: true)
          end

          it 'does not show a next button' do
            within(activePanelThree) do
              expect(page).to have_no_selector('.master-overlay-panel-pagination-next', visible: true)
            end
          end

          it 'shows a back button' do
            within(activePanelThree) do
              expect(page).to have_selector('.master-overlay-panel-pagination-back', visible: true)
            end
          end

          it 'shows a done button' do
            within(activePanelThree) do
              expect(page).to have_selector('.master-overlay-panel-pagination-done', visible: true)
            end
          end

          it 'shows correct pagination' do
            within(activePanelThree) do
              pagination = find('.master-overlay-panel-footer-page')
              expect(pagination).to have_content('Collection 3 of 3')
            end
          end

          context 'when no access method is selected' do
            it 'shows a "warning" icon' do
              within(activePanelThree) do
                expect(page).to have_selector('.master-overlay-panel-footer-icon-invalid', visible: true)
              end
            end

            context 'when an access method is selected' do
              it 'shows a "ready" icon' do
                within(activePanelThree) do
                  choose('Customize')
                  expect(page).to have_selector('.master-overlay-panel-footer-icon-valid', visible: true)
                end
              end
            end
          end
        end

        context 'when clicking the done button' do
          it 'closes the panel' do
            within(activePanelThree) do
              find('.master-overlay-panel-pagination-done').click
            end
            expect(page).to have_no_selector(activePanelThree, visible: true)
          end
        end
      end
    end
  end
end
