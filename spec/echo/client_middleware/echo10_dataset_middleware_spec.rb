require "spec_helper"

describe Echo::ClientMiddleware::Echo10DatasetMiddleware do
  let(:middleware) { Echo::ClientMiddleware::Echo10DatasetMiddleware.new }

  context 'when given parsed Echo10 dataset data' do
    let(:env) do
      # TODO Provide a more complete example so you can test transformations
      #      of science keywords, online access urls, etc
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

    let(:expected_body) do
      {
       'collection' => {
         # TODO Create a JSON representation of the parsed dataset here
       }
      }
    end

    it 'updates the parsed body to contain a list of datasets' do
      middleware.process_response(env)
      datasets = env[:body].dup
      expect(datasets).to be_instance_of(Array)
      expect(datasets.size).to eq(1)
      expect(datasets[0].as_json).to eq(expected_body['collection'])
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
