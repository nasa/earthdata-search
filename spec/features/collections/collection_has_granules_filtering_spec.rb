require "spec_helper"

describe 'Collection has-granules filtering', reset: false do
  context "searching collections with 'show collections without granules' filter checked" do
    before :all do
      load_page :search, ac: true
    end

    it 'displays all collections' do
      expect(page).to have_content('32939 Matching Collections')
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
        expect(page.current_url).to have_content('ac=true')
        expect(page.current_url).to have_content('sp=0%2C0')
      end
    end
  end

  context "searching collections with 'show collections without granules' filter unchecked" do
    before :all do
      load_page :search, ac: false
    end

    it 'displays collections that have granules' do
      expect(page).to have_content('31572 Matching Collections')
    end
  end
end