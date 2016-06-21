RSpec::Matchers.define :filter_granules_from do |expected|
  match do |selector|
    wait_for_xhr
    synchronize do
      number_granules = expect(selector.text).to match_regex /\d+ Granule/
      after_granule_count = number_granules.to_s.split(" ")[0].to_i

      expect(expected).to be > after_granule_count
    end
  end
end

RSpec::Matchers.define :reset_granules_to do |expected|
  match do |selector|
    wait_for_xhr
    synchronize do
      raise "Granules not displayed" unless selector.text =~ /(\d+) Granules/
      expect($1.to_i).to be >= expected.to_i
    end
  end
end
