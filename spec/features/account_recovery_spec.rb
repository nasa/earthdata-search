# EDSC-100 As a user, I want to reset my password so that I may recover my
#          account when I forget my password
# EDSC-101 As a user, I want to retrieve my username so that I may recover
#          my account when I forget my user name

require "spec_helper"

describe "Login window", reset: false do
  username = 'edsc_recovery'
  email = 'patrick+edscrecovery@element84.com'

  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
    click_link 'Sign In'
  end

  after(:all) do
    reset_user
  end

  context "clicking the link to a recover a password" do
    before :all do
      within '#login-modal' do
        click_link 'password'
      end
    end

    after :all do
      within '#login-modal' do
        click_link 'Sign In'
      end
    end

    it "changes the title of the login window" do
      within '#login-modal' do
        expect(page).to have_content("Recover Your Password")
      end
    end

    it "prompts for username and email address" do
      within '#login-modal' do
        expect(page).to have_field("Username")
        expect(page).to have_field("Email")
        expect(page).to have_no_field("Password")
      end
    end

    it 'changes the submit button text to "Recover"' do
      within '#login-modal' do
        expect(page).to have_button("Recover")
      end
    end

    it "displays a link to return to the sign in screen" do
      within '#login-modal' do
        expect(page).to have_link("Sign In")
      end
    end

    context "and supplying invalid credentials" do
      before :all do
        fill_in 'Username', with: 'qwerqwerqwerqwerqwer'
        fill_in 'Email', with: 'qwer@example.com'
        click_on 'Recover'
      end

      after :all do
        fill_in 'Username', with: ''
        fill_in 'Email', with: ''
      end

      it "displays an error" do
        within '#login-modal' do
          expect(page).to have_content("The given username and email address are not found")
        end
      end
    end

    context "and supplying a valid username and email" do
      before :all do
        fill_in 'Username', with: username
        fill_in 'Email', with: email
        click_on 'Recover'
      end

      after :all do
        click_link 'password'
        fill_in 'Email', with: ''
        fill_in 'Username', with: ''
      end

      it "displays a success message" do
        within '#login-modal' do
          expect(page).to have_content("The password for #{username} has been reset.")
        end
      end

      it "prompts the user to log in" do
        within '#login-modal' do
          expect(page).to have_field("Username")
          expect(page).to have_no_field("Email")
          expect(page).to have_field("Password")

          expect(page).to have_button("Sign In")
          expect(page).to have_content("Sign In to Earthdata Search Client")
        end
      end
    end

    context "and clicking the link to log in" do
      before :all do
        within '#login-modal' do
          click_link 'Sign In'
        end
      end

      after :all do
        within '#login-modal' do
          click_link 'password'
        end
      end

      it "reverts the title of the login window" do
        within '#login-modal' do
          expect(page).to have_content("Sign In to Earthdata Search Client")
        end
      end

      it "prompts for username and password" do
        within '#login-modal' do
          expect(page).to have_field("Username")
          expect(page).to have_no_field("Email")
          expect(page).to have_field("Password")
        end
      end

      it 'reverts the submit button text to "Sign In"' do
        within '#login-modal' do
          expect(page).to have_button("Sign In")
        end
      end

      it "removes the link to return to the sign in screen" do
        within '#login-modal' do
          expect(page).to have_no_link("Sign In")
        end
      end
    end
  end

  context "clicking the link to recover a username" do
    before :all do
      within '#login-modal' do
        click_link 'username'
      end
    end

    after :all do
      within '#login-modal' do
        click_link 'Sign In'
      end
    end

    it "changes the title of the login window" do
      within '#login-modal' do
        expect(page).to have_content("Recover Your Username")
      end
    end

    it "prompts for an email address only" do
      within '#login-modal' do
        expect(page).to have_no_field("Username")
        expect(page).to have_field("Email")
        expect(page).to have_no_field("Password")
      end
    end

    it 'changes the submit button text to "Recover"' do
      within '#login-modal' do
        expect(page).to have_button("Recover")
      end
    end

    it "displays a link to return to the sign in screen" do
      within '#login-modal' do
        expect(page).to have_link("Sign In")
      end
    end

    context "and supplying invalid credentials" do
      before :all do
        fill_in 'Email', with: 'qwer'
        click_on 'Recover'
      end

      after :all do
        fill_in 'Email', with: ''
      end

      it "displays an error" do
        within '#login-modal' do
          expect(page).to have_content("Email [qwer] is not a valid email address.")
        end
      end
    end

    context "and supplying a valid email" do
      before :all do
        fill_in 'Email', with: email
        click_on 'Recover'
      end

      after :all do
        click_link 'password'
        fill_in 'Email', with: ''
      end

      it "displays a success message" do
        within '#login-modal' do
          expect(page).to have_content("Username information has been sent to #{email}.")
        end
      end

      it "prompts the user to log in" do
        within '#login-modal' do
          expect(page).to have_field("Username")
          expect(page).to have_no_field("Email")
          expect(page).to have_field("Password")

          expect(page).to have_button("Sign In")
          expect(page).to have_content("Sign In to Earthdata Search Client")
        end
      end
    end

    context "and clicking the link to log in" do
      before :all do
        within '#login-modal' do
          click_link 'Sign In'
        end
      end

      after :all do
        within '#login-modal' do
          click_link 'password'
        end
      end

      it "reverts the title of the login window" do
        within '#login-modal' do
          expect(page).to have_content("Sign In to Earthdata Search Client")
        end
      end

      it "prompts for username and password" do
        within '#login-modal' do
          expect(page).to have_field("Username")
          expect(page).to have_no_field("Email")
          expect(page).to have_field("Password")
        end
      end

      it 'reverts the submit button text to "Sign In"' do
        within '#login-modal' do
          expect(page).to have_button("Sign In")
        end
      end

      it "removes the link to return to the sign in screen" do
        within '#login-modal' do
          expect(page).to have_no_link("Sign In")
        end
      end
    end
  end
end
