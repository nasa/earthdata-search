class DatasetExtra < ActiveRecord::Base
  def self.load_thumbnails
    params = {page_num: 0, page_size: 20}
    processed_count = 0

    begin
      params[:page_num] += 1
      response = Echo::Client.get_datasets(params)
      datasets = response.body
      hits = response.headers['echo-hits'].to_i

      datasets['feed']['entry'].each do |dataset|
        extra = DatasetExtra.find_or_create_by(echo_id: dataset['id'])

        # Skip datasets that we've seen before which have no browseable granules.  Saves tons of time
        if extra.has_browseable_granules.nil? || extra.has_browseable_granules
          granules = Echo::Client.get_granules(format: 'echo10', echo_collection_id: [dataset['id']], page_size: 1, browse_only: true).body

          granule = granules.first
          if granule
            extra.thumbnail_url = granule.browse_urls.first
            puts "First result for dataset has no browse: #{dataset['id']}" if extra.thumbnail_url.nil?
          end

          extra.has_browseable_granules = !granule.nil?
          extra.save
        end

        processed_count += 1

        puts "#{processed_count} / #{hits}"
      end
    end while processed_count < hits && datasets.size > 0

    nil
  end

  def self.load_granule_information
    response = Echo::Client.get_provider_holdings
    results = response.body
    hits = response.headers['echo-dataset-hits'].to_i

    processed_count = 0

    results.each do |result|
        extra = DatasetExtra.find_or_create_by(echo_id: result["echo_collection_id"])

        extra.has_granules = result["granule_count"].to_i > 0
        extra.save

        processed_count += 1

        puts "#{processed_count} / #{hits}"
    end
  end

  def self.decorate_all(datasets)
    ids = datasets.map {|r| r['id']}
    extras = DatasetExtra.where(echo_id: ids).index_by(&:echo_id)

    datasets.map! do |result|
      extra = extras[result['id']] || DatasetExtra.new
      extra.decorate(result)
    end
  end

  def decorate(dataset)
    dataset = dataset.dup.with_indifferent_access

    decorate_thumbnail(dataset)
    decorate_granule_information(dataset)
    decorate_gibs_layers(dataset)

    dataset
  end

  private

  def decorate_thumbnail(dataset)
    dataset[:thumbnail] = self.thumbnail_url
  end

  def decorate_granule_information(dataset)
    dataset[:has_granules] = self.has_granules
  end

  def decorate_gibs_layers(dataset)
    if dataset[:id] == 'C1000000016-LANCEMODIS'
      dataset[:gibs] = {
        product: 'MODIS_Terra_Snow_Cover',
        start_date: '2012-05-08',
        end_Date: '2014-02-06',
        format: 'png',
        resolution: '500m'
      }
    elsif dataset[:id] == 'C1000000019-LANCEMODIS'
      dataset[:gibs] = {
        product: 'MODIS_Terra_Aerosol',
        start_date: '2012-05-08',
        end_Date: '2014-02-06',
        maxNativeZoom: 5,
        format: 'png',
        resolution: '2km',
        arctic: false,
        antarctic: false
      }
    end
  end
end
