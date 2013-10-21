require "spec_helper"

describe Echo::ClientMiddleware::AtomDatasetMiddleware do
  let(:middleware) { Echo::ClientMiddleware::AtomDatasetMiddleware.new }

  context 'when given parsed Atom dataset data' do
    let(:env) do
      { body: {
          'feed' => {
            'title' => 'ECHO dataset metadata',
            'entry' => [
                        {
                          'id' => 'id1',
                          'dataset_id' => 'dataset_id1',
                          'summary' => 'summary1',
                          'updated' => 'updated1',
                          'short_name' => 'short_name1',
                          'version_id' => '',
                          'data_center' => '',
                          'archive_center' => '',
                          'processing_level_id' => '',
                          'time_start' => '',
                          'links' => '',
                          'boxes' => '',
                          'dif_ids' => '',
                          'online_access_flag' => '',
                          'browse_flag' => '',
                        },
                        {
                          'id' => 'id2'
                        }
                       ]
          }
        }
      }
    end

    it 'updates the parsed body to contain a list of datasets' do
      original_body = env[:body]
      middleware.process_response(env)
      datasets = env[:body]
      expect(datasets).to be_instance_of(Array)
      expect(datasets.size).to eq(2)
      expect(datasets[0].as_json).to eq(original_body["feed"]["entry"][0])
    end

  end

  it 'does not operate on response strings' do
    env = { body: '{"feed":{"title":"ECHO dataset metadata"}}' }
    expect(middleware.parse_response?(env)).to be_false
  end

  it 'does not operate on hashes containing parsed Atom granule data' do
    env = { body: { 'feed' => { 'title' => 'ECHO granule metadata' } } }
    expect(middleware.parse_response?(env)).to be_false
  end
end
