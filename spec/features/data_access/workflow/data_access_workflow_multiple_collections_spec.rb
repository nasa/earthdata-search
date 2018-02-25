require 'spec_helper'

describe 'Data Access workflow', reset: false do
  test_collection_1 = 'C203234523-LAADS'
  test_collection_2 = 'C194001241-LPDAAC_ECS'
  test_collection_3 = 'C1000000561-NSIDC_ECS'

  context 'When a user has three collections within a project' do
    before(:all) do
      Capybara.reset_sessions!
      load_page :search, project: [test_collection_1, test_collection_2, test_collection_3], view: :project
      login

      click_button 'Download project data'
      wait_for_xhr

      # Ensure that an access method is selected before continuing
      within '.data-access-content .access-item:nth-child(1)' do
        page.find('.access-item-selection .input-tab:nth-of-type(1)').click
      end
    end

    it 'displays 3 configuration panels' do
      within '.data-access-content' do
        expect(page).to have_css('.access-item', count: 3)
      end
    end

    it 'opens the first panel' do
      within '.data-access-content .access-item:nth-child(1)' do
        expect(page).to have_css('.access-item-body')
      end
    end

    it 'collapses the second panel' do
      within '.data-access-content .access-item:nth-child(2)' do
        expect(page).to have_css('.access-item-body.hidden', visible: false)
      end
    end

    it 'collapses the third panel' do
      within '.data-access-content .access-item:nth-child(3)' do
        expect(page).to have_css('.access-item-body.hidden', visible: false)
      end
    end

    it 'displays no "Back" button' do
      within '.access-item-actions' do
        expect(page).to have_no_content 'Back'
      end
    end

    it 'displays a "Continue" button' do
      within '.access-item-actions' do
        expect(page).to have_button 'Continue'
      end
    end

    context 'when continuing to the second collection' do
      before(:all) do
        click_button 'Continue'

        # Ensure that an access method is selected before continuing
        within '.data-access-content .access-item:nth-child(2)' do
          page.find('.access-item-selection .input-tab:nth-of-type(1)').click
        end
      end

      it 'collapses the first panel' do
        within '.data-access-content .access-item:nth-of-type(1)' do
          expect(page).to have_css('.access-item-body.hidden', visible: false)
        end
      end

      it 'opens the second panel' do
        within '.data-access-content .access-item:nth-of-type(2)' do
          expect(page).to have_css('.access-item-body')
        end
      end

      it 'collapses the third panel' do
        within '.data-access-content .access-item:nth-of-type(3)' do
          expect(page).to have_css('.access-item-body.hidden', visible: false)
        end
      end

      it 'displays a "Back" button' do
        within '.access-item-actions' do
          expect(page).to have_button 'Back'
        end
      end

      it 'displays a "Continue" button' do
        within '.access-item-actions' do
          expect(page).to have_button 'Continue'
        end
      end

      context 'when continuing to the third collection' do
        before(:all) do
          click_button 'Continue'

          # Ensure that an access method is selected before continuing
          within '.data-access-content .access-item:nth-child(3)' do
            page.find('.access-item-selection .input-tab:nth-of-type(1)').click
          end
        end

        it 'collapses the first panel' do
          within '.data-access-content .access-item:nth-of-type(1)' do
            expect(page).to have_css('.access-item-body.hidden', visible: false)
          end
        end

        it 'collapses the second panel' do
          within '.data-access-content .access-item:nth-of-type(2)' do
            expect(page).to have_css('.access-item-body.hidden', visible: false)
          end
        end

        it 'opens the third panel' do
          within '.data-access-content .access-item:nth-of-type(3)' do
            expect(page).to have_css('.access-item-body')
          end
        end

        it 'displays a submit button to submit the order' do
          within '.access-item-actions' do
            expect(page).to have_button('Submit')
          end
        end
      end
    end
  end
end
