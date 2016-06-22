require "spec_helper"

describe "Data access status page", reset: false do
  context "when the current user has recent data retrievals" do
    before :all do
      Capybara.reset_sessions!
      Retrieval.destroy_all
      load_page :search, overlay: false
      login

      user = User.find_or_create_by(echo_id: '4C0390AF-BEE1-32C0-4606-66CAFDD4131D')

      retrievals = [
        {"query" => "p=C179003030-ORNL_DAAC",
         "collections" => [{
                          "id"=>"C179003030-ORNL_DAAC",
                          "params"=>"echo_collection_id=C179003030-ORNL_DAAC&sort_key%5B%5D=-start_date&page_size=20",
                          "serviceOptions"=>{"accessMethod"=>[{"method"=>"Download", "type"=>"download"}]}
                        }],
         "source" => "p=C179003030-ORNL_DAAC&m=0.0703125!0!2"},
        {"query" => "p=!C179003030-ORNL_DAAC!C179001887-SEDAC",
         "collections" => [{
                          "id"=>"C179003030-ORNL_DAAC",
                          "params"=>"echo_collection_id=C179003030-ORNL_DAAC&sort_key%5B%5D=-start_date&page_size=20",
                          "serviceOptions"=>{"accessMethod"=>[{"method"=>"Download", "type"=>"download"}]}
                        }, {
                          "id"=>"C179001887-SEDAC",
                          "params"=>"echo_collection_id=C179001887-SEDAC&sort_key%5B%5D=-start_date&page_size=20",
                          "serviceOptions"=>{"accessMethod"=>[]}}],
         "source"=>"p=!C179003030-ORNL_DAAC!C179001887-SEDAC"}
      ]
      retrievals.each do |jsondata|
        retrieval = Retrieval.new
        retrieval.user = user
        retrieval.jsondata = jsondata
        retrieval.save!
      end

      visit '/data/status'
    end

    after :all do
      Retrieval.destroy_all
    end

    it "displays a textual summary of recent retrievals" do
      expect(page).to have_content("15 Minute Stream Flow Data: USGS (FIFE) and 1 other collection")
    end

    it "displays an indication of how long ago orders were placed" do
      expect(page).to have_content("ago")
    end

    it "shows remove buttons next to items that can be removed" do
      expect(page).to have_selector('a[title="Remove Retrieval"]')
    end

    it "links to the data retrieval page" do
      expect(page).to have_css("a[href=\"/data/retrieve/#{Retrieval.first.to_param}\"]")
    end

    context "clicking the remove button" do
      before :all do
        within('tbody tr:first-child') do
          click_link "Remove Retrieval"
        end
      end

      after :all do
        visit '/data/status'
      end

      it "removes the collection from the list" do
        expect(page).to have_no_selector('tbody tr:nth-child(2)')
        expect(page).to have_selector('tbody tr', count: 1)
      end

      context "to remove the last retrieval" do
        before :all do
          within('tbody tr:first-child') do
            click_link "Remove Retrieval"
          end
        end

        it "removes the collection from the list" do
          expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")
        end

        it "indicates that there are no recent data retrievals" do
          expect(page).to have_content("No recent retrievals")
        end
      end
    end
  end

  context "when the current user has no recent data retrievals" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, overlay: false
      login
      visit '/data/status'
    end

    it "indicates that there are no recent retrievals" do
      expect(page).to have_content("No recent retrievals")
    end
  end

  context "when the current user tries to access an invalid retrieval ID" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, overlay: false
      login
      visit '/data/retrieve/not_a_valid_retrieval_id'
    end

    it "displays 404 page" do
      expect(page).to have_content("The page you were looking for doesn't exist.")
    end
  end
end
