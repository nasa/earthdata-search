# EDSC-106 As a user, I want to create an account so that I may enjoy 
#          the benefits of being a logged-in user

require 'spec_helper'

def create_account(username, 
                   password='EDSCtest!1',
                   first_name='EDSC',
                   last_name='TEST',
                   domain='Other',
                   organization_name='testing',
                   user_type='Qa testing user',
                   primary_study_area='Other',
                   country='United States')

  email = "#{username}@example.com"

  fill_in 'Username', with: username
  fill_in 'Password', with: password
  fill_in 'Password confirmation', with: password
  fill_in 'First name', with: first_name
  fill_in 'Last name', with: last_name
  select domain, from: 'Domain'
  fill_in 'Email', with: email
  fill_in 'Organization name', with: organization_name
  select user_type, from: 'Type of user'
  select primary_study_area, from: 'Primary study area'
  select country, from: 'Country'
  click_button 'Create Account'  
end

describe 'Create new account', reset: false do
  before :all do
    Capybara.reset_sessions!
    visit '/search'
    click_link 'Sign In'
    click_link 'EOSDIS user account'
  end

  context 'when creating a new account' do
    username = 'edsctest2'

    before :all do
      create_account username
    end

    after :all do
      click_link username

      # Do this in Javascript because of capybara clickfailed bug
      page.execute_script("$('.dropdown-menu .dropdown-link-logout').click()")
    end

    it 'logs in the new user' do
      script = "edsc.page.user.isLoggedIn()"
      response = page.evaluate_script(script)

      expect(response).to eq(true)
    end

    it 'shows the user a confirmation page' do
      expect(page).to have_content "User account #{username} has been created and you have been logged in."
    end
  end

  context 'validates user input' do
    before :each do
      click_button 'Create Account'
    end

    after :each do
      script = 'edsc.page.user.clearAccountForm()'
      page.evaluate_script script
    end

    it 'requires a username' do
      expect(page).to have_content 'Please provide username'
      expect(page).to have_css '#username.field-error'
    end

    it 'requires a password' do
      expect(page).to have_content 'Please provide password'
      expect(page).to have_css '#password.field-error'
    end

    it 'requires a matching password confirmation' do
      fill_in 'Password', with: 'testing'
      click_button 'Create Account'

      expect(page).to have_content 'Password must match confirmation'
      expect(page).to have_css '#password_confirmation.field-error'
    end

    it 'requires a complex password' do
      create_account 'edsctest', 'edscpassword'
      
      expect(page).to have_content 'Password must consist of at least three of four types of characters: upper case character, lower case character, digit character, and special character.'
      expect(page).to have_css '#password.field-error'      
    end

    it 'requires a first name' do
      expect(page).to have_content 'Please provide first name'
      expect(page).to have_css '#first_name.field-error'
    end

    it 'requires a last name' do
      expect(page).to have_content 'Please provide last name'
      expect(page).to have_css '#last_name.field-error'
    end

    it 'requires a email' do
      expect(page).to have_content 'Please provide email'
      expect(page).to have_css '#email.field-error'
    end

    it 'requires a domain' do
      expect(page).to have_content 'Please select domain'
      expect(page).to have_css '#user_domain.field-error'
    end

    it 'requires a organization name' do
      expect(page).to have_content 'Please provide organization name'
      expect(page).to have_css '#organization_name.field-error'
    end

    it 'requires a user type' do
      expect(page).to have_content 'Please select type of user'
      expect(page).to have_css '#user_type.field-error'
    end

    it 'requires a primary study area' do
      expect(page).to have_content 'Please select primary study area'
      expect(page).to have_css '#primary_study_area.field-error'
    end

    it 'requires a country' do
      expect(page).to have_content 'Please select country'
      expect(page).to have_css '#country.field-error'
    end

  end
  
end
