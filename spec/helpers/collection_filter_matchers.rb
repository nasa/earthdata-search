RSpec::Matchers.define :filter_collections_from do |expected|
  match do |selector|
    wait_for_xhr
    synchronize do
      number_collections = expect(selector.text).to match_regex /\d+ Matching Collections/
      after_collection_count = number_collections.to_s.split(" ")[0].to_i

      expect(expected).to be > after_collection_count
    end
  end
end