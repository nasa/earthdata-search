module LinksDecorator
  extend ActiveSupport::Concern

  private

  def links_for(links, *rels)
    links = Array.wrap(links)
    regexp_rels, string_rels = rels.partition {|rel| rel.is_a?(Regexp)}
    links = links.find_all do |link|
      !link['inherited'] && (string_rels.include?(link) || regexp_rels.any? {|rel| link['rel'][rel]})
    end
    links.map { |link| link['href'] }
  end

  def decorate(granule)
    extra = {}
    start = granule['time_start']
    if start
      day = granule['time_start'].slice(0, 10)
      doy = Date.parse(day).yday.to_s.rjust(3, '0')
      month = granule['time_start'].slice(5, 2)
      extra = {od_doy: doy, od_month: month, od_time_start_dot: day.gsub('-', '.')}
    end
    extra.merge(granule)
  end
end