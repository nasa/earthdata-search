require 'rake'
require 'net/http'
require 'json'

namespace :gibs do
  desc "Create gibs.yml configuration file"
  task :configure do
    json = JSON.parse(Net::HTTP.get(URI('https://earthdata.nasa.gov/labs/worldview/config/wv.json')))

    layers = json['layers']
    products = json['products']

    layers.each do |key, layer|
      layer['product'] = products[layer['product']]

      layer['projections'] ||= {}
      layer['projections'].delete_if do |key, value|
        !['GIBS:antarctic', 'GIBS:arctic', 'GIBS:geographic'].include?(value['source'])
      end
    end

    layers.reject! do |key, layer|
      layer['projections'].size == 0 || layer['type'] != 'wmts' || layer['product'].nil?
    end

    configs = {}

    layers.each do |key, layer|
      config = {}
      match = {}
      product = layer['product']
      query = product['query']

      match['time_start'] = ">=#{layer['startDate']}" if layer['startDate']
      match['time_end'] = "<=#{layer['endDate']}" if layer['endDate']

      match['day_night_flag'] = query['dayNightFlag'] if query['dayNightFlag']

      config = {
        match: match,
        product: layer['id'],
        maxNativeZoom: 5,
        title: layer['title'],
        source: layer['subtitle'],
        format: layer['format'].split('/').last,
        resolution: layer['projections'].first.last['matrixSet'].split('_').last,
        geo: layer['projections'].key?('geographic'),
        arctic: layer['projections'].key?('arctic'),
        antarctic: layer['projections'].key?('antarctic')
      }

      datacenter = Array.wrap(query['dataCenterId'])
      shortname = Array.wrap(query['shortName'])

      ['science', 'nrt'].each do |query_type|
        if query[query_type]
          datacenter += Array.wrap(query[query_type]['dataCenterId'])
          shortname += Array.wrap(query[query_type]['shortName'])
        end
      end

      if datacenter.size == 0
        # Secial cases of bad config
        special = {
          'OMSO2' => 'GSFCS4PA'
        }
        datacenter << special[shortname.first] if special.key?(shortname.first)
        $stderr.puts "Bad configuration: #{shortname}" if datacenter.size == 0
      end

      if datacenter.size == 1 && shortname.size ==1
        key = [datacenter, shortname].join('___')
        configs[key] ||= []
        configs[key] << config
      else
        datacenter << datacenter.first if datacenter.size == 1
        shortname << shortname.first if shortname.size == 1

        key1 = [datacenter.first, shortname.first].join('___')
        key2 = [datacenter.second, shortname.second].join('___')
        configs[key1] ||= []
        configs[key1] << config
        configs[key2] ||= []
        configs[key2] << config
      end
    end

    File.open("config/gibs.json","w") do |f|
      f.write(JSON.pretty_generate(configs))
    end
  end
end

task gibs: ['gibs:configure']
