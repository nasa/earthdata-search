require 'spec_helper'

describe 'Dataset metadata' do
  before do
    visit '/'
    fill_in 'keywords', with: 'AST_L1AE'
    find('li', text: 'ASTER Expedited L1A').click
    click_link 'Metadata'
  end

  shared_browser_session do
    it 'downloads metadata in native format' do
      click_link 'Native'
      page.response_headers['Content-Type'].should eq("application/echo10+xml;charset=utf-8")
    end

    it 'downloads metadata in atom format' do
      click_link 'ATOM'
      page.response_headers['Content-Type'].should eq("application/atom+xml;charset=utf-8")
    end

    it 'downloads metadata in echo10 format' do
      click_link 'ECHO 10'
      page.response_headers['Content-Type'].should eq("application/echo10+xml;charset=utf-8")
    end

    it 'downloads metadata in iso 19115 format' do
      click_link 'ISO 19115'
      page.response_headers['Content-Type'].should eq("application/iso19115+xml;charset=utf-8")
    end
    
    it 'downloads metadata in smapiso format'
  end
end
