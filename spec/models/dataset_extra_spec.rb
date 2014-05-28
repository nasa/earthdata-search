require 'spec_helper'

describe DatasetExtra do
  context "result decoration" do
    it "adds thumbnail URLs to results" do
      granule = 'browseable_granule'
      dataset_hash = {}
      extra = DatasetExtra.new(browseable_granule: granule)
      result = extra.decorate(dataset_hash)
      expect(result[:browseable_granule]).to eq(granule)
    end

    it "adds a flag indicating whether a dataset has granules to the results" do
      dataset_hash = {}
      extra = DatasetExtra.new(has_granules: true)
      result = extra.decorate(dataset_hash)
      expect(result[:has_granules]).to eq(true)
    end
  end
end
