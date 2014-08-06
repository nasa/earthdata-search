# # EDSC-106 As a user, I want to create an account so that I may enjoy
# #          the benefits of being a logged-in user
#
# require 'spec_helper'
#
# describe 'Create new account', reset: false do
#   default_user = { username: 'edsctest',
#                    password: 'EDSCtest!1',
#                    password_confirmation: 'EDSCtest!1',
#                    first_name: 'EDSC',
#                    last_name: 'TEST',
#                    domain: 'Other',
#                    organization_name: 'testing',
#                    user_type: 'Qa testing user',
#                    primary_study_area: 'Other',
#                    country: 'United States',
#                    email: true
#   }
#
#   def create_account(user)
#     email = user[:email] ? "#{user[:username]}@example.com" : nil
#
#     fill_in 'Username', with: user[:username]
#     fill_in 'Password', with: user[:password]
#     fill_in 'Password confirmation', with: user[:password_confirmation]
#     fill_in 'First name', with: user[:first_name]
#     fill_in 'Last name', with: user[:last_name]
#     select user[:domain], from: 'Domain'
#     fill_in 'Email', with: email
#     fill_in 'Organization name', with: user[:organization_name]
#     select user[:user_type], from: 'Type of user'
#     select user[:primary_study_area], from: 'Primary study area'
#     select user[:country], from: 'Country'
#     click_button 'Create Account'
#     wait_for_xhr
#   end
#
#   def change_property(hash, property, value=nil)
#     cloned = hash.clone
#     cloned[property] = value
#     cloned
#   end
#
#   before :all do
#     Capybara.reset_sessions!
#     load_page :search, overlay: false
#     click_link 'Sign In'
#     click_link 'EOSDIS user account'
#   end
#
#   after :each do
#     script = 'edsc.page.account.clearAccountForm()'
#     page.execute_script script
#   end
#
#   context 'when creating a new account' do
#     user = default_user.clone
#     user[:username] = 'edsc'
#
#     before :all do
#       create_account user
#     end
#
#     after :all do
#       click_link 'Manage user account'
#       click_logout
#       click_link 'Sign In'
#       click_link 'EOSDIS user account'
#     end
#
#     it 'logs in the new user' do
#       script = "edsc.page.account.user.isLoggedIn()"
#       response = page.evaluate_script(script)
#
#       expect(response).to eq(true)
#     end
#
#     it 'shows the user a confirmation page' do
#       expect(page).to have_content "User account #{user[:username]} has been created and you have been logged in."
#     end
#   end
#
#   context 'user input validation' do
#     before :each do
#       click_button 'Create Account'
#     end
#
#     after :each do
#       script = 'edsc.page.account.clearAccountForm()'
#       page.execute_script script
#     end
#   end
#
#   context 'creating an account with no username filled in' do
#     it 'displays an error prompting for a username' do
#       create_account change_property(default_user, :username)
#
#       expect(page).to have_content 'Please provide username'
#       expect(page).to have_css '#username.field-error'
#     end
#   end
#
#   context 'creating an account with no password filled in' do
#     it 'displays an error prompting for a password' do
#       user = change_property default_user, :password
#       user = change_property user, :password_confirmation
#       create_account user
#
#       expect(page).to have_content 'Please provide password'
#       expect(page).to have_css '#password.field-error'
#     end
#   end
#
#   context 'creating an account without matching passwords' do
#     it 'displays an error prompting for matching passwords' do
#       create_account change_property(default_user, :password_confirmation, 'testing')
#
#       expect(page).to have_content 'Password must match confirmation'
#       expect(page).to have_css '#password_confirmation.field-error'
#     end
#   end
#
#   context 'create an account without a complex password' do
#     it 'displays an error prompting for a complex password' do
#       password = 'edscpassword'
#       user = change_property default_user, :password, password
#       user = change_property user, :password_confirmation, password
#       create_account user
#
#       expect(page).to have_content 'Password must consist of at least three of four types of characters: upper case character, lower case character, digit character, and special character.'
#       expect(page).to have_css '#password.field-error'
#     end
#   end
#
#   context 'creating an account with no first name filled in' do
#     it 'displays an error prompting for a first name' do
#       create_account change_property(default_user, :first_name)
#
#       expect(page).to have_content 'Please provide first name'
#       expect(page).to have_css '#first_name.field-error'
#     end
#   end
#
#   context 'creating an account with no last name filled in' do
#     it 'displays an error prompting for a last name' do
#       create_account change_property(default_user, :last_name)
#
#       expect(page).to have_content 'Please provide last name'
#       expect(page).to have_css '#last_name.field-error'
#     end
#   end
#
#   context 'creating an account with no email filled in' do
#     it 'displays an error prompting for a email' do
#       create_account change_property(default_user, :email)
#
#       expect(page).to have_content 'Please provide email'
#       expect(page).to have_css '#email.field-error'
#     end
#   end
#
#   context 'creating an account with no domain selected' do
#     it 'displays an error prompting for a domain' do
#       create_account change_property(default_user, :domain, 'Select a domain')
#
#       expect(page).to have_content 'Please select domain'
#       expect(page).to have_css '#user_domain.field-error'
#     end
#   end
#
#   context 'creating an account with no organization name filled in' do
#     it 'displays an error prompting for a organization name' do
#       create_account change_property(default_user, :organization_name)
#
#       expect(page).to have_content 'Please provide organization name'
#       expect(page).to have_css '#organization_name.field-error'
#     end
#   end
#
#   context 'creating an account with no type of user selected' do
#     it 'displays an error prompting for a type of user' do
#       create_account change_property(default_user, :user_type, 'Select a type')
#
#       expect(page).to have_content 'Please select type of user'
#       expect(page).to have_css '#user_type.field-error'
#     end
#   end
#
#   context 'creating an account with no primary study area selected' do
#     it 'displays an error prompting for a primary study area' do
#       create_account change_property(default_user, :primary_study_area, 'Select a primary study area')
#
#       expect(page).to have_content 'Please select primary study area'
#       expect(page).to have_css '#primary_study_area.field-error'
#     end
#   end
#
#   context 'creating an account with no country selected' do
#     it 'displays an error prompting for a country' do
#       create_account change_property(default_user, :country, 'Select a country')
#
#       expect(page).to have_content 'Please select country'
#       expect(page).to have_css '#country.field-error'
#     end
#   end
#
# end
