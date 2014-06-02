class DatasetExtra < ActiveRecord::Base
  def self.load
    response = Echo::Client.get_provider_holdings
    results = response.body
    hits = response.headers['echo-dataset-hits'].to_i

    processed_count = 0

    results.each do |result|
      id = result['echo_collection_id']
      extra = DatasetExtra.find_or_create_by(echo_id: id)

      extra.has_granules = result["granule_count"].to_i > 0
      extra.has_browseable_granules = false unless extra.has_granules

      if extra.has_granules
        if extra.has_browseable_granules.nil? || (extra.has_browseable_granules && extra.browseable_granule.nil?)
          browseable = Echo::Client.get_granules(format: 'json',
                                                 echo_collection_id: [id],
                                                 page_size: 1, browse_only: true).body['feed']['entry']
          extra.has_browseable_granules = browseable.size > 0
          if extra.has_browseable_granules
            extra.granule = extra.browseable_granule = browseable.first['id']
          end
        end
        if extra.granule.nil?
          granules = Echo::Client.get_granules(format: 'json',
                                               echo_collection_id: [id],
                                               page_size: 1).body['feed']['entry']

          extra.granule = granules.first['id'] if granules.first
        end
        puts "Provider has granules but no granules found: #{result['echo_collection_id']}" unless extra.granule
      end

      extra.save

      processed_count += 1

      puts "#{processed_count} / #{hits}"
    end
  end

  def self.load_option_defs
    params = {page_num: 0, page_size: 20}
    processed_count = 0

    begin
      params[:page_num] += 1
      response = Echo::Client.get_datasets(params)
      datasets = response.body
      hits = response.headers['echo-hits'].to_i

      datasets['feed']['entry'].each do |dataset|
        # Skip datasets that we've seen before which have no browseable granules.  Saves tons of time
        granules = Echo::Client.get_granules(format: 'json', echo_collection_id: [dataset['id']], page_size: 1).body

        granule = granules['feed']['entry'].first
        if granule
          order_info = Echo::Client.get_order_information([granule['id']], nil).body
          refs = Array.wrap(order_info).first['order_information']['option_definition_refs']
          if refs
            opts = refs.map {|r| [r['id'], r['name']]}
            puts "#{dataset['id'].inspect} => #{opts.inspect},"
          end
        end

        processed_count += 1

        #puts "#{processed_count} / #{hits}"
      end
    end while processed_count < hits && datasets.size > 0

    nil
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

    decorate_browseable_granule(dataset)
    decorate_granule_information(dataset)
    decorate_gibs_layers(dataset)

    dataset
  end

  private

  def decorate_browseable_granule(dataset)
    dataset[:browseable_granule] = self.browseable_granule
  end

  def decorate_granule_information(dataset)
    dataset[:has_granules] = self.has_granules
  end

  def decorate_gibs_layers(dataset)
    if Rails.env.development? && dataset[:id] == 'C90757596-LAADS'
      # DELETE ME BEFORE GOING TO PRODUCTION
      # Fake GIBS visualization for demonstrating compositing
      dataset[:gibs] = {
        name: 'Corrected Reflectance (True Color)',
        source: 'Terra / MODIS',
        product: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        resolution: '250m',
        format: 'jpeg'
      }
    end

    if dataset[:id] == 'C1000000016-LANCEMODIS'
      dataset[:gibs] = {
        product: 'MODIS_Terra_Snow_Cover',
        format: 'png',
        resolution: '500m'
      }
    elsif dataset[:id] == 'C1000000019-LANCEMODIS'
      dataset[:gibs] = {
        product: 'MODIS_Terra_Aerosol',
        maxNativeZoom: 5,
        format: 'png',
        resolution: '2km',
        arctic: false,
        antarctic: false
      }
    end
  end
end
