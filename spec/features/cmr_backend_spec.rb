require 'spec_helper'

describe 'Client CMR Backend', reset: false do

  before(:all) do
    visit '/search?echo_env=testbed'
  end

  # EDSC-438
  it "uses the CMR as a backend for searches" do
    within('#master-overlay-parent') do
      expect(page).to have_content('Project')
    end
  end

  # EDSC-45
  it "shows granule counts loaded from the CMR among dataset results" do
    within('#dataset-results') do
      expect(page).to have_content('1 Granule')
    end
  end

  # EDSC-229
  it "shows dataset-only information loaded from the CMR among dataset results" do
    within('#dataset-results') do
      expect(page).to have_content('Dataset only')
    end
  end
end
