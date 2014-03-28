RSpec::Matchers.define :have_no_selections do
  match do |page|
    expect(page).to have_no_selector(".timeline-selection *")
  end
end

RSpec::Matchers.define :have_fencepost do |expected|
  match do |page|
    time = expected.to_time.to_i * 1000

    synchronize do
      position = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{time})"
      # We match against the first few significant figures because there seems to be a double -> float
      # conversion going on in capybara-webkit that messes with precision.  Poltergeist gets it right.
      matches = page.all(".timeline-selection line[x1^=\"#{position.to_s[0, 3]}\"]")
      expect(matches.size).to be > 0
    end
  end
end

RSpec::Matchers.define :have_highlighted_selection do |start, stop|
  match do |page|
    start_time = start.to_time.to_i * 1000
    stop_time = stop.to_time.to_i * 1000

    synchronize do
      start_pos = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{start_time})"
      stop_pos = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{stop_time})"
      width = stop_pos - start_pos

      matches = page.all(".timeline-selection rect[x^=\"#{start_pos.to_s[0, 3]}\"][width^=\"#{width.to_s[0, 3]}\"]")

      expect(matches.size).to be > 0
    end

    expect(page).to have_fencepost(start)
    expect(page).to have_fencepost(stop)
  end
end
