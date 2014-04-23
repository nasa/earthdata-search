# EDSC-140: As a user, I want to be notified of system events so that I may plan
#           my use of the application

require "spec_helper"

# Reset the driver because it's not (currently) possible to un-dismiss notifications
# without reloading the page
describe "System event notification", reset: true do

  before :each do
    visit '/'
  end

  it "displays no system events on the home page" do
    expect(page).to have_no_text('LARC-ECS Maintenance')
  end

  context "upon loading the search page" do
    before :each do
      click_on 'Browse All Data'
    end

    it "displays notifications of system events" do
      expect(page).to have_text('LARC-ECS Maintenance')
    end

    context "closing a notification" do
      before :each do
        find('.banner').click_link('close')
      end

      it "hides the dismissed notification" do
        expect(page).to have_no_text('LARC-ECS Maintenance')
      end

      it "shows the next notification" do
        expect(page).to have_text('Second Notification')
      end
    end
  end

end
