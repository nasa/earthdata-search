require "spec_helper"

describe "Featured collections", reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search
  end

  context "when no collection filters have been applied" do
    it "shows featured collections" do
      expect(featured_collection_results).to have_content('MYD04_L2')
      expect(featured_collection_results).to have_content('MYD10_L2')
    end

    it "shows a section heading for featured collections" do
      expect(collection_results).to have_content('Recent and Featured')
    end

    it "shows a section heading for other collections" do
      expect(collection_results).to have_content('More Collections')
    end
  end

  context "when collection filters have been applied which filter some featured collections" do
    before :all do
      fill_in "keywords", with: "snow cover nrt"
      wait_for_xhr
    end

    after :all do
      click_on "Clear Filters"
      wait_for_xhr
    end

    it "shows featured collections matching the filters" do
      expect(featured_collection_results).to have_content('MYD10_L2')
    end

    it "hides featured collections not matching the filters" do
      expect(featured_collection_results).to have_no_content('MYD04_L2')
    end

    it "shows a section heading for featured collections" do
      expect(collection_results).to have_content('Recent and Featured')
    end

    it "shows a section heading for other collections" do
      expect(collection_results).to have_content('More Collections')
    end
  end

  context "when collection filters have been applied which filter all featured collections" do
    before :all do
      fill_in "keywords", with: "AST"
      wait_for_xhr
    end

    after :all do
      click_on "Clear Filters"
      wait_for_xhr
    end

    it "shows no featured collections" do
      expect(page).to have_no_content('MYD04_L2')
      expect(page).to have_no_content('MYD10_L2')
    end

    it "shows no section heading for featured collections" do
      expect(collection_results).to have_no_content('Recent and Featured')
    end

    it "shows no section heading for other collections" do
      expect(collection_results).to have_no_content('More Collections')
    end
  end

  context "when a guest user has recently visited collections" do
    before :all do
      page.execute_script('document.cookie = "persist=true; path=/;"')
      within '#collection-results-list > :nth-child(3)' do
        click_link "Add collection to the current project"
      end
      wait_for_xhr
      load_page :search
      within '#collection-results-list > :nth-child(2)' do
        click_link "Add collection to the current project"
      end
      wait_for_xhr
      load_page :search
    end

    after :all do
      Capybara.reset_sessions!
      load_page :search
    end

    it "shows the two most recently visited collections among the featured collections" do
      within "#collection-featured-list" do
        expect(page).to have_css('.panel-list-item', count: 4)
      end
    end
  end

  context "when a logged-in user has recently visited collections" do
    before :all do
      page.execute_script('document.cookie = "persist=true; path=/;"')
      login
      load_page :search
      within '#collection-results-list > :nth-child(3)' do
        click_link "Add collection to the current project"
      end
      wait_for_xhr
      within '#collection-results-list > :nth-child(2)' do
        click_link "Add collection to the current project"
      end
      wait_for_xhr
      load_page :search
    end

    after :all do
      Capybara.reset_sessions!
      load_page :search
    end

    it "shows the two most recently visited collections among the featured collections" do
      expect(featured_collection_results).to have_css('.panel-list-item', count: 4)
    end

    # EDSC-512
    context "and filters have been applied which filter all featured collections" do
      before :all do
        fill_in "keywords", with: "AST_L1AE"
        wait_for_xhr
      end

      it "shows no featured collections" do
        expect(page).to have_no_content('MYD04_L2')
        expect(page).to have_no_content('MYD10_L2')
      end

      context "when filtering the first collection's granules" do
        before :all do
          first_collection_result.click
          wait_for_xhr
          create_point(0, 0)
          wait_for_xhr
        end

        it "shows the updated granule list" do
          expect(page).to have_content('Showing 0 of 0 matching granules')
        end

        context "when clearing filters and returning to the collections list" do
          before :all do
            page.execute_script('$(".clear-filters").click()')
            wait_for_xhr
            click_link 'Back to Collections'
            wait_for_xhr
          end

          it "shows recent and featured collections" do
            expect(featured_collection_results).to have_css('.panel-list-item', count: 4)
          end
        end
      end
    end
  end
end
