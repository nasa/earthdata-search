require "spec_helper"

describe 'Collection include EOSIDS filtering', reset: false do
  context "searching collections with 'Include non-EOSDIS collections' filter checked" do
    before :all do
      load_page :search
      wait_for_xhr
      find(:css, "#hasNonEOSDIS").set(true)
    end

    it 'displays all collections' do
      expect(page).to have_content('31572 Matching Collections')
    end

    context 'applying another filter' do
      before :all do
        manually_create_point(0, 0)
        wait_for_xhr
      end

      after :all do
        clear_spatial
        wait_for_xhr
      end

      it 'keeps both filters' do
        expect(page.current_url).to have_content('sp=0%2C0')
      end
    end
  end

  context "searching collections with 'Include non-EOSDIS collections' filter unchecked" do
    before :all do
      load_page :search
      wait_for_xhr
      find(:css, "#hasNonEOSDIS").set(false)
    end

    it 'only displays EOSDIS collections' do
      expect(page).to have_content('4832 Matching Collections')
    end
  end
end