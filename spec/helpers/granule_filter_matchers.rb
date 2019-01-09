RSpec::Matchers.define :filter_granules_from do |expected|
  match do |selector|
    wait_for_xhr
    synchronize do
      after_granule_count = selector.text.match(/(\d+) Granule/).captures.first.to_i

      expect(expected).to be > after_granule_count
    end
  end
end

RSpec::Matchers.define :reset_granules_to do |expected|
  match do |selector|
    wait_for_xhr
    synchronize do
      raise 'Granules not displayed' unless selector.text =~ /(\d+) Granules/
      expect(Regexp.last_match(1).to_i).to be >= expected.to_i
    end
  end
end
