class GranuleDetailsPresenter < DetailsPresenter
  def initialize(granule, granule_id=nil, token=nil, env='prod')
    @granule = granule
    @granule.id = granule_id

    metadata_url = "#{Rails.configuration.services['earthdata'][env]['cmr_root']}/search/concepts/#{@granule.id}"
    url_token = "?token=#{token}:#{client_id(env)}" if token
    @granule.native_url = "#{metadata_url}#{url_token}"
    @granule.atom_url = "#{metadata_url}.atom#{url_token}"
    @granule.echo10_url = "#{metadata_url}.echo10#{url_token}"
    @granule.iso19115_url = "#{metadata_url}.iso19115#{url_token}"

    xml = @granule.xml.to_xml(:root => 'Granule', :skip_instruct => true, :indent => 2)
    xml.gsub!("<Granule>\n", '') # Remove top level element
    xml.gsub!(/<(\w+)>/, '\1: ') # Remove '<>' from around opening brackets and add ': '
    xml.gsub!(/<\/\w+>/, '') # Remove all closing brackets
    xml.gsub!(/^\s*$\n/, '') # Remove empty lines
    xml.gsub!(/^\s*<\w+\s+\w+="\w+"(|\/)>$\n/, '') # Remove empty elements with attributes
    @granule.xml = xml
  end
end
