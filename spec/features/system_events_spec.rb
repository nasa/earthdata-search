# EDSC-140: As a user, I want to be notified of system events so that I may plan
#           my use of the application

require "spec_helper"

# Reset the driver because it's not (currently) possible to un-dismiss notifications
# without reloading the page
describe "System event notification", reset: true do

  before :each do
    load_page :root
  end

  it "displays no system events on the home page" do
    expect(page).to have_no_text('LARC-ECS Maintenance')
  end

  context "upon loading the search page" do
    before :each do
      click_on 'Browse All Data'
      wait_for_xhr
    end

    it "displays notifications of system events" do
      expect(page).to have_text('LARC-ECS Maintenance')
    end

    context "closing a notification" do
      before :each do
        find('.banner').click_link('close')
        wait_for_xhr
      end

      it "hides the dismissed notification" do
        expect(page).to have_no_text('LARC-ECS Maintenance')
      end

      it "shows the next notification" do
        expect(page).to have_text('Second Notification')
      end

      context "and reloading the page" do
        before :each do
          load_page :search
          wait_for_xhr
        end

        it "does not show the closed notification again" do
          expect(page).to have_no_text('LARC-ECS Maintenance')
        end

        it "continues to show other notifications" do
          expect(page).to have_text('Second Notification')
        end
      end

      context "and clicking on toolbar's notification icon" do
        before :each do
          click_on 'Show Outage Notices'
          wait_for_xhr
        end

        it "shows the dismissed notification" do
          expect(page).to have_text('LARC-ECS Maintenance')
        end

        it "shows the dismissed notification on subsequent page loads" do
          load_page :search
          wait_for_xhr
          expect(page).to have_text('LARC-ECS Maintenance')
        end
      end
    end
  end

end
