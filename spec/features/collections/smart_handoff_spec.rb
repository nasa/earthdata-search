require 'rails_helper'

describe 'Smart Handoff' do
  let(:giovanni_link) { 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&starttime=2016-01-01T00%3A00%3A00.000Z&endtime=2016-12-31T23%3A59%3A59.000Z&bbox=-10%2C-10%2C10%2C10&searchTerms=C1200187767-EDF_OPS&dataKeyword=AIRX3STD' }

  before do
    load_page :search, env: :sit, sb: [-10, -10, 10, 10], temporal: ['2016-01-01T00:00:00Z', '2016-12-31T23:59:59Z']
  end

  context 'when viewing the collection details page' do
    context 'when viewing a collection with a smart handoff tag' do
      before do
        fill_in 'keywords', with: 'C1200187767-EDF_OPS'
        wait_for_xhr
        first_collection_result.click_link('View collection details')
        wait_for_xhr
        within '.handoff-dropdown' do
          find('a.button-icon-ellipsis').click
        end
      end

      it 'displays a Giovanni smart handoff link' do
        within 'ul.handoff-links' do
          expect(page).to have_link('Giovanni', href: giovanni_link)
        end
      end
    end

    context 'when viewing a collection without a smart handoff tag' do
      before do
        fill_in 'keywords', with: 'C1200269572-E2E_18_3'
        wait_for_xhr
        first_collection_result.click_link('View collection details')
        wait_for_xhr
      end

      it 'does not display a smart handoff link' do
        expect(page).to have_no_css('div.handoff-dropdown')
      end
    end
  end

  context 'when viewing the granules page' do
    context 'when viewing a collection with a smart handoff tag' do
      before do
        fill_in 'keywords', with: 'C1200187767-EDF_OPS'
        wait_for_xhr
        first_collection_result.click
        wait_for_xhr
        within '.handoff-dropdown' do
          find('a.button-icon-ellipsis').click
        end
      end

      it 'displays a Giovanni smart handoff link' do
        within 'ul.handoff-links' do
          expect(page).to have_link('Giovanni', href: giovanni_link)
        end
      end
    end

    context 'when viewing a collection without a smart handoff tag' do
      before do
        fill_in 'keywords', with: 'C1200269572-E2E_18_3'
        wait_for_xhr
        first_collection_result.click
        wait_for_xhr
      end

      it 'does not display a smart handoff link' do
        expect(page).to have_no_css('div.handoff-dropdown')
      end
    end
  end
end
