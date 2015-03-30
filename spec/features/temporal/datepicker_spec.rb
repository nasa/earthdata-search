require 'spec_helper'

describe 'Date picker', reset: false do
  before :all do
    Capybara.reset_sessions!
    load_page :search
  end

  context "range pickers" do
    context "when selecting a start date" do
      before :all do
        click_link 'Temporal'
        # give the end input focus
        fill_in "Start", with: ""
        find('span.year', text: "2010").click
        find('span.month', text: "Jan").click
        find('td.day', text: "15").click
        js_click_apply ".temporal-dropdown"
      end

      after :all do
        reset_search
      end

      it "fills in 00:00:00 for the start time" do
        expect(page).to have_content("Start 2010-01-15 00:00:00")
      end
    end

    context "when selecting an end date" do
      before :all do
        click_link 'Temporal'
        # give the end input focus
        fill_in "End", with: ""
        find('span.year', text: "2010").click
        find('span.month', text: "Jan").click
        find('td.day', text: "15").click
        js_click_apply ".temporal-dropdown"
      end

      after :all do
        reset_search
      end

      it "fills in 23:59:59 for the end time" do
        expect(page).to have_content("Stop 2010-01-15 23:59:59")
      end
    end

    context "when typing an end date" do
      context "when typing a valid date" do
        before :all do
          click_link "Temporal"
          fill_in "End", with: "2010-01-15 12:13:14\t"
          js_click_apply ".temporal-dropdown"
        end

        after :all do
          reset_search
        end

        it "does not alter the end time" do
          expect(page).to have_content("Stop 2010-01-15 12:13:14")
        end
      end

      context "when typing an invalid date" do
        before :all do
          click_link "Temporal"
          fill_in "Start", with: "gibberish\t"
        end

        after :all do
          js_click_clear
          click_link 'Temporal'
          reset_search
        end

        it "displays an error" do
          expect(page).to have_content("Invalid date")
        end
      end
    end
  end

  context "recurring pickers" do
    context "when selecting an end date" do
      before :all do
        click_link 'Temporal'
        js_check_recurring 'dataset'
        fill_in "Start", with: ""
        find('span.month', text: "Jan").click
        find('td.day', text: "15").click
        fill_in "End", with: ""
        find('span.month', text: "Jan").click
        find('td.day', text: "20").click
        js_click_apply ".temporal-dropdown"
      end

      after :all do
        reset_search
      end

      it "fills in 23:59:59 for the end time" do
        expect(page).to have_content("Stop 01-20 23:59:59")
      end
    end
  end
end
