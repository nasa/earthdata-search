require "spec_helper"

describe "Portal site tour", reset: true do
  context "Visiting an Earthdata Search Provider Portal" do
    before :each do
      load_page :root, portal: 'simple'
    end

    context "clicking on the site tour button" do
      before :each do
        click_link 'Take a Tour'
      end

      it "opens the full Earthdata Search app in a new tab with the tour started", acceptance: true do
        expect(page).to have_no_popover('Welcome to Earthdata Search')
        within_window "Earthdata Search" do
          expect(page).to have_popover('Welcome to Earthdata Search')
        end
      end

    end
  end

  context "Visiting Earthdata Search with no portal selected" do
    before :each do
      load_page :root
    end

    context "clicking on the site tour button" do
      before :each do
        click_on 'End Tour'
        click_link 'Take a Tour'
      end

      it "proceeds through the tour without opening a new window", acceptance: true do
        expect(page).to have_popover('Welcome to Earthdata Search')
      end
    end
  end

end
