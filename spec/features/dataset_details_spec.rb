require 'spec_helper'

describe 'Dataset details' do
       before do
               visit '/'
       end

       shared_browser_session do
               it 'displays the dataset details' do
                       fill_in 'keywords', with: 'AST_L1AE'
                       expect(page).to have_content('ASTER Expedited L1A')
                       find('li', text: 'ASTER Expedited L1A').click
                       within('.master-overlay-details') do
                               expect(page).to have_content('ASTER Expedited L1A')
                       end
               end
       end
       
end
