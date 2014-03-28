# EDSC-97 As a user, I want to log in so that I may access my saved
#         information and retrieve restricted data
# EDSC-98 As a user, I want to see an indication that I am logged in
#         so I may know the credentials I am currently using
# EDSC-99 As a user, I want to log out so that nobody else may access
#         my account

require "spec_helper"

describe "Login", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  before(:each) do
    click_link 'Sign In'
  end

  after(:each) do
    reset_user
  end

  context "successful login" do
    before(:each) do
      fill_in 'Username', with: 'edsc'
      fill_in 'Password', with: 'EDSCtest!1'
      click_button 'Sign In'
      wait_for_xhr
    end

    it "logs a user in successfully" do
      script = "window.edsc.models.page.current.user.isLoggedIn()"
      response = page.evaluate_script(script)

      expect(response).to eq(true)
    end

    it "display the user information while logged in" do
      within(".toolbar") do
        expect(page).to have_content("edsc")
      end
    end

    it "logs the user out" do
      click_link 'edsc'
      # Do this in Javascript because of capybara clickfailed bug
      page.execute_script("$('.dropdown-menu .dropdown-link-logout').click()")

      script = "window.edsc.models.page.current.user.isLoggedIn()"
      response = page.evaluate_script(script)

      expect(response).to eq(false)
    end
  end

  context "remembers login between sessions" do
    it "remembers the login session" do
      fill_in 'Username', with: 'edsc'
      fill_in 'Password', with: 'EDSCtest!1'
      click_button 'Sign In'

      within(".toolbar") do
        expect(page).to have_content("edsc")
      end

      visit '/search'

      within(".toolbar") do
        expect(page).to have_content("edsc")
      end
    end
  end

  context "unsuccessful login" do
    after(:each) do
      find("a.close").click
    end

    it "displays an error with a blank username" do
      click_button 'Sign In'

      expect(page).to have_content "Username can't be blank"
    end

    it "displays an error with a blank password" do
      fill_in 'Username', with: 'test'
      click_button 'Sign In'

      expect(page).to have_content "Password can't be blank"
    end

    it "displays an error with an invalid username or password" do
      fill_in 'Username', with: 'test'
      fill_in 'Password', with: 'test'
      click_button 'Sign In'

      expect(page).to have_content "Invalid username or password, please retry."
    end
  end
end
