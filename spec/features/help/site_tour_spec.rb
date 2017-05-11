require "spec_helper"

describe "Site tour" do
  context "When loading the initial search page" do
    before :each do
      Capybara.reset_sessions!
      login
      visit "/search"  
      wait_for_xhr
      dismiss_banner
      find_link("Manage user account").click
      find_link("Show Tour").click
      # The tour loads with 'Do not Show Again' unchecked - closing it immediately sets the preference to false
      # for this test.  This ensures the right starting point.
      find_button("End Tour").click
      page.evaluate_script 'window.location.reload()'
      wait_for_xhr
    end

    it 'shows a call-to-action modal which introduces the tour' do
      expect(page).to have_css('#sitetourModal')
    end

    context "and when the 'Start Tour' button is clicked from the initial introductory modal" do
      before :each do
        find_button("Start Tour").click
        wait_for_xhr
      end

      it "shows the first popover of the tour" do
        expect(page).to have_popover("Search")
      end

      context 'and when the "Next" button is clicked from the Search popover' do
        before :each do
          find_button("Next").click
          wait_for_xhr
        end
        it "shows the second popover of the tour" do
          expect(page).to have_popover("Search Results")
        end

        context 'and when the "Next" button is clicked from the Search Results popover' do
          before :each do
            find_button("Next").click
            wait_for_xhr
          end
          it "shows the third popover of the tour" do
            expect(page).to have_popover("Facets")
          end

          context 'and when the "Next" button is clicked from the Facets popover' do
            before :each do
              find_button("Next").click
              wait_for_xhr
            end
            it "shows the fourth popover of the tour" do
              expect(page).to have_popover("Map Tools")
            end
            context 'and when the "Next" button is clicked from the Map Tools popover' do
              before :each do
                find_button("Next").click
                wait_for_xhr
              end
              it "shows the fifth and last popover of the tour" do
                expect(page).to have_popover("Toolbar")
              end

              context 'and when the "Do not show again" checkbox is set, the tour closed, and the page refreshed' do 
              	before :each do
                  find(".toggleHideTour").click
                  find_button("End Tour").click
                  page.evaluate_script 'window.location.reload()'
                  wait_for_xhr
              	end
              	it 'does not show the call-to-action modal' do
                  expect(page).to_not have_css('#sitetourModal')
              	end
              end
            end
          end
        end
      end
    end
  end

  context "When loading the initial search page and then selecting 'Show Tour' from the Manage Account drop down" do
    before :each do
      Capybara.reset_sessions!
      login
      visit "/search"  
      wait_for_xhr
      dismiss_banner
      find_link("Manage user account").click
      find_link("Show Tour").click
    end
    it "shows the first popover of the tour" do
      expect(page).to have_popover("Search")
    end
  end

  context "When loading something other than the initial search page and then opening the Manage Account drop down" do
    before :each do
      Capybara.reset_sessions!
      login
      visit '/search/collections?sb=0%2C0%2C10%2C10'  
      wait_for_xhr
      dismiss_banner
      find_link("Manage user account").click
    end
    it "does not show the link to start the tour" do
      expect(page).to_not have_link("Show Tour")
    end
  end  
end