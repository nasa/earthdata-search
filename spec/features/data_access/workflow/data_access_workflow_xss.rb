require 'spec_helper'

describe 'Data Access workflow', reset: false do
  context 'when a malicious user attempts an XSS attack using the data access back link' do
    collection_id = 'C194001241-LPDAAC_ECS'

    before(:all) do
      login
      wait_for_xhr
      visit "/data/configure?p=!#{collection_id}&back=javascript:alert(%27ohai%27)//"
    end

    it 'uses a safe back link' do
      expect(page).to have_link('Back to Search Session')
      expect(page).to have_css("a[href^=\'/search/collections?p=!#{collection_id}\']")
    end
  end
end
