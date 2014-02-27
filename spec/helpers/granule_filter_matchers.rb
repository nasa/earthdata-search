RSpec::Matchers.define :filter_granules_from do |expected|
  match do |selector|
    click_button "granule-filters-submit"
    expect(selector).to have_no_content(expected.to_s + ' Granules')
    expect(selector).to have_css(".button-highlighted")

    number_granules = expect(selector.text).to match_regex /\d+ Granule/
    after_granule_count = number_granules.to_s.split(" ")[0].to_i

    expected > after_granule_count
  end
end

RSpec::Matchers.define :reset_granules_to do |expected|
  match do |selector|
    expect(selector).to have_content(expected.to_s + ' Granules')
  end
end
