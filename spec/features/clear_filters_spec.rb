require 'rails_helper'

describe "'Clear Filters' button" do
  before :all do
    load_page :search, facets: true, env: :sit
  end

  it 'clears keywords' do
    fill_in 'keywords', with: 'AST_L1A'
    expect(page).to have_content('ASTER L1A')

    click_link 'Clear Filters'
    expect(page).to have_no_content('ASTER L1A')
    expect(page.find('#keywords')).to have_no_text('AST_L1A')
  end

  it 'clears spatial' do
    create_point(0, 0)
    wait_for_xhr
    collections_within_point = find('.master-overlay-tab-title strong').text
    click_link 'Clear Filters'
    wait_for_xhr
    collections_without_point = find('.master-overlay-tab-title strong').text
    expect(collections_without_point.to_i).to be > collections_within_point.to_i
  end

  context 'clears temporal' do
    after :each do
      click_link 'Clear Filters'
      wait_for_xhr
    end

    it 'range' do
      script = "var temporal = edsc.models.page.current.query.temporal.applied;
                temporal.start.date(new Date('1978-12-01T00:00:00Z'));
                temporal.stop.date(new Date('1979-12-01T00:00:00Z'));
                temporal.isRecurring(false);
                null;"
      page.execute_script(script)

      expect(page).to have_current_path(/qt=1978-12-01T00%3A00%3A00.000Z%2C1979-12-01T00%3A00%3A00.000Z/)

      click_link 'Clear Filters'

      expect(page).to_not have_current_path(/qt=1978-12-01T00%3A00%3A00.000Z%2C1979-12-01T00%3A00%3A00.000Z/)
    end

    it 'recurring' do
      script = "var temporal = edsc.models.page.current.query.temporal.applied;
                temporal.start.date(new Date('1970-12-01T00:00:00Z'));
                temporal.stop.date(new Date('1975-12-01T00:00:00Z'));
                temporal.isRecurring(true);
                null;"
      page.execute_script(script)

      expect(page).to have_current_path(/qt=1970-12-01T00%3A00%3A00.000Z%2C1975-12-01T00%3A00%3A00.000Z%2C335%2C335/)

      click_link 'Clear Filters'

      expect(page).to_not have_current_path(/qt=1970-12-01T00%3A00%3A00.000Z%2C1975-12-01T00%3A00%3A00.000Z%2C335%2C335/)
    end
  end

  it 'clears facets' do
    # 'Features' facet is already expanded, no need to click it
    find('.facets-item', text: 'Map Imagery').click

    within(:css, '.features') do
      expect(page).to have_content('Map Imagery')
      expect(page).to have_css('.facets-item.selected')
    end

    click_link 'Clear Filters'

    expect(page).to have_no_css('.facets-item.selected')
  end
end
