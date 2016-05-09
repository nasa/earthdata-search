require "spec_helper"

describe "Portal escape link", reset: false do
  context "Visiting an Earthdata Search portal" do
    before :all do
      load_page :search, portal: 'simple', q: 'modis'
    end

    it "provides an obvious link to the non-portal view of Earthdata Search which preserves the current filters", acceptance: true do
      expect(page).to have_link('Leave the Simple Portal')
      expect(page).to have_text('Looking for more collections? Leave the Simple Portal')

      click_link 'Leave the Simple Portal'
      expect(page).to have_no_path_prefix("/portal")
      wait_for_xhr
      expect(page.find_field('keywords').value).to eql('modis')
    end
  end

  context "Visiting Earthdata Search with no portal selected" do
    before :all do
      load_page :search
    end

    it "provides no link to leave a portal view" do
      expect(page).to have_no_link('Leave the Earthdata Search Portal')
      expect(page).to have_no_text('Looking for more collections?')
    end
  end
end
