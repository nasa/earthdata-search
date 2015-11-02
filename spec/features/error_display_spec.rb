# EDSC-247: Allow retrying collection and granule searches after timeout errors

require "spec_helper"

describe "Displaying system errors", reset: false do

  before :all do
    load_page :search
  end

  context 'when a system error occurs' do
    before :all do
      fill_in 'keywords', with: 'trigger500'
      wait_for_xhr
    end

    it "displays an error message containing the type of request that caused the error" do
      expect(page.find('.banner-error')).to have_text('Error retrieving collections')
    end

    it "displays the readable message from the server, if available" do
      expect(page).to have_text('Some error string')
    end

    it "displays a link to retry requests" do
      expect(page).to have_link('Retry')
    end

    context 'and the user performs a subsequent successful request' do
      before :all do
        fill_in 'keywords', with: ' '
        wait_for_xhr
      end

      after :all do
        fill_in 'keywords', with: 'trigger500'
      end

      it 'removes the error message' do
        expect(page).to have_no_text('Error retrieving collections')
      end
    end
  end
end
