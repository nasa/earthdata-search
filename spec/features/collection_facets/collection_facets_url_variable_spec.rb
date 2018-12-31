require 'rails_helper'

describe 'Collection Facet URL Query Params' do
  context 'When selecting a Keywords [Topic] facet' do
    before :all do
      load_page :search, facets: true
      find('h3.panel-title', text: 'Keywords').click

      within '.keywords' do
        find('.facets-item', text: 'Atmosphere', match: :prefer_exact).click
        wait_for_xhr
      end
    end

    it 'adds the appropriate param to the query string' do
      uri = URI.parse(current_url)
      expect(uri.query).to have_content('fst0=')
    end

    context 'When selecting a Keywords [Term] facet' do
      before :all do
        within '.keywords' do
          find('.facets-item', text: 'Atmospheric Water Vapor', match: :prefer_exact).click
          wait_for_xhr
        end
      end

      it 'adds the appropriate param to the query string' do
        uri = URI.parse(current_url)
        expect(uri.query).to have_content('fsm0=')
      end

      context 'When selecting a Keywords [Variable Level 1] facet' do
        before :all do
          within '.keywords' do
            find('.facets-item', text: 'Water Vapor Indicators', match: :prefer_exact).click
            wait_for_xhr
          end
        end

        it 'adds the appropriate param to the query string' do
          uri = URI.parse(current_url)
          expect(uri.query).to have_content('fs10=')
        end

        context 'When selecting a Keywords [Variable Level 2] facet' do
          before :all do
            within '.keywords' do
              all('.facets-item', text: 'Humidity', match: :prefer_exact).last.click
              wait_for_xhr
            end
          end

          it 'adds the appropriate param to the query string' do
            uri = URI.parse(current_url)
            expect(uri.query).to have_content('fs20=')
          end

          context 'When selecting a Keywords [Variable Level 3] facet' do
            before :all do
              within '.keywords' do
                find('.facets-item', text: 'Specific Humidity', match: :prefer_exact).click
                wait_for_xhr
              end
            end

            it 'adds the appropriate param to the query string' do
              uri = URI.parse(current_url)
              expect(uri.query).to have_content('fs30=')
            end

            # Can't find a detailed variable to select for this test
            context 'When selecting a Keywords [Detailed Variable] facet', pending_updates: true do
              before :all do
                within '.keywords' do
                  find('.facets-item', text: 'Inversion Height', match: :prefer_exact).click
                  wait_for_xhr
                end
              end

              it 'adds the appropriate param to the query string' do
                uri = URI.parse(current_url)
                expect(uri.query).to have_content('fsd0=')
              end
            end
          end
        end
      end
    end
  end

  context 'When selecting a Platforms facet' do
    before :all do
      load_page :search, facets: true
      find('h3.panel-title', text: 'Platforms').click

      within '.platforms' do
        find('.facets-item', match: :first).click
        wait_for_xhr
      end
    end

    it 'adds the appropriate param to the query string' do
      uri = URI.parse(current_url)
      expect(uri.query).to have_content('fp=')
    end
  end

  context 'When selecting a Instruments facet' do
    before :all do
      load_page :search, facets: true
      find('h3.panel-title', text: 'Instruments').click

      within '.instruments' do
        find('.facets-item', match: :first).click
        wait_for_xhr
      end
    end

    it 'adds the appropriate param to the query string' do
      uri = URI.parse(current_url)
      expect(uri.query).to have_content('fi=')
    end
  end

  context 'When selecting a Organizations facet' do
    before :all do
      load_page :search, facets: true
      find('h3.panel-title', text: 'Organizations').click

      within '.organizations' do
        find('.facets-item', match: :first).click
        wait_for_xhr
      end
    end

    it 'adds the appropriate param to the query string' do
      uri = URI.parse(current_url)
      expect(uri.query).to have_content('fdc=')
    end
  end

  context 'When selecting a Projects facet' do
    before :all do
      load_page :search, facets: true
      find('h3.panel-title', text: 'Projects').click

      within '.projects' do
        find('.facets-item', match: :first).click
        wait_for_xhr
      end
    end

    it 'adds the appropriate param to the query string' do
      uri = URI.parse(current_url)
      expect(uri.query).to have_content('fpj=')
    end
  end

  context 'When selecting a Processing levels facet' do
    before :all do
      load_page :search, facets: true
      find('h3.panel-title', text: 'Processing levels').click

      within '.processing-levels' do
        find('.facets-item', match: :first).click
        wait_for_xhr
      end
    end

    it 'adds the appropriate param to the query string' do
      uri = URI.parse(current_url)
      expect(uri.query).to have_content('fl=')
    end
  end
end
