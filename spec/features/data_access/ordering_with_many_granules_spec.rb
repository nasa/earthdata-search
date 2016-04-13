require 'spec_helper'

describe 'Access data with more than 2000 granules', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search, overlay: false
    login
  end

  after :all do
    Capybara.reset_sessions!
  end

  context "from one collection" do
    context "with more than 2000 granules" do
      before :all do
        load_page 'data/configure', {project: ['C119124186-NSIDC_ECS']}
      end

      context "and selecting multiple access mothods" do
        before :all do
          click_button 'Add access method'
          within '.access-item-selection:first-child' do
            choose 'Download'
          end
          within '.access-item-selection:nth-child(4)' do
            choose 'AE_Rain Order Option'
          end
          click_on 'Continue'
        end

        after :all do
          load_page 'data/configure', {project: ['C119124186-NSIDC_ECS']}
        end

        it "shows a modal dialog" do
          expect(page).to have_content('Maximum Granules Exceeded')
        end
      end

      context "and selecting 'Download' option" do
        before :all do
          choose 'Download'
          click_on 'Submit'
          wait_for_xhr
        end

        after :all do
          load_page 'data/configure', {project: ['C119124186-NSIDC_ECS']}
        end

        it "doesn't show a modal dialog" do
          expect(page).not_to have_content('Maximum Granules Exceeded')
        end
      end

      context "and selecting 'ESI service' option" do
        before :all do
          choose 'AE_Rain.2 ESI Service'
          fill_in 'Email Address', with: "patrick+edsc@element84.com\t"
          click_on 'Continue'
        end

        after :all do
          load_page 'data/configure', {project: ['C119124186-NSIDC_ECS']}
        end

        it "doesn't show a modal dialog" do
          expect(page).not_to have_content('Maximum Granules Exceeded')
          expect(page).to have_link('Edit Profile in Earthdata Login')
        end
      end

      context "and selecting 'Order' option" do
        before :all do
          choose 'AE_Rain Order Option'
          click_on 'Continue'
        end

        after :all do
          load_page 'data/configure', {project: ['C119124186-NSIDC_ECS']}
        end

        it "shows a modal dialog" do
          expect(page).to have_content('Maximum Granules Exceeded')
          expect(modal_footer).to have_link('Change access methods')
          expect(modal_footer).to have_link('Refine your search')
          expect(modal_footer).to have_link('Continue')

          # wait for bootstrap animation
          sleep 1
          within '.modal-footer' do
            click_on 'Continue'
          end

          click_on 'Back'
          click_on 'Continue'
          sleep 1
        end

        context "then close the modal" do
          before :all do
            # wait for bootstrap animation
            sleep 1
            within '.modal-footer' do
              click_on 'Continue'
            end
          end

          after :all do
            click_on 'Back'
            click_on 'Continue'
          end

          it "advances to the next order step" do
            expect(page).to have_link('Edit Profile in Earthdata Login')
          end
        end

        context "then clicking 'Back to Search Session'" do
          before :all do
            # wait for bootstrap animation
            sleep 1
            within '.modal-footer' do
              click_on "Refine your search"
            end
            wait_for_xhr
          end

          after :all do
            load_page 'data/configure', {project: ['C119124186-NSIDC_ECS']}
            choose 'AE_Rain Order Option'
            click_on 'Continue'
          end

          it "brings the user back to search session" do
            expect(page).to have_content('You have 1 collection in your project')
          end
        end
      end
    end

    context "with less than 2000 granules" do
      before :all do
        load_page 'search/granules', {focus: ['C119124186-NSIDC_ECS'], queries: [qt: '2010-02-02T00:00:00.000Z,2010-02-02T23:59:59.000Z']}
        click_link 'Retrieve Collection Data'
        wait_for_xhr
      end

      context "and selecting 'Order' option" do
        before :all do
          choose 'AE_Rain Order Option'
          click_on 'Continue'
        end

        after :all do
          click_on 'Back'
        end

        it "doesn't show a modal dialog" do
          expect(page).not_to have_content('Maximum Granules Exceeded')
          expect(page).to have_link('Edit Profile in Earthdata Login')
        end
      end
    end
  end

  context "from multiple (two) collections" do
    before :all do
      load_page 'data/configure', {project: ['C179002914-ORNL_DAAC', 'C119124186-NSIDC_ECS']}
      wait_for_xhr
    end

    context "with the first collection having no more than 2000 granules in the order" do
      before :all do
        choose 'Order'
        click_on 'Continue'
      end

      it "doesn't show a modal dialog" do
        expect(page).not_to have_content('Maximum Granules Exceeded')
      end

      context "and the second collection having more than 2000 granules" do
        before :all do
          choose 'AE_Rain Order Option'
          click_on 'Continue'
        end

        after :all do
          sleep 1
          within '.modal-footer' do
            click_link 'Continue'
          end
          click_on 'Back'
          click_on 'Back'
          choose 'Order'
          click_on 'Continue'
        end

        it "shows a modal dialog" do
          expect(page).to have_content('Maximum Granules Exceeded')
          expect(modal_footer).to have_link('Change access methods')
          expect(modal_footer).to have_link('Refine your search')
          expect(modal_footer).to have_link('Continue')
        end
      end
    end
  end
end


