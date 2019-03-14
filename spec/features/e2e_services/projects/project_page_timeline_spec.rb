require 'rails_helper'

describe 'Project Page Timeline' do
  before :all do
    # Don't process retrievals
    Delayed::Worker.delay_jobs = true
  end

  after :all do
    Delayed::Worker.delay_jobs = false
  end

  timeline_date = DateTime.new(2010, 2, 15, 0, 0, 0, '+0')

  context 'when focusing on a timeline date on the search page' do
    before :all do
      load_page :search, focus: 'C1000000739-DEV08', env: :sit, authenticate: 'edsc'
      click_timeline_zoom_in
      pan_to_time(timeline_date)

      # focus timeline
      click_timeline_date('02')
    end

    it 'adds the override_temporal url param' do
      expect(page.current_url).to match(/ot=2010-02-02T00%3A00%3A00.000Z%2C2010-02-02T23%3A59%3A59.999Z/)
    end

    context 'when visiting the project page and downloading the data' do
      before :all do
        click_on 'Download All'

        collection_card = find('.project-list-item', match: :first)
        collection_card.find('.project-list-item-action-edit-options').click
        choose 'Stage for Delivery'
        click_on 'Download Data'
        wait_for_xhr
      end

      it 'adds the override_temporal to the Retrieval object' do
        retrieval = Retrieval.last
        expect(retrieval.jsondata['query']).to match(/override_temporal=2010-02-02T00%3A00%3A00.000Z%2C2010-02-02T23%3A59%3A59.999Z/)
      end
    end
  end

  context 'when focusing on a timeline date' do
    before :all do
      load_page :projects_page, project: ['C1000000739-DEV08'], env: :sit, authenticate: 'edsc'

      collection_card = find('.project-list-item', match: :first)
      collection_card.find('.project-list-item-action-edit-options').click
      choose 'Stage for Delivery'

      click_timeline_zoom_in
      pan_to_time(timeline_date)

      # focus timeline
      click_timeline_date('02')
    end

    it 'adds the override_temporal url param' do
      expect(page.current_url).to match(/ot=2010-02-02T00%3A00%3A00.000Z%2C2010-02-02T23%3A59%3A59.999Z/)
    end

    context 'when clicking download data' do
      before do
        click_on 'Download Data'
        wait_for_xhr
      end

      it 'adds the override_temporal to the Retrieval object' do
        retrieval = Retrieval.last
        expect(retrieval.jsondata['query']).to match(/override_temporal=2010-02-02T00%3A00%3A00.000Z%2C2010-02-02T23%3A59%3A59.999Z/)
      end
    end
  end

  context 'when focusing on a timeline date while temporal is applied' do
    before do
      load_page :projects_page, project: ['C1000000739-DEV08'], temporal: ['2010-02-01T00:00:00Z', '2010-02-16T23:59:59Z'], env: :sit, authenticate: 'edsc'

      collection_card = find('.project-list-item', match: :first)
      collection_card.find('.project-list-item-action-edit-options').click
      choose 'Stage for Delivery'

      click_timeline_zoom_in
      pan_to_time(timeline_date)

      # focus timeline
      click_timeline_date('02')
    end

    it 'prompts the user to pick which temporal they wish to use' do
      expect(page).to have_content('What temporal selection would you like to use?')
    end

    context 'when selecting the temporal constraint' do
      before do
        click_on 'Use Temporal Constraint'
        wait_for_xhr
      end

      it 'adds the override_temporal url param' do
        expect(page.current_url).to match(/ot=2010-02-01T00%3A00%3A00.000Z%2C2010-02-16T23%3A59%3A59.000Z/)
      end

      context 'when clicking download data' do
        before do
          click_on 'Download Data'
          wait_for_xhr
        end

        it 'adds the override_temporal to the Retrieval object' do
          retrieval = Retrieval.last
          expect(retrieval.jsondata['query']).to match(/override_temporal=2010-02-01T00%3A00%3A00.000Z%2C2010-02-16T23%3A59%3A59.000Z/)
        end
      end
    end

    context 'when selecting the focused date' do
      before do
        click_on 'Use Focused Time Span'
        wait_for_xhr
      end

      it 'adds the override_temporal url param' do
        expect(page.current_url).to match(/ot=2010-02-02T00%3A00%3A00.000Z%2C2010-02-02T23%3A59%3A59.999Z/)
      end

      context 'when clicking download data' do
        before do
          click_on 'Download Data'
          wait_for_xhr
        end

        it 'adds the override_temporal to the Retrieval object' do
          retrieval = Retrieval.last
          expect(retrieval.jsondata['query']).to match(/override_temporal=2010-02-02T00%3A00%3A00.000Z%2C2010-02-02T23%3A59%3A59.999Z/)
        end
      end
    end
  end

  context 'when focusing on a timeline date after configuring an access method' do
    before :all do
      load_page :projects_page, project: ['C1000000739-DEV08'], env: :sit, authenticate: 'edsc'

      collection_card = find('.project-list-item', match: :first)
      collection_card.find('.project-list-item-action-edit-options').click
      choose 'Customize'

      check 'Include Metadata and Processing History'

      click_timeline_zoom_in
      pan_to_time(timeline_date)

      # focus timeline
      click_timeline_date('02')
    end

    it 'does not reload the access methods' do
      expect(page).to have_checked_field('Include Metadata and Processing History')
    end

    context 'when filtering out all granules' do
      before do
        pan_to_time(DateTime.new(2012, 2, 15, 0, 0, 0, '+0'))

        # focus timeline
        click_timeline_date('02')
      end

      it 'disabled the Download Data button' do
        expect(page).to have_css('.button-download-data.button-disabled')
      end
    end
  end
end
