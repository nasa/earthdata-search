require "spec_helper"

describe "Backend environments", reset: false do

  context "Setting echo_env to 'ops'" do
    before :all do
      load_page :search, env: :ops, q: 'C179003030-ORNL_DAAC'
      wait_for_xhr
    end

    it "displays collections from PROD" do
      expect(first_collection_result).to have_text("15 Minute Stream Flow Data: USGS (FIFE)")
    end
  end

  context "Setting echo_env to 'partnertest'" do
    before :all do
      load_page :search, env: :uat, q: 'C446457-ORNL_DAAC'
      wait_for_xhr
    end

    it "displays collections from UAT" do
      expect(page).to have_text("A Global Database of Soil Respiration Data, Version 1.0")
    end
  end

  context "Setting echo_env to 'testbed'" do
    before :all do
      load_page :search, env: :sit, q: 'C1000000257-DEV07'
      wait_for_xhr
    end

    it "displays collections from SIT" do
      expect(first_collection_result).to have_text("ACRIM III Level 2 Daily Mean Data V001")
    end
  end

  context "Without specifying echo_env query param" do
    before :all do
      load_page :search, q: 'C179003030-ORNL_DAAC'
      wait_for_xhr
    end

    it "displays collections from the default environment" do
      expect(first_collection_result).to have_text("15 Minute Stream Flow Data: USGS (FIFE)")
    end
  end

  context "Setting echo_env value to an invalid value" do
    before :all do
      load_page :search, env: 'invalid', q: 'C179003030-ORNL_DAAC'
      wait_for_xhr
    end

    it "displays collections from the default environment" do
      expect(first_collection_result).to have_text("15 Minute Stream Flow Data: USGS (FIFE)")
    end
  end
end