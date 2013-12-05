require "spec_helper"

describe Echo::ClientMiddleware::Echo10DatasetMiddleware do
  let(:middleware) { Echo::ClientMiddleware::Echo10DatasetMiddleware.new }

  context 'when given parsed Echo10 dataset data' do
    let(:env) do
      { body: {
          'Collection' => {
            'ShortName' => '',
            'VersionId' => '',
            'LongName' => '',
            'DataSetId' => '',
            'Description' => '',
            'Orderable' => '',
            'Visible' => '',
            'ArchiveCenter' => '',
            'ProcessingCenter' => '',
            'ProcessingLevelId' => '',
            'Temporal' => '',
            'Contacts' => '',
            'ScienceKeywords' => '',
            'OnlineAccessURLs' => '',
            'OnlineResources' => '',
            'AssociatedDIFs' => '',
            'Spatial' => ''
          }
        }
      }
    end

    it 'updates the parsed body to contain a list of datasets' do
      original_body = env[:body]
      middleware.process_response(env)
      datasets = env[:body]
      expect(datasets).to be_instance_of(Array)
      expect(datasets.size).to eq(1)
      expect(datasets[0]).to eq(original_body["Collection"])
    end

  end

  it 'does not operate on response strings' do
    env = { body: '{"Collection":{"title":"ECHO dataset metadata"}}' }
    expect(middleware.parse_response?(env)).to be_false
  end

  it 'does not operate on hashes containing parsed Atom granule data' do
    env = { body: { 'feed' => { 'title' => 'ECHO granule metadata' } } }
    expect(middleware.parse_response?(env)).to be_false
  end
end
