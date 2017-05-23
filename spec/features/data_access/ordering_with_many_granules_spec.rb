require 'spec_helper'
require 'rake'

describe 'Access data with more than 2000 granules', reset: false do
  collection_id = 'C1000000561-NSIDC_ECS'
  aster_collection_id = 'C14758250-LPDAAC_ECS'

  before :all do
    Delayed::Worker.delay_jobs = true
    Capybara.reset_sessions!
    load_page :search, overlay: false
    login
  end

  after :all do
    Delayed::Worker.delay_jobs = false
    Capybara.reset_sessions!
  end

  context "from one collection" do
    context "with more than 2000 granules" do
      before :all do
        load_page 'data/configure', project: [collection_id]
        wait_for_xhr
      end

      context "and selecting 'ESI service' option" do
        before :all do
          choose 'Customize Product'
          wait_for_xhr
          fill_in 'Email Address', with: "patrick+edsc@element84.com\t"
          click_on 'Continue'
        end

        after :all do
          load_page 'data/configure', project: [collection_id]
        end

        it "shows a modal dialog" do
          expect(page).to have_content('Maximum Granules Exceeded')
        end
      end

      context "and selecting 'Order' option" do
        before :all do
          choose 'Place Data Request'
          click_on 'Continue'
        end

        after :all do
          load_page 'data/configure', project: [collection_id]
        end

        it 'displays a warning about multiple emails' do
          expect(page).to have_text('Your order will be automatically split up into 2 orders. You will receive a set of emails for each order placed.')
          expect(modal_footer).to have_link('Change access methods')
          expect(modal_footer).to have_link('Refine your search')
          expect(modal_footer).to have_link('Continue')
        end

        context 'when accepting the modal' do
          before :all do
            sleep 1
            within '.modal-footer' do
              click_link 'Continue'
            end
            click_on 'Submit'
            wait_for_xhr
          end

          it 'initially shows the order in the "Creating" state' do
            expect(page).to have_text('Creating')
          end

          context 'after the order processes' do
            before :all do
              Delayed::Worker.new.work_off
            end

            it 'shows the order in the "Closed" state' do
              expect(page).to have_text('Closed')
            end
          end
        end
      end
    end
  end

  context "from multiple (two) collections" do
    before :all do
      load_page 'data/configure', {project: ['C179002914-ORNL_DAAC', collection_id]}
      wait_for_xhr
    end

    context "with the first collection having no more than 2000 granules in the order" do
      before :all do
        choose 'Place Data Request'
        click_on 'Continue'
      end

      it "doesn't show a modal dialog" do
        expect(page).not_to have_content('Maximum Granules Exceeded')
      end

      context "and the second collection having more than 2000 granules" do
        before :all do
          choose 'Place Data Request'
          click_on 'Continue'
        end

        it "shows a modal dialog" do
          expect(page).to have_text('Your order will be automatically split up into 2 orders. You will receive a set of emails for each order placed.')
          expect(modal_footer).to have_link('Change access methods')
          expect(modal_footer).to have_link('Refine your search')
          expect(modal_footer).to have_link('Continue')
        end

        context 'when accepting the modal' do
          before :all do
            sleep 1
            within '.modal-footer' do
              click_link 'Continue'
            end
            click_on 'Submit'
            wait_for_xhr
          end

          it 'initially shows the order in the "Creating" state' do
            expect(page).to have_text('Creating')
          end

          context 'after the order processes' do
            before :all do
              Delayed::Worker.new.work_off
            end

            it 'shows the order in the "Closed" state' do
              expect(page).to have_text('Closed')
            end
          end
        end
      end
    end
  end

  context "from one ASTER collection" do
    context "with more than 2000 granules" do
      before :all do
        load_page 'data/configure', project: [aster_collection_id]
        wait_for_xhr
      end

      context "and selecting 'Order' option" do
        before :all do
          choose 'Place Data Request'
          click_on 'Continue'
        end

        after :all do
          load_page 'data/configure', project: [aster_collection_id]
        end

        it "doesn't show a modal dialog" do
          expect(page).not_to have_content('Maximum Granules Exceeded')
          expect(page).to have_link('Edit Profile in Earthdata Login')
        end
      end
    end
  end
end
