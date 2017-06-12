class GranuleDetailsPresenterEcho10 < DetailsPresenterEcho10
  def initialize(granule, granule_id=nil, token=nil, env='prod')
    @granule = granule
    @granule.id = granule_id

    metadata_url = "#{Rails.configuration.services['earthdata'][env]['cmr_root']}/search/concepts/#{@granule.id}"
    @granule.native_url = "#{metadata_url}"
    @granule.atom_url = "#{metadata_url}.atom"
    @granule.echo10_url = "#{metadata_url}.echo10"
    @granule.iso19115_url = "#{metadata_url}.iso19115"

    xml = @granule.xml.to_xml(:root => 'Granule', :skip_instruct => true, :indent => 2)
    xml.gsub!("<Granule>\n", '') # Remove top level element
    xml.gsub!(/<(\w+)>/, '\1: ') # Remove '<>' from around opening brackets and add ': '
    xml.gsub!(/<\/\w+>/, '') # Remove all closing brackets
    xml.gsub!(/^\s*$\n/, '') # Remove empty lines
    xml.gsub!(/^\s*<\w+\s+\w+="\w+"(|\/)>$\n/, '') # Remove empty elements with attributes
    @granule.xml = xml
  end
end
