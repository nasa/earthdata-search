require "spec_helper"

describe "CWIC-enabled granule results", reset: false do
  extend Helpers::CollectionHelpers
  before :all do
    load_page :search, q: 'C1220566654-USGS_LTA', ac: true
  end

  context "when viewing granule results for a CWIC-enabled collection" do
    hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

    context "clicking the button to remove a granule" do

      before :all do
        page.find('#granule-list').find(".panel-list-item:nth-child(#{1}) h3").click
        keypress('#granule-list', :delete)
        wait_for_xhr
      end

      it "removes it from the list", acceptance: true do
        expect(page).to have_css('#granule-list .panel-list-item', count: 19)
        expect(granule_list).to have_content("Showing 19")
      end

      context "and undoing a removal" do
        before :all do
          granule_list.find('.master-overlay-info').click_link('Filter granules')
          click_link 'Add it back'
        end

        after :all do
          click_button('Apply your selections')
          page.find('#granule-list').find(".panel-list-item:nth-child(#{1}) h3").click
          keypress('#granule-list', :delete)
          wait_for_xhr
        end

        it "adds it back to the list" do
          expect(page).to have_css('#granule-list .panel-list-item', count: 20)
          expect(granule_list).to have_content("Showing 20")
        end
      end

      context "and updating the query" do
        before :all do
          visit current_url
          wait_for_xhr
        end

        it "continues to exclude the removed granule from the list", acceptance: true do
          expect(page).to have_css('#granule-list .panel-list-item', count: 19)
          expect(granule_list).to have_content("Showing 19")
        end
      end

      context "and going to data access page" do
        before :all do
          login
          click_button 'Download Data'
          wait_for_xhr
        end

        after :all do
          while page.evaluate_script('document.getElementsByClassName("banner-close").length != 0') do
            find('.banner-close').click
          end
          click_link 'Back to Search Session'
          wait_for_xhr
        end


        # it "shows one excluded granule" do
        #   expect(page).to have_content("85201 Granules")
        # end

        context "and submitting a download order then viewing granule links" do
          before :all do
            choose 'Direct Download'
            click_on 'Submit'
            wait_for_xhr
            click_on('View Download Links')
          end

          after :all do
            while page.evaluate_script('document.getElementsByClassName("banner-close").length != 0') do
              find('.banner-close').click
            end
            click_link 'Back to Data Access Options'
            wait_for_xhr
          end

          it "provides a list of download links for the remaining granuels" do
            within_last_window do
              expect(page).to have_no_text('Loading more...')
              expect(page).to have_link('Granule download URL', count: 99)
            end
          end
        end
      end
    end
  end
end
