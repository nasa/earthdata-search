class CwicUrlMapper
  include LinksDecorator

  def info_urls_for(granule)
    if @can_subset
      [@template.expand(decorate(granule).merge({od_ext: '.info'}))]
    else
      []
    end
  end

  def download_urls_for(granule)
    Array.wrap(links_for(granule['link'], 'enclosure', /enclosure/).first)
  end

  def browse_urls_for(granule)
    links_for(granule['link'], /icon/)
  end
end