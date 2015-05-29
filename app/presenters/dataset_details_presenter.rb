class DatasetDetailsPresenter < DetailsPresenter
  def initialize(dataset, collection_id=nil, token=nil, env='ops')
    @dataset = dataset
    @dataset.id = collection_id

    if dataset.xml
      dataset_xml = dataset.xml
      @dataset.dataset_id = dataset_xml['DataSetId']
      @dataset.description = dataset_xml['Description']
      @dataset.short_name = dataset_xml['ShortName']
      @dataset.version_id = dataset_xml['VersionId']
      @dataset.archive_center = dataset_xml['ArchiveCenter']
      @dataset.processing_center = dataset_xml['ProcessingCenter']
      @dataset.processing_level_id = dataset_xml['ProcessingLevelId']
      @dataset.orderable = dataset_xml['Orderable']
      @dataset.visible = dataset_xml['Visible']
      @dataset.temporal = dataset_xml['Temporal']
      @dataset.contacts = Array.wrap(dataset_xml['Contacts']['Contact'])
      @dataset.science_keywords = Array.wrap(dataset_xml['ScienceKeywords']['ScienceKeyword']) if dataset_xml['ScienceKeywords']
      if dataset_xml['OnlineAccessURLs']
        @dataset.online_access_urls = Array.wrap(dataset_xml['OnlineAccessURLs']['OnlineAccessURL'])
      end
      if dataset_xml['OnlineResources']
        online_resources = Array.wrap(dataset_xml['OnlineResources']['OnlineResource'])
        online_resources.each do |resource|
          resource['Description'] = resource['URL'] unless resource['Description'] && resource['Description'].size > 0
        end
        @dataset.online_resources = online_resources
      else
        @dataset.online_resources = []
      end
      @dataset.associated_difs = []
      @dataset.associated_difs = dataset_xml['AssociatedDIFs']['DIF']['EntryId'] if dataset_xml['AssociatedDIFs'] && dataset_xml['AssociatedDIFs']['DIF']
      @dataset.spatial = Array.wrap(dataset_xml['Spatial'])
      @dataset.browse_images = []
      @dataset.browse_images = dataset_xml['AssociatedBrowseImageUrls']['ProviderBrowseUrl'] if dataset_xml['AssociatedBrowseImageUrls']
    end

    @dataset.spatial = spatial(dataset.spatial)
    @dataset.science_keywords = science_keywords(dataset.science_keywords)
    @dataset.contacts = contacts(dataset.contacts)
    @dataset.temporal = temporal(dataset.temporal)
    @dataset.associated_difs = associated_difs(dataset.associated_difs)

    metadata_url = "https://cmr.earthdata.nasa.gov/search/concepts/#{@dataset.id}"
    url_token = "?token=#{token}:#{client_id(env)}" if token
    @dataset.native_url = "#{metadata_url}#{url_token}"
    @dataset.atom_url = "#{metadata_url}.atom#{url_token}"
    @dataset.echo10_url = "#{metadata_url}.echo10#{url_token}"
    @dataset.iso19115_url = "#{metadata_url}.iso19115#{url_token}"
    @dataset.dif_url = "#{metadata_url}.dif#{url_token}"
    @dataset.smap_iso_url = nil #"#{metadata_url}.smap_iso"

    # Set description to URL if URLDescription doesn't exist
    @dataset.online_access_urls = [] if @dataset.online_access_urls.nil?
    @dataset.online_access_urls.each do |url|
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
          name = "#{person['ContactPerson']['FirstName']} #{person['ContactPerson']['LastName']}"
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
      contact_list = ['Not available']
    end

    contact_list
  end

  def science_keywords(keywords)
    if keywords
      keywords.map{ |k| "#{k['CategoryKeyword']} >> #{k['TopicKeyword']} >> #{k['TermKeyword']}" }.uniq
    else
      ['Not available']
    end
  end
end
