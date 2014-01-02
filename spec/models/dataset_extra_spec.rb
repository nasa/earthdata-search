require 'spec_helper'

describe DatasetExtra do
  context "result decoration" do
    it "adds thumbnail URLs to results" do
      thumbnail_url = 'http://example.com/thumbnail.jpg'
      dataset_hash = {}
      extra = DatasetExtra.new(thumbnail_url: thumbnail_url)
      result = extra.decorate(dataset_hash)
      expect(result[:thumbnail]).to eq(thumbnail_url)
    end
  end
end
