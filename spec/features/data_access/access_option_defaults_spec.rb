require "spec_helper"

# Reset because this spec is heavily dependent on the database, which gets
# cleared between runs
describe "Access Option Defaults", reset: true do
  collection_id = 'C90762182-LAADS'
  collection_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 250m V005'

  page_options = {project: [collection_id], temporal: ['2016-01-21T00:00:00Z', '2016-01-21T00:00:01Z']}

  let(:echo_id) { "4C0390AF-BEE1-32C0-4606-66CAFDD4131D" }

  before :each do
    load_page :search, overlay: false
    login
  end

  after :each do
    wait_for_xhr
    AccessConfiguration.destroy_all if page.server.responsive?
  end

  context "accessing a collection with preferences for a method that no longer exists" do
    before :each do
      user = User.find_or_create_by(echo_id: echo_id)
      options = {
        'accessMethod' => [{'method' => 'stale', 'model' => '<broken/>', 'rawModel' => '<broken/>', 'type' => 'order'}]
      }
      AccessConfiguration.set_default_access_config(user, collection_id, options, nil)
      load_page 'data/configure', page_options
    end

    it "presents default options" do
      expect(page).to have_unchecked_field('Download')
      expect(page).to have_unchecked_field('Stage for Delivery')
      expect(page).to have_no_text('Ftp Pull Information')
    end
  end

  context "accessing a collection with order preferences that are no longer valid" do
    before :each do
      user = User.find_or_create_by(echo_id: echo_id)
      options = {
        'accessMethod' => [{'method' => 'stale', 'model' => '<broken/>', 'rawModel' => '<broken/>', 'type' => 'order'}]
      }
      AccessConfiguration.set_default_access_config(user, collection_id, options, [{'id' => 'test', 'form_hash' => 'stale'}])
      load_page 'data/configure', page_options
    end

    it "presents default options for the order" do
      expect(page).to have_unchecked_field('Download')
      expect(page).to have_unchecked_field('Stage for Delivery')
    end
  end

  context "accessing a collection with order preferences that are changed" do
    before :each do
      user = User.find_or_create_by(echo_id: echo_id)
      options = {
          'accessMethod' => [{'method' => 'stale', 'model' => '<broken/>', 'rawModel' => '<broken/>', 'type' => 'order'}]
      }
      AccessConfiguration.set_default_access_config(user, collection_id, options, [{'id' => '7E65A0BF-6A43-1891-1A2E-D6D8CBF01768', 'form_hash' => 'original_hash'}])
      load_page 'data/configure', page_options
    end

    it "presents default options for the order" do
      expect(page).to have_unchecked_field('Download')
      expect(page).to have_unchecked_field('Stage for Delivery')
    end
  end

  context "accessing a collection for the first time" do
    before :each do
      load_page 'data/configure', page_options
      wait_for_xhr
    end

    it "presents default options" do
      expect(page).to have_unchecked_field('Download')
      expect(page).to have_unchecked_field('Stage for Delivery')
    end
  end

  context "accessing a collection for a second time" do
    before :each do
      load_page 'data/configure', page_options
      wait_for_xhr

      choose 'Direct Download'
      click_on 'Add access method'

      within '.access-item-selection:nth-child(4)' do
        choose 'Stage for Delivery'
      end

      select 'FtpPull', from: 'Distribution Options'

      click_on 'Continue'
      click_on 'Submit'
      wait_for_xhr
      expect(page).to have_content('The following collections are being processed')
      expect(page).to have_content(collection_title)

      load_page 'data/configure', page_options
      wait_for_xhr
    end

    it "restores options from the first retrieval" do
      within '.access-item-selection:nth-child(1)' do
        expect(page).to have_checked_field('Download')
        expect(page).to have_unchecked_field('Stage for Delivery')
      end

      within '.access-item-selection:nth-child(4)' do
        expect(page).to have_unchecked_field('Download')
        expect(page).to have_checked_field('Stage for Delivery')
      end

      expect(page).to have_select('Distribution Options', selected: 'FtpPull')
    end

    context "with corrupted data in the database" do
      before :all do
        latest = AccessConfiguration.last
        # Insert an invalid piece of data here which used to trigger an error.
        AccessConfiguration.connection.execute("INSERT INTO access_configurations (id, user_id, dataset_id, echoform_digest) VALUES (#{latest.nil? ? 1 : latest.id + 1}, 1, 'C90762182-LAADS', '\"[{\"id\":\"download\"}]\"')")
        load_page 'data/configure', page_options
        wait_for_xhr
      end

      it "doesn't display an error and loads the default configuration" do
        expect(page).not_to have_content("Error retrieving options There was a problem completing the request Retry")
        expect(page).to have_unchecked_field('Download')
        expect(page).to have_unchecked_field('Stage for Delivery')
      end
    end
  end

  context "accessing a collection for the third time" do
    before :each do
      load_page 'data/configure', page_options
      wait_for_xhr

      choose 'Direct Download'
      click_on 'Add access method'

      within '.access-item-selection:nth-child(4)' do
        choose 'Stage for Delivery'
      end

      select 'FtpPull', from: 'Distribution Options'

      click_on 'Continue'
      click_on 'Submit'
      expect(page).to have_content('The following collections are being processed')

      load_page 'data/configure', page_options
      wait_for_xhr

      within '.access-item-selection:nth-child(4)' do
        click_on 'Remove access method'
      end

      click_on 'Submit'
      wait_for_xhr
      expect(page).to have_link('View/Download Data Links')
      expect(page).to have_no_content('The following collections are being processed')

      load_page 'data/configure', page_options
      wait_for_xhr
    end

    it "restores options from the second retrieval" do
      expect(page).to have_css('.access-item-selection', count: 1)
      expect(page).to have_checked_field('Download')
      expect(page).to have_unchecked_field('Stage for Delivery')
    end
  end

end
