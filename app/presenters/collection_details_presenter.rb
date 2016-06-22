class CollectionDetailsPresenter < DetailsPresenter
  def initialize(collection, collection_id=nil, token=nil, env='prod')
    @collection = collection
    @collection.id = collection_id
    data_center = ''
    data_center = collection_id.split('-').last if collection_id.is_a?(String)

    if collection.xml
      collection_xml = collection.xml
      @collection.dataset_id = collection_xml['DataSetId']
      @collection.description = collection_xml['Description']
      @collection.short_name = collection_xml['ShortName']
      @collection.version_id = collection_xml['VersionId']
      @collection.archive_center = Array.wrap(collection_xml['ArchiveCenter']).first
      @collection.processing_center = collection_xml['ProcessingCenter']
      @collection.processing_level_id = collection_xml['ProcessingLevelId']
      @collection.orderable = collection_xml['Orderable']
      @collection.visible = collection_xml['Visible']
      @collection.temporal = collection_xml['Temporal']

      @collection.contacts = Array.wrap(collection_xml['Contacts']['Contact']) if collection_xml['Contacts']
      @collection.science_keywords = Array.wrap(collection_xml['ScienceKeywords']['ScienceKeyword']) if collection_xml['ScienceKeywords']
      if collection_xml['OnlineAccessURLs']
        @collection.online_access_urls = Array.wrap(collection_xml['OnlineAccessURLs']['OnlineAccessURL'])
      end
      if collection_xml['OnlineResources']
        online_resources = Array.wrap(collection_xml['OnlineResources']['OnlineResource'])
        online_resources.each do |resource|
          resource['Description'] = resource['URL'] unless resource['Description'] && resource['Description'].size > 0
        end
        @collection.online_resources = online_resources
      else
        @collection.online_resources = []
      end
      @collection.associated_difs = []
      @collection.associated_difs = collection_xml['AssociatedDIFs']['DIF']['EntryId'] if collection_xml['AssociatedDIFs'] && collection_xml['AssociatedDIFs']['DIF']
      @collection.spatial = Array.wrap(collection_xml['Spatial'])
      @collection.browse_images = []
      @collection.browse_images = collection_xml['AssociatedBrowseImageUrls']['ProviderBrowseUrl'] if collection_xml['AssociatedBrowseImageUrls']
    end

    @collection.spatial = spatial(collection.spatial)
    @collection.science_keywords = science_keywords(collection.science_keywords)
    @collection.contacts = contacts(collection.contacts)
    @collection.temporal = temporal(collection.temporal)
    @collection.associated_difs = associated_difs(collection.associated_difs)

    metadata_url = "#{Rails.configuration.services['earthdata'][env]['cmr_root']}/search/concepts/#{@collection.id}"
    url_token = "?token=#{token}:#{client_id(env)}" if token
    @collection.native_url = "#{metadata_url}#{url_token}"
    @collection.atom_url = "#{metadata_url}.atom#{url_token}"
    @collection.echo10_url = "#{metadata_url}.echo10#{url_token}"
    @collection.iso19115_url = "#{metadata_url}.iso19115#{url_token}"
    @collection.dif_url = "#{metadata_url}.dif#{url_token}"
    @collection.smap_iso_url = nil #"#{metadata_url}.smap_iso"
    opensearch_url = "#{Rails.configuration.services['earthdata'][env]['opensearch_root']}/granules/descriptor_document.xml"
    @collection.osdd_url = "#{opensearch_url}?utf8=%E2%9C%93&clientId=#{Rails.configuration.cmr_client_id}&shortName=#{URI.encode_www_form_component(@collection.short_name)}&versionId=#{@collection.version_id}&dataCenter=#{URI.encode_www_form_component(data_center)}&commit=Generate#{url_token}"

    # Set description to URL if URLDescription doesn't exist
    @collection.online_access_urls = [] if @collection.online_access_urls.nil?
    @collection.online_access_urls.each do |url|
      url['description'] = url['URLDescription'].nil? ? url['URL'] : url['URLDescription'].capitalize
    end
  end

  def associated_difs(dif_id)
    url = "http://gcmd.gsfc.nasa.gov/getdif.htm?#{dif_id}"
    {url: url, id: dif_id}
  end

  def contacts(hash)
    if hash
      contact_list = Array.wrap(hash.map do |contact_person|
        person = contact_person['ContactPersons']
        if person && person['ContactPerson']
          first_name = person['ContactPerson']['FirstName'] unless person['ContactPerson']['FirstName'].downcase == 'unknown'
          last_name = person['ContactPerson']['LastName'] unless person['ContactPerson']['LastName'].downcase == 'unknown'
          name = "#{first_name}#{(first_name.nil? || last_name.nil?) ? '' : ' '}#{last_name}"
        else
          name = contact_person['OrganizationName'] || nil
        end
        if contact_person['OrganizationPhones'] && contact_person['OrganizationPhones']['Phone']
          phone = contact_person['OrganizationPhones']['Phone']
          phones = Array.wrap(phone).map{ |p| "#{p['Number']} (#{p['Type']})" }
        else
          phones = []
        end
        if contact_person['OrganizationEmails']
          email = contact_person['OrganizationEmails']['Email']
        else
          email = nil
        end

        {name: name, phones: phones, email: email}
      end)
    else
      contact_list = []
    end

    contact_list
  end

  def science_keywords(keywords)
    if keywords
      keywords.map{ |k| [k['CategoryKeyword'].titleize, k['TopicKeyword'].titleize, k['TermKeyword'].titleize] }.uniq
    else
      []
    end
  end
end
